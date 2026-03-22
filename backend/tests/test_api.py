import io
from unittest.mock import patch
from fastapi.testclient import TestClient
from datetime import datetime
from app.main import app

client = TestClient(app)


def test_get_health_status():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "running"
    assert data["database"] == "connected"
    assert "timestamp" in data
    datetime.fromisoformat(data["timestamp"])


@patch("app.routes.transcription.transcribe_audio")
def test_transcribe_upload_and_return_transcript(mock_transcribe):
    mock_transcribe.return_value = "hello"

    file = io.BytesIO(b"mock audio content")

    response = client.post(
        "/transcribe",
        files={"file": ("hello.mp3", file, "audio/mpeg")},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"].endswith("mp3")
    assert data["transcript"] == "hello"
    assert "filepath" in data
    assert data["filepath"].startswith("uploads")
    assert "created_at" in data
    datetime.fromisoformat(data["created_at"])


@patch("app.routes.search.search_transcriptions")
def test_search_and_return_transcriptions(mock_search):
    mock_search.return_value = [
        {
            "id": 1,
            "filename": "Sample 1.mp3",
            "filepath": "uploads/Sample 1.mp3",
            "transcript": " My name is Ethan. I was asked to come here by 11. Now it is already 3 p.m. They did not even serve me any food or drinks. Terrible.",
            "created_at": "2026-03-19T10:14:01",
        },
        {
            "id": 2,
            "filename": "Sample 2.mp3",
            "filepath": "uploads/Sample 2.mp3",
            "transcript": " Help me. I can't find my parents. They told me to wait for them, but I saw this pretty butterfly and followed it. Now I am lost.",
            "created_at": "2026-03-19T10:15:37",
        },
    ]

    response = client.get("/search", params={"filename": "sample"})
    
    assert response.status_code == 200
    
    data = response.json()
    
    assert isinstance(data, list)
    assert len(data) == 2
    assert isinstance(data[0]["id"], int)
    assert data[0]["filename"] == "Sample 1.mp3"
    assert data[0]["filepath"].startswith("uploads")
    assert "created_at" in data[0]
    datetime.fromisoformat(data[0]["created_at"])
