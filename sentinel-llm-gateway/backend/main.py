from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.sentinel_heuristics import heuristic_score, matched_patterns, detect as heuristic_detect
from engine.sentinel_ml_detector import ml_injection_score
from utils.sanitizer import sanitize_prompt

app = FastAPI(
    title="Sentinel - LLM Safety Gateway",
    description="Real-time security layer that protects LLMs from prompt injection & jailbreak attacks.",
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
    matched_patterns: list[dict] | None = None
    matched_keywords: list[str] | None = None
    heuristic_score: float | None = None
    ml_score: float | None = None
    explanation: str | None = None

@app.get("/")
def health():
    return {"status": "Sentinel API running", "version": app.version}

@app.post("/moderate", response_model=ModerationResponse)
def moderate_prompt(req: PromptRequest):
    prompt = req.prompt or ""

    h_score = float(heuristic_score(prompt))
    ml_score = float(ml_injection_score(prompt))
    final_risk = round((0.4 * h_score) + (0.6 * ml_score), 3)

    if final_risk > 0.75:
        status, safe_prompt = "block", ""
    elif final_risk > 0.40:
        status, safe_prompt = "sanitize", sanitize_prompt(prompt)
    else:
        status, safe_prompt = "allow", prompt

    det = heuristic_detect(prompt)
    explanation = (
        f"{det.label} ({det.risk_score:.3f}) – "
        f"{len(det.matched_rules)} rule(s), {len(det.matched_keywords)} keyword(s) matched – "
        f"combined={final_risk:.3f}"
    )

    return ModerationResponse(
        status=status,
        risk_score=final_risk,
        safe_prompt=safe_prompt,
        matched_patterns=det.matched_rules,
        matched_keywords=det.matched_keywords,
        heuristic_score=h_score,
        ml_score=ml_score,
        explanation=explanation,
    )
