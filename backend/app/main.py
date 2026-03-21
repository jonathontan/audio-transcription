from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routes.health import router as health_router
from app.routes.transcription import router as transcription_router
from app.routes.search import router as search_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Audio Transcription API",
    version="1.0.0",
    docs_url="/swagger",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(health_router)
app.include_router(transcription_router)
app.include_router(search_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")