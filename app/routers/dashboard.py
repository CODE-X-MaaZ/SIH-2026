from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Complaint, Incident
from .incidents import incident_response

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/overview")
def dashboard_overview(
    db: Session = Depends(get_db),
):
    emerging = (
        db.query(Incident)
        .filter(Incident.status == "emerging")
        .order_by(Incident.report_count.desc())
        .all()
    )

    critical_count = (
        db.query(func.count(Complaint.id))
        .filter(Complaint.priority == "critical")
        .scalar()
    )

    active_count = (
        db.query(func.count(Complaint.id))
        .filter(
            Complaint.status.notin_(
                ["resolved"]
            )
        )
        .scalar()
    )

    review_count = (
        db.query(func.count(Complaint.id))
        .filter(
            Complaint.ai_confidence < 0.70
        )
        .scalar()
    )

    return {
        "metrics": {
            "emerging_incidents": len(emerging),
            "critical_complaints": critical_count or 0,
            "active_reports": active_count or 0,
            "needs_review": review_count or 0,
        },
        "needs_attention": [
            incident_response(incident)
            for incident in emerging[:10]
        ],
    }