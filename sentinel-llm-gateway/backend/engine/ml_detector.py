import joblib
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

VECTORIZER_PATH = BASE / "models" / "vectorizer.pkl"
CLASSIFIER_PATH = BASE / "models" / "classifier.pkl"

if VECTORIZER_PATH.exists() and CLASSIFIER_PATH.exists():
    vectorizer = joblib.load(VECTORIZER_PATH)
    classifier = joblib.load(CLASSIFIER_PATH)
else:
    vectorizer = None
    classifier = None

def ml_injection_score(prompt: str) -> float:
    """
    Returns probability that prompt is malicious (0.0 - 1.0).
    If model is not trained yet, returns 0.0 so system still works.
    """
    if vectorizer is None or classifier is None:
        return 0.0
    X = vectorizer.transform([prompt])
    proba = classifier.predict_proba(X)[0][1]
    return float(proba)
