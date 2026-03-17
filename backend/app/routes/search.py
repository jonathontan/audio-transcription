from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import SessionLocal
from app.crud import search_transcriptions
from app.schemas import TranscriptionResponse

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/search", tags=["Search"], response_model=list[TranscriptionResponse])
def search(
    filename: Annotated[str, Query(..., description="Search by filename")],
    db: Annotated[Session, Depends(get_db)],
):
    results = search_transcriptions(db, filename)
    return results
