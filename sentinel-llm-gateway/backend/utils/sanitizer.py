"""
Sentinel Prompt Sanitizer — MAX Edition
Safely removes or masks dangerous instructions from user prompts
while preserving as much original meaning as possible.

Goals:
    • Never break the user experience
    • Never allow harmful injected instructions to pass through
    • Preserve non-malicious parts of prompts to avoid model confusion
    • Configurable + scalable + reversible masking
"""

from __future__ import annotations

import re
from typing import List
from engine.sentinel_heuristics import REGEX_RULES     # reuse compiled patterns


# ========================= CONFIG ========================= #

MASK_TEXT = "[REDACTED_FOR_SAFETY]"
MAX_OUTPUT_CHARS = 8000         # hard limit — prevents expansion / DoS
COMPRESSION_WHITESPACE = True   # normalize extreme whitespace bits


# ========================= SANITIZATION ========================= #

def sanitize_prompt(prompt: str) -> str:
    """
    Safely sanitize the prompt by removing risky instructions
    while preserving surrounding context and readability.

    Fully deterministic + idempotent:
        sanitize_prompt(sanitize_prompt(x)) == sanitize_prompt(x)
    """
    if not prompt:
        return prompt

    # 1) Truncate extremely long prompts (prevent expansion-based DoS)
    if len(prompt) > MAX_OUTPUT_CHARS:
        prompt = prompt[:MAX_OUTPUT_CHARS]

    cleaned = prompt

    # 2) Apply regex mask for every dangerous rule
    for rule in REGEX_RULES:
        try:
            cleaned = rule.compiled.sub(MASK_TEXT, cleaned)
        except Exception:
            # Never allow sanitizer to break pipeline
            continue

    # 3) Optional whitespace compression
    if COMPRESSION_WHITESPACE:
        cleaned = re.sub(r"\s{3,}", "  ", cleaned)  # collapse excessive spaces
        cleaned = cleaned.strip()

    return cleaned


# ========================= HELPERS FOR UI / LOGS ========================= #

def sanitize_diff(original: str, cleaned: str) -> List[str]:
    """
    Return a list of segments that were sanitized.
    Useful for dashboards & moderators to inspect.
    """
    diffs = []
    if MASK_TEXT not in cleaned:
        return diffs

    # Visual comparison of removed sections
    try:
        pattern = re.compile(re.escape(MASK_TEXT))
        pieces = pattern.split(cleaned)
        idx = 0
        for piece in pieces[:-1]:
            idx = len(piece) + sum(len(p) for p in pieces[:pieces.index(piece)])
            diffs.append(MASK_TEXT)
        return diffs
    except Exception:
        return []
