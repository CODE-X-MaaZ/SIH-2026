from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Complaint, Incident

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get("")
def analytics(
    days: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db),
):
    cutoff = datetime.utcnow() - timedelta(days=days)

    total = (
        db.query(func.count(Complaint.id))
        .filter(Complaint.created_at >= cutoff)
        .scalar()
    )

    by_category = (
        db.query(
            Complaint.category,
            func.count(Complaint.id),
        )
        .filter(Complaint.created_at >= cutoff)
        .group_by(Complaint.category)
        .all()
    )

    by_status = (
        db.query(
            Complaint.status,
            func.count(Complaint.id),
        )
        .filter(Complaint.created_at >= cutoff)
        .group_by(Complaint.status)
        .all()
    )

    by_priority = (
        db.query(
            Complaint.priority,
            func.count(Complaint.id),
        )
        .filter(Complaint.created_at >= cutoff)
        .group_by(Complaint.priority)
        .all()
    )

    return {
        "period_days": days,
        "total_reports": total or 0,
        "category_distribution": [
            {
                "category": category or "other",
                "count": count,
            }
            for category, count in by_category
        ],
        "status_distribution": [
            {
                "status": status,
                "count": count,
            }
            for status, count in by_status
        ],
        "priority_distribution": [
            {
                "priority": priority,
                "count": count,
            }
            for priority, count in by_priority
        ],
    }