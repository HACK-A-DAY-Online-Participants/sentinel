import re
from engine.heuristics import DANGEROUS_PATTERNS

def sanitize_prompt(prompt: str) -> str:
    """
    Remove or mask dangerous instructions from the prompt.
    """
    cleaned = prompt
    for pattern in DANGEROUS_PATTERNS:
        cleaned = re.sub(pattern, "[REDACTED_FOR_SAFETY]", cleaned, flags=re.IGNORECASE)
    return cleaned
