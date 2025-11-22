import re

# Regex patterns that indicate prompt injection / jailbreak
DANGEROUS_PATTERNS = [
    r"(?i)ignore (all )?(previous|prior) (instructions|rules|content)",
    r"(?i)reveal (your )?(system|hidden|initial) prompt",
    r"(?i)act as (DAN|developer mode)",
    r"(?i)bypass (safety|guardrails|restrictions)",
    r"(?i)even if it is illegal",
    r"(?i)pretend there are no rules",
    r"(?i)do not follow (safety|policies|guidelines)",
]

# Extra keywords that often appear in malicious prompts
BOOST_KEYWORDS = [
    "hack",
    "exploit",
    "bypass",
    "sql injection",
    "malware",
    "phishing",
]

def heuristic_score(prompt: str) -> float:
    score = 0.0

    # Pattern hits
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, prompt):
            score += 2.0

    # Keyword-based boost
    lower_p = prompt.lower()
    for kw in BOOST_KEYWORDS:
        if kw in lower_p:
            score += 1.0

    # Normalize roughly to 0–1
    return min(score / 12.0, 1.0)

def matched_patterns(prompt: str) -> list[str]:
    hits: list[str] = []
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, prompt):
            hits.append(pattern)
    return hits
