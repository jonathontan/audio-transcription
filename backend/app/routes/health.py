from fastapi import APIRouter
from app.schemas import HealthResponse

router = APIRouter()

@router.get("/health", tags=["health"], response_model=HealthResponse)
def health():
    return {"status": "service running"}