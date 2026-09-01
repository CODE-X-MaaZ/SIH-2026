from fastapi import APIRouter

from ..ai import analyze_text
from ..schemas import AIAnalysisRequest, AIAnalysisResponse

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post(
    "/analyze",
    response_model=AIAnalysisResponse,
)
def analyze_complaint(payload: AIAnalysisRequest):
    return analyze_text(payload.text)