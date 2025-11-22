# Sentinel - LLM Safety Gateway

This project is a lightweight, real-time safety gateway that detects and mitigates
prompt injection attacks before they reach an LLM.

## Structure

- backend/   → FastAPI + heuristics + ML
- datasets/  → benign and malicious prompt examples
- training/  → training script for the ML classifier
- frontend/  → (to be used for Vercel Next.js app)

## Getting Started

### 1. Train the ML model

```bash
cd sentinel-llm-gateway
# Activate backend venv
cd backend
source venv/bin/activate  # or venv\\Scripts\\activate on Windows (Git Bash)
cd ..
python training/train_classifier.py
