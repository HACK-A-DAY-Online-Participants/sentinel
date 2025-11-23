"""
Sentinel Heuristics — Ultimate Edition
Fast + Explainable + Scalable rule-based defense against prompt injection & jailbreaks.

This module is designed to serve as:
    • Layer 1 in a hybrid defense:
        Heuristics  +  ML  +  Risk Policy
    • A standalone low-latency real-time filter for enterprise LLM gateways.

Key advantages:
    ✓ Deterministic & explainable
    ✓ 0-latency startup (precompiled patterns)
    ✓ Auto-extendable (100,000+ external keywords & regex rules)
    ✓ Plays safely with any FastAPI / Vercel / reverse-proxy setup
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Tuple

# What this module exposes
__all__ = [
    "RegexRule",
    "Detection",
    "REGEX_RULES",
    "BUILTIN_KEYWORDS",
    "detect",
    "heuristic_score",
    "matched_patterns",
    "explain",
]

# ========================= CONFIG CONSTANTS ========================= #

BLOCK_THRESHOLD = 0.70         # >= → block
SUSPICIOUS_THRESHOLD = 0.35    # >= → sanitize, < → allow

EXTRA_RULES_FILE = Path(__file__).resolve().parent / "extra_regex_rules.json"
EXTRA_KEYWORDS_FILE = Path(__file__).resolve().parent / "extra_keywords.txt"

MAX_PROMPT_CHARS = 8000        # truncate to avoid DoS from huge prompts


# ========================= DATA CLASSES ========================= #

@dataclass(frozen=True)
class RegexRule:
    pattern: str
    description: str
    weight: float
    compiled: re.Pattern


@dataclass
class Detection:
    risk_score: float                    # 0.0 – 1.0 normalized
    label: str                           # ALLOW | SUSPICIOUS | BLOCK
    matched_rules: List[Dict[str, Any]]
    matched_keywords: List[str]


# ========================= BUILT-IN RULES ========================= #

# Compact defaults — everything else loads externally.
_BUILTIN_REGEX: List[Tuple[str, str, float]] = [
    (r"(?i)ignore (all )?(previous|prior) (instructions|rules|content)", "Instruction override", 3.0),
    (r"(?i)reveal (your )?(system|hidden|initial) prompt", "System prompt extraction", 3.2),
    (r"(?i)act as (DAN|developer mode)", "DAN / dev-mode jailbreak", 2.8),
    (r"(?i)bypass (safety|guardrails|restrictions|filters)", "Safety bypass request", 3.0),
    (r"(?i)pretend there (are|is) no rules", "Rules nullification", 2.5),
    (r"(?i)do not follow (safety|policies|guidelines|rules)", "Rejection of alignment", 2.8),
    (r"(?i)respond without (any )?restrictions", "Request for unrestricted output", 2.4),
    (r"(?i)even if it is (illegal|unethical|dangerous)", "Ignore legality/ethics", 2.8),
]


def _load_extra_regex() -> List[Tuple[str, str, float]]:
    """
    Load additional regex rules from JSON (optional, unbounded scale).

    extra_regex_rules.json format:
        [
          {"pattern": "...", "description": "...", "weight": 2.0},
          ...
        ]
    """
    if not EXTRA_RULES_FILE.exists():
        return []
    try:
        raw = json.loads(EXTRA_RULES_FILE.read_text())
        rules: List[Tuple[str, str, float]] = []
        for r in raw:
            pattern = r.get("pattern")
            if not pattern:
                continue
            desc = r.get("description", "External rule")
            weight = float(r.get("weight", 2.0))
            rules.append((pattern, desc, weight))
        return rules
    except Exception:
        # Fail closed: still use built-ins
        return []


# Merge & compile
REGEX_RULES: List[RegexRule] = [
    RegexRule(pattern=p, description=d, weight=w, compiled=re.compile(p))
    for (p, d, w) in (_BUILTIN_REGEX + _load_extra_regex())
]


# ========================= KEYWORDS (SCALE TO 100K+) ========================= #

_BUILTIN_KEYWORDS: Dict[str, float] = {
    # jailbreak/meta
    "jailbreak": 1.3,
    "prompt injection": 1.1,
    "system prompt": 1.0,
    "developer mode": 1.2,
    # exploit primitives
    "hack": 1.2,
    "exploit": 1.2,
    "payload": 1.1,
    "sql injection": 1.4,
    "reverse shell": 1.5,
    "ransomware": 1.4,
    "bypass": 1.0,
    "ddos": 1.3,
    "phishing": 1.3,
}


def _load_extra_keywords() -> Dict[str, float]:
    """
    Load unlimited external keywords from plain text file (one per line).

    extra_keywords.txt:
        wifi password cracking
        undetectable malware
        ...
    """
    if not EXTRA_KEYWORDS_FILE.exists():
        return {}
    try:
        additions: Dict[str, float] = {}
        for line in EXTRA_KEYWORDS_FILE.read_text().splitlines():
            word = line.strip().lower()
            if word:
                additions.setdefault(word, 0.8)  # default weight for external terms
        return additions
    except Exception:
        return {}


BUILTIN_KEYWORDS: Dict[str, float] = {**_BUILTIN_KEYWORDS, **_load_extra_keywords()}


# ========================= PRECOMPUTED MAX SCORE ========================= #

_MAX_REGEX = sum(r.weight for r in REGEX_RULES)
_MAX_KEY = sum(BUILTIN_KEYWORDS.values())
_MAX_TOTAL = max(_MAX_REGEX + _MAX_KEY, 1.0)   # avoid division by zero


# ========================= CORE DETECTION ENGINE ========================= #

def detect(prompt: str) -> Detection:
    """
    Compute a structured detection result for a given prompt.

    Safe properties:
      • Never raises in normal operation
      • Truncates extremely long prompts
      • Always returns a valid Detection object
    """
    if not prompt:
        return Detection(0.0, "ALLOW", [], [])

    # DoS safety: extremely long prompts get truncated for heuristic scan
    if len(prompt) > MAX_PROMPT_CHARS:
        prompt = prompt[:MAX_PROMPT_CHARS]

    score = 0.0
    lower = prompt.lower()

    matched_rules: List[Dict[str, Any]] = []
    for r in REGEX_RULES:
        if r.compiled.search(prompt):
            score += r.weight
            matched_rules.append(
                {
                    "pattern": r.pattern,
                    "description": r.description,
                    "weight": r.weight,
                }
            )

    matched_keywords: List[str] = []
    for kw, weight in BUILTIN_KEYWORDS.items():
        if kw in lower:
            score += weight
            matched_keywords.append(kw)

    risk = max(0.0, min(score / _MAX_TOTAL, 1.0))

    if risk >= BLOCK_THRESHOLD:
        label = "BLOCK"
    elif risk >= SUSPICIOUS_THRESHOLD:
        label = "SUSPICIOUS"
    else:
        label = "ALLOW"

    return Detection(
        risk_score=round(risk, 3),
        label=label,
        matched_rules=matched_rules,
        matched_keywords=matched_keywords,
    )


# ========================= SHORTCUT HELPERS ========================= #

def heuristic_score(prompt: str) -> float:
    """Return only the numeric risk score [0.0, 1.0]."""
    return detect(prompt).risk_score


def matched_patterns(prompt: str) -> List[Dict[str, Any]]:
    """Return matched regex rules metadata (for UI / logs)."""
    return detect(prompt).matched_rules


def explain(prompt: str) -> str:
    """
    Human-readable explanation string for UI / logs.

    Example:
        "BLOCK (0.842) – 2 rules, 3 keywords matched"
    """
    det = detect(prompt)
    return (
        f"{det.label} ({det.risk_score:.3f}) – "
        f"{len(det.matched_rules)} rule(s), {len(det.matched_keywords)} keyword(s) matched"
    )

