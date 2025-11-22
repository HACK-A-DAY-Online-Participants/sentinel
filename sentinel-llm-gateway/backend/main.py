from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.heuristics import heuristic_score, matched_patterns
from utils.sanitizer import sanitize_prompt
from engine.ml_detector import ml_injection_score

app = FastAPI(
    title="Sentinel - LLM Safety Gateway",
    description="API for detecting prompt injection attacks",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class ModerationResponse(BaseModel):
    status: str
    risk_score: float
    safe_prompt: str
    matched_patterns: list[str] | None = None

@app.get("/")
def health():
    return {"status": "Sentinel API running"}

@app.post("/moderate", response_model=ModerationResponse)
def moderate_prompt(req: PromptRequest):
    prompt = req.prompt

    # Heuristic + ML scores
    h_score = heuristic_score(prompt)
    ml_score = ml_injection_score(prompt)

    # Weighted hybrid risk
    final_risk = (0.4 * h_score) + (0.6 * ml_score)

    # Policy
    if final_risk > 0.75:
        status = "block"
        safe_prompt = ""
    elif final_risk > 0.40:
        status = "sanitize"
        safe_prompt = sanitize_prompt(prompt)
    else:
        status = "allow"
        safe_prompt = prompt

    return ModerationResponse(
        status=status,
        risk_score=final_risk,
        safe_prompt=safe_prompt,
        matched_patterns=matched_patterns(prompt),
    )
