import os
import shutil

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from schemas import TranscriptionResponse
from database import SessionLocal
from crud import create_transcription, get_all_transcriptions
from utils import generate_unique_filename
from whisper_service import transcribe_audio

router = APIRouter()

os.makedirs("uploads", exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()

@router.get("/transcriptions", tags=["transcriptions"], response_model=list[TranscriptionResponse])
def get_transcriptions(db: Session = Depends(get_db)):
    return get_all_transcriptions(db)
