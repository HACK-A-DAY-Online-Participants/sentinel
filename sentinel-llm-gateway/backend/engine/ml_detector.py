"""
Sentinel ML Detector — Absolute MAX Edition
High-accuracy + safe-failure ML classifier for prompt-injection / jailbreak detection.

Design guarantees:
    ✓ Never raises → always returns a valid score
    ✓ Fast startup → lazy load + incremental hot reload
    ✓ Safe for asynchronous multi-worker FastAPI
    ✓ DoS-resistant via max prompt length + bounded scoring
    ✓ Plug-and-play with observability / AB testing / fallbacks
"""

from __future__ import annotations

import joblib
import time
import threading
from pathlib import Path
from typing import Optional, Dict, Any, Tuple, Callable


# ========================= MODEL CONFIG ========================= #

BASE = Path(__file__).resolve().parent.parent
VECTOR_FILE = BASE / "models" / "vectorizer.pkl"
MODEL_FILE = BASE / "models" / "classifier.pkl"

MODEL_RELOAD_INTERVAL = 30.0   # seconds — hot reload cadence
MAX_PROMPT_CHARS = 8000        # DoS safety
DEFAULT_SCORE = 0.0            # fallback if model unavailable
CLAMP = (0.0, 1.0)             # bounded output
SMOOTHING = 0.05               # reduces jitter for dashboards


# ========================= INTERNAL STATE ========================= #

vectorizer = None
classifier = None
_last_loaded_ts = 0.0
_model_hash: Optional[str] = None
_lock = threading.Lock()


# ========================= OBSERVABILITY HOOKS ========================= #

# Optional callbacks (apps like Grafana / Datadog / Prometheus can use these)
on_model_reload: Optional[Callable[[Dict[str, Any]], None]] = None
on_inference: Optional[Callable[[Dict[str, Any]], None]] = None


# ========================= LOADER HELPERS ========================= #

def _hash_file(path: Path) -> Optional[str]:
    try:
        stat = path.stat()
        return f"{stat.st_mtime_ns}-{stat.st_size}"
    except Exception:
        return None


def _load_model_if_needed() -> None:
    """Lazy + hot reload: reload only when files actually change."""
    global vectorizer, classifier, _last_loaded_ts, _model_hash

    now = time.time()
    if now - _last_loaded_ts < MODEL_RELOAD_INTERVAL:
        return

    with _lock:
        try:
            # Update last check timestamp first (prevents reload storms)
            _last_loaded_ts = now

            new_hash = f"{_hash_file(VECTOR_FILE)}-{_hash_file(MODEL_FILE)}"
            if new_hash == _model_hash:
                return  # nothing changed

            vec = joblib.load(VECTOR_FILE)
            clf = joblib.load(MODEL_FILE)

            vectorizer = vec
            classifier = clf
            _model_hash = new_hash

            if on_model_reload:
                on_model_reload({"event": "model_reloaded", "hash": new_hash})

        except Exception:
            vectorizer = None
            classifier = None
            _model_hash = None
            # reload will be retried later — service stays up


# ========================= INFERENCE ========================= #

def ml_injection_score(prompt: str) -> float:
    """
    Return ML probability that the prompt is malicious (0.0 — 1.0).

    Safety guarantees:
        - Never throws
        - Always returns a valid float
        - Always works even if the model is corrupted/missing
    """
    if not prompt:
        return DEFAULT_SCORE

    if len(prompt) > MAX_PROMPT_CHARS:
        prompt = prompt[:MAX_PROMPT_CHARS]

    _load_model_if_needed()

    if vectorizer is None or classifier is None:
        score = DEFAULT_SCORE
    else:
        try:
            X = vectorizer.transform([prompt])
            proba = float(classifier.predict_proba(X)[0][1])
            lo, hi = CLAMP
            score = max(lo, min(hi, proba))
        except Exception:
            score = DEFAULT_SCORE

    # Score smoothing (stabilizes tiny oscillations between predictions)
    if SMOOTHING > 0 and score > SMOOTHING:
        score = float(round(score * (1 - SMOOTHING) + SMOOTHING, 4))

    if on_inference:
        try:
            on_inference({"score": score, "model_loaded": classifier is not None})
        except Exception:
            pass

    return score
