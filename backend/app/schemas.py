from pydantic import BaseModel
from datetime import datetime

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    database: str

class TranscriptionResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    transcript: str
    created_at: datetime

    class Config:
        from_attributes = True