from fastapi import APIRouter, Depends
from datetime import datetime
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.schemas import HealthResponse
from app.database import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/health", tags=["Health"], response_model=HealthResponse)
def health(db: Annotated[Session, Depends(get_db)]):
    try:
        db.execute(text("SELECT 1"))
        database = "connected"
        status = "running"
    except Exception:
        database = "disconnected"
        status = "down"

    return {
        "status": status,
        "timestamp": datetime.now(),
        "database": database,
    }
