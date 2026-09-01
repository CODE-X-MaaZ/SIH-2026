from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)

    complaints = relationship("Complaint", back_populates="department")
    incidents = relationship("Incident", back_populates="department")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(30), unique=True, index=True, nullable=False)

    original_text = Column(Text, nullable=False)
    normalized_text = Column(Text, nullable=False)
    detected_language = Column(String(20), default="en")

    category = Column(String(100), nullable=True)
    category_label = Column(String(150), nullable=True)
    subcategory = Column(String(150), nullable=True)

    priority = Column(String(30), default="medium")
    priority_score = Column(Float, default=0.0)
    ai_confidence = Column(Float, default=0.0)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    display_name = Column(String(255), nullable=True)

    embedding = Column(Text, nullable=True)

    status = Column(String(40), default="submitted")
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    is_duplicate = Column(Boolean, default=False)
    duplicate_of_id = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    department = relationship("Department", back_populates="complaints")
    incident = relationship("Incident", back_populates="complaints")
    events = relationship(
        "ComplaintEvent",
        back_populates="complaint",
        cascade="all, delete-orphan"
    )


class ComplaintEvent(Base):
    __tablename__ = "complaint_events"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(
        Integer,
        ForeignKey("complaints.id"),
        nullable=False
    )

    old_status = Column(String(40), nullable=True)
    new_status = Column(String(40), nullable=False)
    remark = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="events")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    status = Column(String(40), default="emerging")
    priority = Column(String(30), default="medium")

    department_id = Column(Integer, ForeignKey("departments.id"))

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    display_name = Column(String(255), nullable=True)

    report_count = Column(Integer, default=0)
    baseline_count = Column(Integer, default=1)
    growth_multiplier = Column(Float, default=1.0)
    ai_confidence = Column(Float, default=0.0)

    detected_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    department = relationship("Department", back_populates="incidents")
    complaints = relationship("Complaint", back_populates="incident")
    evidence = relationship(
        "IncidentEvidence",
        back_populates="incident",
        cascade="all, delete-orphan"
    )


class IncidentEvidence(Base):
    __tablename__ = "incident_evidence"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(
        Integer,
        ForeignKey("incidents.id"),
        nullable=False
    )

    evidence_type = Column(String(50), nullable=False)
    label = Column(String(255), nullable=False)
    score = Column(Float, default=0.0)

    incident = relationship("Incident", back_populates="evidence")