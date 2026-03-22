# Backend
Handles audio uploads and generating transcriptions.

## Prerequisites
- [Python](https://www.python.org/downloads/) (v3.10+ recommended)
- [FFmpeg](https://www.ffmpeg.org/download.html) (required for audio processing)
- pip

## Getting started
### Create virtual environment
``` bash
python -m venv venv
source venv/Scripts/activate
```

### Install dependencies
``` bash
pip install -r requirements.txt
```

### Start server
``` bash
python -m uvicorn app.main:app --reload
```
Server: http://localhost:8000
API: http://localhost:8000/swagger

### Run test
``` bash
python -m pytest
```

### Build image
``` bash
docker compose build
```

### Start container
``` bash
docker compose up -d
```
