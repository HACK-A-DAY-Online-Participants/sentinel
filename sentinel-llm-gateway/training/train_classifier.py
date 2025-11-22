import joblib
from pathlib import Path
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import LogisticRegression

BASE = Path(__file__).resolve().parent.parent

def load_data():
    benign = (BASE / "datasets" / "benign.txt").read_text().splitlines()
    malicious = (BASE / "datasets" / "malicious.txt").read_text().splitlines()
    X = benign + malicious
    y = [0] * len(benign) + [1] * len(malicious)
    return X, y

def main():
    print("📚 Loading data...")
    X, y = load_data()

    print("🔢 Vectorizing text...")
    vectorizer = HashingVectorizer(
        n_features=2**16,
        alternate_sign=False,
        ngram_range=(1, 2),
    )
    X_vec = vectorizer.transform(X)

    print("🤖 Training Logistic Regression classifier...")
    clf = LogisticRegression(max_iter=2000)
    clf.fit(X_vec, y)

    models_dir = BASE / "backend" / "models"
    models_dir.mkdir(exist_ok=True)

    joblib.dump(vectorizer, models_dir / "vectorizer.pkl")
    joblib.dump(clf, models_dir / "classifier.pkl")

    print("✅ Training complete, models saved to backend/models/")

if __name__ == "__main__":
    main()
