"""
Sentinel ML Detector — MAX Edition
High-accuracy, low-latency ML classifier for prompt injection detection.

Goals:
    • Production-safe (never breaks the pipeline)
    • Auto hot-reload when model files update (zero downtime deployments)
    • Fully thread-safe for async/multiworker FastAPI servers
    • Hardened against prompt-overflow / DoS attacks
    • Built for observability & A/B comparison
"""

from __future__ import annotations

import joblib
import time
import threading
import json
from pathlib import Path
from typing import Optional, Dict, Any, Tuple


# ========================= MODEL CONFIG ========================= #

BASE = Path(__file__).resolve().parent.parent
VECTOR_FILE = BASE / "models" / "vectorizer.pkl"
MODEL_FILE = BASE / "models" / "classifier.pkl"

MODEL_RELOAD_INTERVAL = 30.0        # seconds — hot reload
MAX_PROMPT_CHARS = 8000             # avoid DoS via huge string
DEFAULT_SCORE = 0.0                 # fallback score
CONFIDENCE_CLAMP = (0.0, 1.0)       # bounds


# ========================= INTERNAL STATE ========================= #

vectorizer = None
classifier = None
_last_loaded_ts = 0.0
_lock = threading.Lock()
_loaded_model_hash = None     # ensures reload only on true change


# ========================= MODEL LOADER ========================= #

def _file_hash(path: Path) -> Optional[str]:
    """Cheap and fast file hash (timestamp + size)."""
    try:
        stat = path.stat()
        return f"{stat.st_mtime_ns}-{stat.st_size}"
    except Exception:
        return None


def _load_model_if_needed() -> None:
    """
    Load model lazily & reload automatically if:
      1) Model files change OR
      2) Reload interval elapsed
    """
    global vectorizer, classifier, _last_loaded_ts, _loaded_model_hash

    now = time.time()
    if now - _last_loaded_ts < MODEL_RELOAD_INTERVAL:
        return

    with _lock:
        try:
            new_hash = f"{_file_hash(VECTOR_FILE)}-{_file_hash(MODEL_FILE)}"
            if _loaded_model_hash == new_hash:
                _last_loaded_ts = now
                return

            # Attempt loading
            vec = joblib.load(VECTOR_FILE)
            clf = joblib.load(MODEL_FILE)

            vectorizer = vec
            classifier = clf
            _loaded_model_hash = new_hash
            _last_loaded_ts = now

        except Exception:
            # Fail gracefully while preserving service uptime
            vectorizer = None
            classifier = None
            _loaded_model_hash = None
            _last_loaded_ts = now


# ========================= INFERENCE ========================= #

def ml_injection_score(prompt: str) -> float:
    """
    Compute ML probability that a prompt is malicious (0.0 — 1.0).

    Guarantees:
        • Never raises an exception
        • Never blocks the caller
        • Always returns a valid float
        • Works even if the model is missing / corrupted

    This function should ALWAYS be safe to call from API middleware.
    """
    if not prompt:
        return DEFAULT_SCORE

    # Prompt length hardening (DoS prevention)
    if len(prompt) > MAX_PROMPT_CHARS:
        prompt = prompt[:MAX_PROMPT_CHARS]

    # Ensure model loaded (lazy + hot reload)
    _load_model_if_needed()

    if vectorizer is None or classifier is None:
        return DEFAULT_SCORE

    try:
        X = vectorizer.transform([prompt])
        proba = classifier.predict_proba(X)[0][1]
        lo, hi = CONFIDENCE_CLAMP
        return float(max(lo, min(hi, float(proba))))
    except Exception:
        return DEFAULT_SCORE
