from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
import re
from engine.sentinel_ml_detector import ml_injection_score

import time
import logging
import os

# ---------------- CONFIG ----------------

SAFE_THRESHOLD = float(os.getenv("SENTINEL_SAFE_THRESHOLD", "0.35"))
BLOCK_THRESHOLD = float(os.getenv("SENTINEL_BLOCK_THRESHOLD", "0.8"))

# Simple in-memory rate limit (per IP) – swap to Redis in real prod
RATE_LIMIT_REQUESTS = int(os.getenv("SENTINEL_RATE_LIMIT_REQUESTS", "60"))
RATE_LIMIT_WINDOW = int(os.getenv("SENTINEL_RATE_LIMIT_WINDOW", "60"))  # seconds

# ---------------- LOGGING ----------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("sentinel")


# ---------------- FASTAPI APP ----------------

app = FastAPI(title="Sentinel – LLM Safety Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "*",  # loosen for local dev; tighten in real prod
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limit store: {ip: [(timestamp, ...)]}
_rate_limit_store = {}


# ---------------- SCHEMAS ----------------

class ModerateRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = None


class ModerateResponse(BaseModel):
    status: Literal["allow", "sanitize", "block"]
    risk_score: float
    safe_prompt: Optional[str] = None
    explanation: Optional[str] = None
    reasons: List[str]


# ---------------- DETECTION RULES ----------------

INJECTION_PATTERNS = [
    r"(?i)\bignore (all )?(previous|prior) (instructions|rules|content)\b",
    r"(?i)\boverride (all )?(previous|prior) (instructions|rules)\b",
    r"(?i)\breveal (your )?(system|hidden|initial) prompt\b",
    r"(?i)\bshow (me )?(the )?(system|hidden|initial) prompt\b",
    r"(?i)\b(jailbreak|unfiltered mode|no restrictions)\b",
    r"(?i)\bprompt injection\b",
    r"(?i)\bpretend to be\b.*?(developer mode|DAN)\b",
    r"(?i)\bbypass (safety|filter|guardrails|restrictions?)\b",
]

SECRET_PATTERNS = [
    r"(?i)\bpassword\b",
    r"(?i)\bapi[\s\-_]?key\b",
    r"(?i)\bsecret[\s\-_]?key\b",
    r"(?i)\baccess[\s\-_]?token\b",
    r"(?i)\bprivate[\s\-_]?key\b",
]

DATA_EXFIL_PATTERNS = [
    r"(?i)\bdump\b.*\bdatabase\b",
    r"(?i)\bextract\b.*\bsecrets?\b",
    r"(?i)\bdump\b.*\bmemory\b",
]


def detect_rule_violations(prompt: str) -> List[str]:
    reasons = []

    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, prompt):
            reasons.append(f"Matched injection pattern: {pattern}")

    for pattern in SECRET_PATTERNS:
        if re.search(pattern, prompt):
            reasons.append(f"Matched secret pattern: {pattern}")

    for pattern in DATA_EXFIL_PATTERNS:
        if re.search(pattern, prompt):
            reasons.append(f"Matched data-exfil pattern: {pattern}")

    # Simple heuristic: very long + lots of instructions
    if len(prompt) > 2000 and "ignore" in prompt.lower():
        reasons.append("Heuristic: long prompt with override instruction.")

    return reasons


# ---------------- LEARNING MODULE (RISK SCORE) ----------------

# ml_injection_score is imported above from sentinel_ml_detector

def score_with_learning_module(prompt: str, reasons: List[str]) -> float:
    return ml_injection_score(prompt)



# ---------------- SANITIZER ----------------

UNSANITIZABLE_MARKER = "__UNSANITIZABLE__"


def sanitize_prompt(prompt: str) -> str:
    """
    Very simple sanitizer:
    - Drops lines with obvious jailbreak instructions
    - Redacts secrets
    - If nothing usable left → UNSANITIZABLE_MARKER
    """

    lines = prompt.splitlines()
    kept_lines = []

    for line in lines:
        lower = line.lower()

        # Drop explicit jailbreak / override instructions
        if "ignore previous" in lower or "reveal system prompt" in lower:
            continue
        if "jailbreak" in lower or "developer mode" in lower:
            continue
        if "bypass safety" in lower or "no restrictions" in lower:
            continue

        # Redact secrets
        safe_line = re.sub(r"(?i)password", "[REDACTED_PASSWORD]", line)
        safe_line = re.sub(r"(?i)api[\s\-_]?key", "[REDACTED_API_KEY]", safe_line)
        safe_line = re.sub(r"(?i)secret[\s\-_]?key", "[REDACTED_SECRET_KEY]", safe_line)
        safe_line = re.sub(r"(?i)access[\s\-_]?token", "[REDACTED_TOKEN]", safe_line)
        safe_line = re.sub(r"(?i)private[\s\-_]?key", "[REDACTED_PRIVATE_KEY]", safe_line)

        kept_lines.append(safe_line)

    cleaned = "\n".join(l for l in kept_lines).strip()

    if not cleaned:
        return UNSANITIZABLE_MARKER

    return cleaned


# ---------------- RATE LIMIT ----------------

def check_rate_limit(ip: str):
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    entries = _rate_limit_store.get(ip, [])

    # Only keep recent entries
    entries = [t for t in entries if t > window_start]
    if len(entries) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests to Sentinel from this IP. Slow down.",
        )

    entries.append(now)
    _rate_limit_store[ip] = entries


# ---------------- MODERATION ENDPOINT ----------------

@app.post("/moderate", response_model=ModerateResponse)
async def moderate(req: ModerateRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"

    # Rate limiting (soft prod)
    try:
        check_rate_limit(client_ip)
    except HTTPException as e:
        logger.warning(f"Rate limit exceeded from IP={client_ip}")
        raise e

    prompt = req.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    logger.info(f"[Sentinel] Incoming prompt from IP={client_ip} | user_id={req.user_id}")

    # 1) Rule-based violations
    reasons = detect_rule_violations(prompt)

    # 2) ML risk score
    risk_score = score_with_learning_module(prompt, reasons)
    logger.info(
        f"[Sentinel] Risk score={risk_score:.2f} | reasons={'; '.join(reasons) or 'none'}"
    )

    # 3) Decision logic
    #   > BLOCK_THRESHOLD → hard block
    #   > SAFE_THRESHOLD → sanitize if possible
    #   else → allow

    # 🔴 BLOCK
    if risk_score >= BLOCK_THRESHOLD:
        explanation = (
            "Prompt considered highly risky. "
            "Possible prompt injection, secret exfiltration, or unsafe control attempt."
        )
        if reasons:
            explanation += " " + " ".join(reasons)

        logger.warning(f"[Sentinel] BLOCK | risk={risk_score:.2f}")

        return ModerateResponse(
            status="block",
            risk_score=risk_score,
            safe_prompt=None,
            explanation=explanation,
            reasons=reasons or ["High risk score"],
        )

    # 🟡 SANITIZE
    if risk_score >= SAFE_THRESHOLD or reasons:
        # Try to sanitize
        safe = sanitize_prompt(prompt)

        if safe == UNSANITIZABLE_MARKER:
            explanation = (
                "Prompt intent appears unsafe or purely focused on bypassing "
                "protections and could not be rewritten safely."
            )
            if reasons:
                explanation += " " + " ".join(reasons)

            logger.warning(f"[Sentinel] BLOCK (unsanitizable) | risk={risk_score:.2f}")

            return ModerateResponse(
                status="block",
                risk_score=risk_score,
                safe_prompt=None,
                explanation=explanation,
                reasons=reasons or ["Unsanitizable malicious intent"],
            )

        logger.info(f"[Sentinel] SANITIZE | risk={risk_score:.2f}")
        return ModerateResponse(
            status="sanitize",
            risk_score=risk_score,
            safe_prompt=safe,
            explanation="Prompt was sanitized to remove unsafe instructions or secrets.",
            reasons=reasons or ["Medium risk; sanitized for safety"],
        )

    # 🟢 ALLOW
    logger.info(f"[Sentinel] ALLOW | risk={risk_score:.2f}")
    return ModerateResponse(
        status="allow",
        risk_score=risk_score,
        safe_prompt=None,
        explanation="Prompt considered safe to forward.",
        reasons=reasons or ["Low risk score; no dangerous patterns detected"],
    )
