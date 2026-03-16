from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
from sqlalchemy.sql import func

class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), index=True, nullable=False, unique=True)
    filepath = Column(String(512), nullable=False)
    transcript = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
