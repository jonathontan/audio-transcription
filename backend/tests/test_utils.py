import os
from app.utils import generate_unique_filename, sanitize_filename, is_valid_file_type


def test_generate_unique_filename_returns_filename_when_file_does_not_exist(tmp_path):
    filename = "Sample 1.mp3"

    result = generate_unique_filename(str(tmp_path), filename)

    assert result == "Sample 1.mp3"

def test_generate_unique_filename_returns_unique_filename_when_file_exists(tmp_path):
    existing_file = tmp_path / "Sample 1.mp3"
    existing_file.write_bytes(b"mock audio")
    
    result = generate_unique_filename(str(tmp_path), "Sample 1.mp3")
    assert result == "Sample 1_1.mp3"
    
def test_is_valid_file_type_accepts_allowed_extensions():
    result = is_valid_file_type("Sample 1.mp3", "audio/mpeg")
    
    assert result is True
    
def test_is_valid_file_type_rejects_mismatched_content_type():
    result = is_valid_file_type("Sample 1.mp3", "text/plain")
    
    assert result is False 