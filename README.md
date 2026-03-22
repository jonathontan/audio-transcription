# Audio transcription
An application for uploading audio files and generating transcriptions using Whisper speech recognition model.

## Features
- Upload audio files
- Supports multiple formats: `.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg`
- File validation (type, size, count)
- Transcription using HuggingFace Whisper
- Store and manage transcripts
- Support audio playback
- Search transcriptions
- UI built with Material UI

## Tech Stack
- **Frontend**: React, TypeScript, Vite, MUI
- **Backend**: FastAPI, SQLAlchemy
- **Machine Learning**: Whisper (HuggingFace Transformers)
- **Infra**: Docker

## Prerequisites
- [Node.js](https://nodejs.org/en/download) (v18+ recommended)
- [Python](https://www.python.org/downloads/) (v3.10+ recommended)
- [FFmpeg](https://www.ffmpeg.org/download.html) (required for audio processing)
- [Docker](https://www.docker.com/products/docker-desktop/) (recommended)

## Getting started
### Install FFmeg
```
sudo apt update
sudo apt install ffmeg
sudo ffmpeg --version
```

### Create .env file in frontend
```bash 
VITE_BACKEND_SERVICE=http://localhost:8000
```

### Build and run using Docker

```bash
docker-compose up --build -d
```

## Services
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/swagger

## Docs
- Backend: [README.md](./backend/README.md)
- Frontend: [README.md](./frontend/README.md)