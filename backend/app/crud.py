from sqlalchemy.orm import Session
from .models import Transcription


def get_all_transcriptions(db: Session):
    return db.query(Transcription).order_by(Transcription.created_at.desc()).all()


def create_transcription(db: Session, filename: str, filepath: str, transcript: str):
    data = Transcription(filename=filename, filepath=filepath, transcript=transcript)

    db.add(data)
    db.commit()
    db.refresh(data)
    return data


def delete_transcription(db: Session, id: int):
    result = db.query(Transcription).filter(Transcription.id == id).first()

    if not result:
        return None

    db.delete(result)
    db.commit()
    return result


def search_transcriptions(db: Session, filename: str):
    results = (
        db.query(Transcription)
        .filter(Transcription.filename.contains(filename))
        .order_by(Transcription.created_at)
        .all()
    )
    return results
