from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Complaint, Incident

router = APIRouter(prefix="/api/map", tags=["Maps"])


@router.get("/complaints")
def complaint_map(
    category: str | None = None,
    days: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db),
):
    cutoff = datetime.utcnow() - timedelta(days=days)

    query = (
        db.query(Complaint)
        .filter(
            Complaint.created_at >= cutoff,
            Complaint.latitude.isnot(None),
            Complaint.longitude.isnot(None),
        )
    )

    if category:
        query = query.filter(
            Complaint.category == category
        )

    complaints = query.all()

    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        complaint.longitude,
                        complaint.latitude,
                    ],
                },
                "properties": {
                    "complaintId": complaint.id,
                    "trackingId": complaint.tracking_id,
                    "incidentId": complaint.incident_id,
                    "category": complaint.category,
                    "priority": complaint.priority,
                    "status": complaint.status,
                },
            }
            for complaint in complaints
        ],
    }


@router.get("/incidents")
def incident_map(db: Session = Depends(get_db)):
    incidents = (
        db.query(Incident)
        .filter(
            Incident.latitude.isnot(None),
            Incident.longitude.isnot(None),
        )
        .all()
    )

    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        incident.longitude,
                        incident.latitude,
                    ],
                },
                "properties": {
                    "incidentId": incident.id,
                    "title": incident.title,
                    "category": incident.category,
                    "priority": incident.priority,
                    "status": incident.status,
                    "reportCount": incident.report_count,
                },
            }
            for incident in incidents
        ],
    }


@router.get("/hotspots")
def hotspots(
    days: int = Query(default=30, ge=1, le=365),
    grid_size: float = Query(default=0.01, gt=0),
    db: Session = Depends(get_db),
):
    cutoff = datetime.utcnow() - timedelta(days=days)

    complaints = (
        db.query(Complaint)
        .filter(
            Complaint.created_at >= cutoff,
            Complaint.latitude.isnot(None),
            Complaint.longitude.isnot(None),
            Complaint.is_duplicate == False,
        )
        .all()
    )

    grouped = {}

    for complaint in complaints:
        lat_grid = round(
            complaint.latitude / grid_size
        ) * grid_size

        lon_grid = round(
            complaint.longitude / grid_size
        ) * grid_size

        key = (
            round(lat_grid, 4),
            round(lon_grid, 4),
        )

        if key not in grouped:
            grouped[key] = {
                "latitude": key[0],
                "longitude": key[1],
                "count": 0,
                "categories": {},
            }

        grouped[key]["count"] += 1

        category = complaint.category or "other"
        grouped[key]["categories"][category] = (
            grouped[key]["categories"].get(category, 0) + 1
        )

    return sorted(
        grouped.values(),
        key=lambda item: item["count"],
        reverse=True,
    )