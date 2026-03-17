import os
import aiofiles

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session

from app.schemas import TranscriptionResponse
from app.database import SessionLocal
from app.crud import create_transcription, get_all_transcriptions, delete_transcription
from app.utils import (
    generate_unique_filename,
    is_valid_file_type,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE,
)
from app.whisper_service import transcribe_audio

router = APIRouter()

os.makedirs("uploads", exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/transcriptions",
    tags=["Transcriptions"],
    response_model=list[TranscriptionResponse],
)
def get_transcriptions(db: Annotated[Session, Depends(get_db)]):
    return get_all_transcriptions(db)


@router.post(
    "/transcribe",
    tags=["Transcriptions"],
    response_model=TranscriptionResponse,
    responses={
        400: {"description": "Invalid request or unsupported file type"},
        500: {"description": "Fail to generate"},
    },
)
async def generate_transcriptions(
    file: Annotated[UploadFile, File(...)], db: Annotated[Session, Depends(get_db)]
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is missing")
    if not is_valid_file_type(file.filename, file.content_type):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Accept: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    new_filename = generate_unique_filename("uploads", file.filename)
    file_path = os.path.join("uploads", new_filename)

    try:
        file_size = 0
        async with aiofiles.open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    await buffer.close()
                    if os.path.exists(file_path):
                        os.remove(file_path)

                    raise HTTPException(
                        status_code=400,
                        detail="File exceeds limit. Maximum size is 1MB",
                    )
                await buffer.write(chunk)

        audio_transcript = transcribe_audio(file_path)
        data = create_transcription(
            db=db,
            filename=new_filename,
            filepath=file_path,
            transcript=audio_transcript,
        )

        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.delete(
    "/{id}",
    tags=["Transcriptions"],
    responses={
        200: {"description": "Success"},
        404: {"description": "Id not found"},
    },
)
def delete_transcription_route(id: int, db: Annotated[Session, Depends(get_db)]):
    transcription = delete_transcription(db, id)

    if not transcription:
        raise HTTPException(status_code=404, detail="Id not found")

    return f"Transcription {id} deleted succesffully."
