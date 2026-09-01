from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Complaint, Incident, IncidentEvidence
from ..schemas import IncidentResponse, LocationInput

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])


def incident_response(incident: Incident) -> dict:
    department_name = None

    if incident.department:
        department_name = incident.department.name

    return {
        "id": incident.id,
        "title": incident.title,
        "category": incident.category,
        "status": incident.status,
        "priority": incident.priority,
        "report_count": incident.report_count,
        "baseline_count": incident.baseline_count,
        "growth_multiplier": incident.growth_multiplier,
        "ai_confidence": incident.ai_confidence,
        "location": {
            "latitude": incident.latitude,
            "longitude": incident.longitude,
            "display_name": incident.display_name,
        },
        "department": department_name,
        "detected_at": incident.detected_at,
    }


@router.get("", response_model=list[IncidentResponse])
def list_incidents(
    status: str | None = None,
    priority: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Incident)

    if status:
        query = query.filter(Incident.status == status)

    if priority:
        query = query.filter(Incident.priority == priority)

    if category:
        query = query.filter(Incident.category == category)

    incidents = (
        query
        .order_by(Incident.report_count.desc())
        .all()
    )

    return [
        incident_response(incident)
        for incident in incidents
    ]


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return incident_response(incident)


@router.get("/{incident_id}/reports")
def incident_reports(
    incident_id: int,
    db: Session = Depends(get_db),
):
    complaints = (
        db.query(Complaint)
        .filter(Complaint.incident_id == incident_id)
        .order_by(Complaint.created_at.desc())
        .all()
    )

    return [
        {
            "complaint_id": complaint.id,
            "tracking_id": complaint.tracking_id,
            "text": complaint.original_text,
            "category": complaint.category,
            "priority": complaint.priority,
            "status": complaint.status,
            "latitude": complaint.latitude,
            "longitude": complaint.longitude,
            "created_at": complaint.created_at,
        }
        for complaint in complaints
    ]


@router.get("/{incident_id}/evidence")
def incident_evidence(
    incident_id: int,
    db: Session = Depends(get_db),
):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return {
        "incident_id": incident.id,
        "evidence": [
            {
                "type": item.evidence_type,
                "label": item.label,
                "score": item.score,
            }
            for item in incident.evidence
        ],
        "explanation": (
            "These reports are likely related because they "
            "describe a similar issue and are concentrated "
            "in the same geographic area."
        ),
    }


@router.get("/{incident_id}/growth")
def incident_growth(
    incident_id: int,
    db: Session = Depends(get_db),
):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    complaints = (
        db.query(Complaint)
        .filter(Complaint.incident_id == incident_id)
        .order_by(Complaint.created_at.asc())
        .all()
    )

    buckets = {}

    for complaint in complaints:
        timestamp = complaint.created_at.replace(
            minute=0,
            second=0,
            microsecond=0,
        )

        key = timestamp.isoformat()
        buckets[key] = buckets.get(key, 0) + 1

    points = [
        {
            "timestamp": timestamp,
            "count": count,
        }
        for timestamp, count in buckets.items()
    ]

    return {
        "incident_id": incident.id,
        "baseline": incident.baseline_count,
        "current": incident.report_count,
        "growth_multiplier": incident.growth_multiplier,
        "points": points,
    }


@router.patch("/{incident_id}/status")
def update_incident_status(
    incident_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    allowed = {
        "emerging",
        "investigating",
        "assigned",
        "action_in_progress",
        "resolved",
        "possibly_unresolved",
        "reopened",
    }

    if status not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid incident status",
        )

    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    incident.status = status

    if status == "resolved":
        incident.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(incident)

    return incident_response(incident)