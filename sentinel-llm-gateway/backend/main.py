from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.sentinel_heuristics import (
    heuristic_score,
    matched_patterns,
    detect as heuristic_detect,
)
from engine.sentinel_ml_detector import ml_injection_score
from utils.sanitizer import sanitize_prompt


app = FastAPI(
    title="Sentinel - LLM Safety Gateway",
    description="Real-time security layer that protects LLMs from prompt injection & jailbreak attacks.",
    version="1.0.0",
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # open for Vercel/frontend demo phase
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- DATA MODELS --------------------
class PromptRequest(BaseModel):
    prompt: str


class ModerationResponse(BaseModel):
    status: str                    # allow / sanitize / block
    risk_score: float              # final combined 0–1
    safe_prompt: str               # sanitized or original
    matched_patterns: list[dict] | None = None
    matched_keywords: list[str] | None = None
    heuristic_score: float | None = None
    ml_score: float | None = None
    explanation: str | None = None


# -------------------- HEALTH --------------------
@app.get("/")
def health():
    return {
        "status": "Sentinel API running",
        "version": app.version,
        "service": "llm-safety-gateway",
    }


# -------------------- MODERATION CORE --------------------
@app.post("/moderate", response_model=ModerationResponse)
def moderate_prompt(req: PromptRequest):
    prompt = req.prompt or ""

    # 1. Score using heuristics + ML
    h_score = float(heuristic_score(prompt))
    ml_score = float(ml_injection_score(prompt))
    final_risk = (0.4 * h_score) + (0.6 * ml_score)
    final_risk = round(min(max(final_risk, 0.0), 1.0), 3)  # clamp + round

    # 2. Risk → Policy
    if final_risk > 0.75:
        status = "block"
        safe_prompt = ""
    elif final_risk > 0.40:
        status = "sanitize"
        safe_prompt = sanitize_prompt(prompt)
    else:
        status = "allow"
        safe_prompt = prompt

    # 3. Detailed metadata — ideal for UI or monitoring
    det = heuristic_detect(prompt)
    explanation = (
        f"{det.label} ({det.risk_score:.3f}) · "
        f"{len(det.matched_rules)} rule(s), {len(det.matched_keywords)} keyword(s) matched · "
        f"combined={final_risk:.3f}"
    )

    # 4. Structured response
    return ModerationResponse(
        status=status,
        risk_score=final_risk,
        safe_prompt=safe_prompt,
        matched_patterns=det.matched_rules,
        matched_keywords=det.matched_keywords,
        heuristic_score=round(h_score, 3),
        ml_score=round(ml_score, 3),
        explanation=explanation,
    )
