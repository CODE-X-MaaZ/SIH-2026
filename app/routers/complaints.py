import json
import secrets
import string
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..ai import (
    calculate_distance_meters,
    cosine_similarity,
    create_embedding,
    embedding_from_json,
    embedding_to_json,
)
from ..ai import analyze_text
from ..database import get_db
from ..models import Complaint, ComplaintEvent, Department, Incident
from ..schemas import (
    ComplaintCreate,
    ComplaintEventResponse,
    ComplaintResponse,
    RelatedComplaint,
    RelatedComplaintsResponse,
    StatusUpdate,
)

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])


def create_tracking_id() -> str:
    alphabet = string.ascii_uppercase + string.digits
    code = "".join(secrets.choice(alphabet) for _ in range(5))
    return f"NR-{code}"


def complaint_to_response(complaint: Complaint) -> dict:
    return {
        "complaint_id": complaint.id,
        "tracking_id": complaint.tracking_id,
        "original_text": complaint.original_text,
        "normalized_text": complaint.normalized_text,
        "detected_language": complaint.detected_language,
        "category": complaint.category,
        "category_label": complaint.category_label,
        "subcategory": complaint.subcategory,
        "priority": complaint.priority,
        "priority_score": complaint.priority_score,
        "location": {
            "latitude": complaint.latitude,
            "longitude": complaint.longitude,
            "display_name": complaint.display_name,
        },
        "confidence": complaint.ai_confidence,
        "status": complaint.status,
        "incident_id": complaint.incident_id,
        "is_duplicate": complaint.is_duplicate,
        "duplicate_of_id": complaint.duplicate_of_id,
        "created_at": complaint.created_at,
    }


def find_related_complaint(
    db: Session,
    embedding: list[float],
    latitude: float | None,
    longitude: float | None,
    category: str | None,
    current_id: int | None = None,
):
    complaints = (
        db.query(Complaint)
        .filter(Complaint.embedding.isnot(None))
        .all()
    )

    best = None

    for complaint in complaints:
        if current_id and complaint.id == current_id:
            continue

        if category and complaint.category != category:
            continue

        old_embedding = embedding_from_json(complaint.embedding)

        if not old_embedding:
            continue

        similarity = cosine_similarity(embedding, old_embedding)

        distance = calculate_distance_meters(
            latitude,
            longitude,
            complaint.latitude,
            complaint.longitude,
        )

        if distance is not None and distance > 2_000:
            continue

        if similarity >= 0.82:
            if best is None or similarity > best["similarity"]:
                best = {
                    "complaint": complaint,
                    "similarity": similarity,
                    "distance": distance,
                }

    return best


@router.post("", response_model=ComplaintResponse)
def create_complaint(
    payload: ComplaintCreate,
    db: Session = Depends(get_db),
):
    analysis = analyze_text(payload.original_text)
    embedding = create_embedding(analysis["normalized_text"])

    department = None

    if analysis["department"]:
        department = (
            db.query(Department)
            .filter(
                Department.code == analysis["department"]
            )
            .first()
        )

    related = find_related_complaint(
        db=db,
        embedding=embedding,
        latitude=payload.latitude,
        longitude=payload.longitude,
        category=analysis["category"],
    )

    tracking_id = create_tracking_id()

    complaint = Complaint(
        tracking_id=tracking_id,
        original_text=payload.original_text,
        normalized_text=analysis["normalized_text"],
        detected_language=analysis["language"],
        category=analysis["category"],
        category_label=analysis["category_label"],
        subcategory=analysis["subcategory"],
        priority=analysis["priority"],
        priority_score=analysis["priority_score"],
        ai_confidence=analysis["confidence"],
        latitude=payload.latitude,
        longitude=payload.longitude,
        display_name=payload.display_name,
        embedding=embedding_to_json(embedding),
        department_id=department.id if department else None,
        status="submitted",
        is_duplicate=related is not None,
        duplicate_of_id=(
            related["complaint"].id
            if related
            else None
        ),
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    event = ComplaintEvent(
        complaint_id=complaint.id,
        old_status=None,
        new_status="submitted",
        remark="Complaint submitted by citizen",
    )

    db.add(event)
    db.commit()

    return complaint_to_response(complaint)


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    return complaint_to_response(complaint)


@router.get(
    "/track/{tracking_id}",
    response_model=ComplaintResponse,
)
def track_complaint(
    tracking_id: str,
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.tracking_id == tracking_id.upper()
        )
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Tracking ID not found",
        )

    return complaint_to_response(complaint)


@router.get("", response_model=list[ComplaintResponse])
def list_complaints(
    status: str | None = None,
    category: str | None = None,
    priority: str | None = None,
    limit: int = Query(default=50, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Complaint)

    if status:
        query = query.filter(Complaint.status == status)

    if category:
        query = query.filter(Complaint.category == category)

    if priority:
        query = query.filter(Complaint.priority == priority)

    complaints = (
        query
        .order_by(Complaint.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        complaint_to_response(complaint)
        for complaint in complaints
    ]


@router.patch(
    "/{complaint_id}/status",
    response_model=ComplaintResponse,
)
def update_complaint_status(
    complaint_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
):
    allowed = {
        "submitted",
        "classified",
        "investigating",
        "assigned",
        "action_in_progress",
        "resolved",
        "possibly_unresolved",
        "reopened",
    }

    if payload.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {sorted(allowed)}",
        )

    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    old_status = complaint.status
    complaint.status = payload.status

    event = ComplaintEvent(
        complaint_id=complaint.id,
        old_status=old_status,
        new_status=payload.status,
        remark=payload.remark,
    )

    db.add(event)
    db.commit()
    db.refresh(complaint)

    return complaint_to_response(complaint)


@router.get(
    "/{complaint_id}/events",
    response_model=list[ComplaintEventResponse],
)
def complaint_events(
    complaint_id: int,
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    return complaint.events


@router.get(
    "/{complaint_id}/related",
    response_model=RelatedComplaintsResponse,
)
def related_complaints(
    complaint_id: int,
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    current_embedding = embedding_from_json(complaint.embedding)

    if not current_embedding:
        return {
            "complaint_id": complaint.id,
            "related_complaints": [],
            "correlation": {
                "semantic_score": 0,
                "geographic_score": 0,
                "temporal_score": 0,
            },
        }

    related_reports = []

    for other in (
        db.query(Complaint)
        .filter(
            Complaint.id != complaint.id,
            Complaint.embedding.isnot(None),
            Complaint.category == complaint.category,
        )
        .all()
    ):
        other_embedding = embedding_from_json(other.embedding)

        similarity = cosine_similarity(
            current_embedding,
            other_embedding,
        )

        if similarity < 0.70:
            continue

        distance = calculate_distance_meters(
            complaint.latitude,
            complaint.longitude,
            other.latitude,
            other.longitude,
        )

        time_difference = abs(
            (
                complaint.created_at - other.created_at
            ).total_seconds()
        ) / 60

        related_reports.append(
            RelatedComplaint(
                complaint_id=other.id,
                tracking_id=other.tracking_id,
                similarity=round(similarity, 2),
                distance_meters=distance,
                time_difference_minutes=round(
                    time_difference,
                    2,
                ),
                original_text=other.original_text,
            )
        )

    related_reports.sort(
        key=lambda item: item.similarity,
        reverse=True,
    )

    return {
        "complaint_id": complaint.id,
        "related_complaints": related_reports[:20],
        "correlation": {
            "semantic_score": (
                related_reports[0].similarity
                if related_reports
                else 0
            ),
            "geographic_score": 0.90,
            "temporal_score": 0.90,
        },
    }