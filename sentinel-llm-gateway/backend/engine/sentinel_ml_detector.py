from __future__ import annotations

import joblib
import time
import threading
from pathlib import Path
from typing import Optional, Callable, Dict, Any

BASE = Path(__file__).resolve().parent.parent
VECTOR_FILE = BASE / "models" / "vectorizer.pkl"
MODEL_FILE = BASE / "models" / "classifier.pkl"

MODEL_RELOAD_INTERVAL = 30.0
MAX_PROMPT_CHARS = 8000
DEFAULT_SCORE = 0.0
CLAMP = (0.0, 1.0)
SMOOTHING = 0.05

vectorizer: Optional[Any] = None
classifier: Optional[Any] = None
_last_loaded_ts = 0.0
_model_hash: Optional[str] = None
_lock = threading.Lock()

on_model_reload: Optional[Callable[[Dict[str, Any]], None]] = None
on_inference: Optional[Callable[[Dict[str, Any]], None]] = None

def _hash(path: Path):
    try:
        s = path.stat()
        return f"{s.st_mtime_ns}-{s.st_size}"
    except:
        return None

def _load_model_if_needed():
    global vectorizer, classifier, _last_loaded_ts, _model_hash
    now = time.time()
    if now - _last_loaded_ts < MODEL_RELOAD_INTERVAL:
        return

    with _lock:
        _last_loaded_ts = now
        new_hash = f"{_hash(VECTOR_FILE)}-{_hash(MODEL_FILE)}"
        if new_hash == _model_hash:
            return
        try:
            vectorizer = joblib.load(VECTOR_FILE)
            classifier = joblib.load(MODEL_FILE)
            _model_hash = new_hash
        except:
            vectorizer = None
            classifier = None
            _model_hash = None

def ml_injection_score(prompt: str) -> float:
    if not prompt:
        return DEFAULT_SCORE
    if len(prompt) > MAX_PROMPT_CHARS:
        prompt = prompt[:MAX_PROMPT_CHARS]

    _load_model_if_needed()
    if vectorizer is None or classifier is None:
        return DEFAULT_SCORE

    try:
        X = vectorizer.transform([prompt])
        proba = float(classifier.predict_proba(X)[0][1])
        lo, hi = CLAMP
        score = max(lo, min(hi, proba))
    except:
        score = DEFAULT_SCORE

    if SMOOTHING > 0 and score > SMOOTHING:
        score = float(round(score * (1 - SMOOTHING) + SMOOTHING, 4))
    return score
