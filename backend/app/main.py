from fastapi import FastAPI

app = FastAPI(
    title="Audio Transcription API",
    version="1.0.0",
    docs_url="/swagger",
)

@app.get("/health")
def health():
    return {"status": "service running"}