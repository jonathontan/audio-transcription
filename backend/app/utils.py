import os
import re

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".flac", ".ogg"}
ALLOWED_MIME_TYPES = {
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/m4a",
    "audio/ogg",
    "audio/flac"
}

def generate_unique_filename(directory: str, filename: str) -> str:
    stem, ext = os.path.splitext(filename)
    unique_name = filename
    count = 1

    while os.path.exists(os.path.join(directory, unique_name)):
        unique_name = f"{stem}_{count}{ext}"
        count += 1
    
    return unique_name

def sanitize_filename(filename: str) -> str:
    filename = os.path.basename(filename)
    filename = re.sub(r"[^\w\-.]", "_", filename)
    return filename

def is_valid_file_type(filename: str, content_type: str) -> bool:
    _, ext = os.path.splitext(filename.lower())
    valid_ext = ext in ALLOWED_EXTENSIONS
    valid_mine = content_type in ALLOWED_MIME_TYPES
    return valid_ext and valid_mine