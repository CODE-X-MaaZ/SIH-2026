from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class LocationInput(BaseModel):
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    display_name: Optional[str] = None


class ComplaintCreate(BaseModel):
    original_text: str = Field(..., min_length=5, max_length=5000)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    display_name: Optional[str] = None


class AIAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=5000)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AIAnalysisResponse(BaseModel):
    language: str
    normalized_text: str
    category: Optional[str]
    category_label: Optional[str]
    priority: str
    priority_score: float
    confidence: float


class ComplaintResponse(BaseModel):
    complaint_id: int
    tracking_id: str
    original_text: str
    normalized_text: str
    detected_language: str
    category: Optional[str]
    category_label: Optional[str]
    subcategory: Optional[str]
    priority: str
    priority_score: float
    location: LocationInput
    confidence: float
    status: str
    incident_id: Optional[int]
    is_duplicate: bool
    duplicate_of_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: str
    remark: Optional[str] = None


class ComplaintEventResponse(BaseModel):
    old_status: Optional[str]
    new_status: str
    remark: Optional[str]
    created_at: datetime


class RelatedComplaint(BaseModel):
    complaint_id: int
    tracking_id: str
    similarity: float
    distance_meters: Optional[float]
    time_difference_minutes: Optional[float]
    original_text: str


class RelatedComplaintsResponse(BaseModel):
    complaint_id: int
    related_complaints: List[RelatedComplaint]
    correlation: dict


class IncidentResponse(BaseModel):
    id: int
    title: str
    category: str
    status: str
    priority: str
    report_count: int
    baseline_count: int
    growth_multiplier: float
    ai_confidence: float
    location: LocationInput
    department: Optional[str]
    detected_at: datetime

    class Config:
        from_attributes = True 