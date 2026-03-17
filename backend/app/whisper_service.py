from transformers import pipeline

_model = None

def get_model():
    """Lazy load the whisper-tiny model."""
    global _model

    if _model is None:
        print("Loading whisper-tiny model...")
        _model = pipeline(
            task="automatic-speech-recognition",
            model="openai/whisper-tiny",
            language="en",
        )
        print("Model loaded.")

    return _model


def transcribe_audio(filepath: str) -> str:
    """
    Transcribe audio using openai/whisper-tiny model from Hugging Face.

    Args:
        filepath: path to audio file

    Returns:
        Transcription as a string
    """
    model = get_model()
    
    transcription = model(
        filepath,
        return_timestamps=True,
        chunk_length_s=30
    )
    
    return transcription["text"]