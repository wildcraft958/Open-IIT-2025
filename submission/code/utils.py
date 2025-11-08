"""Small utility helpers used by the preprocessing and viz scripts.

This module provides a few lightweight helpers so `data_preprocessing.py`
and `visualization_functions.py` can be executed either as part of a package
or run directly as scripts during development.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Iterable, List, Tuple

import pandas as pd


def ensure_dir(path: Path | str) -> None:
    """Create directory if it doesn't exist."""

    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)


def clean_list_field(value) -> List[str]:
    """Normalize a multi-value field into a list of cleaned strings.

    Supports already-list values, JSON-list strings, and common delimiters
    like commas, semicolons and pipes. Empty / unknown-like values return
    an empty list.
    """

    if value is None:
        return []
    if isinstance(value, (list, tuple)):
        return [str(x).strip() for x in value if x is not None and str(x).strip()]

    s = str(value).strip()
    if s == '' or s.lower() in {'none', 'nan', 'unknown', '[]'}:
        return []

    # Try JSON array strings first: "[\"A\", \"B\"]"
    try:
        if s.startswith('['):
            parsed = json.loads(s)
            if isinstance(parsed, list):
                return [str(x).strip() for x in parsed if x is not None and str(x).strip()]
    except Exception:
        # fall back to delimiter splitting
        pass

    # Split on common separators and the word 'and'
    parts = re.split(r'[,;|]', s)
    results: List[str] = []
    for part in parts:
        for sub in re.split(r'\band\b', part, flags=re.IGNORECASE):
            sub = sub.strip()
            if sub and sub.lower() not in {'none', 'nan', 'unknown'}:
                results.append(sub)
    return results


def parse_duration_to_minutes(value) -> Tuple[int | None, int]:
    """Parse duration strings into (minutes, seasons).

    Returns a tuple where minutes may be None if the string encodes only
    seasons (e.g. '2 Seasons'). Seasons defaults to 0 when not present.
    """

    if value is None:
        return None, 0
    s = str(value).lower().strip()
    if s == '' or s in {'nan', 'none', 'unknown'}:
        return None, 0

    seasons = 0
    minutes = None

    # seasons like '2 Seasons' or '1 Season'
    m = re.search(r"(\d+)\s*season", s)
    if m:
        try:
            seasons = int(m.group(1))
        except Exception:
            seasons = 0

    # minutes like '90 min' or '90 mins' or '90m'
    m = re.search(r"(\d+)\s*min", s)
    if m:
        minutes = int(m.group(1))
    else:
        # hours + optional minutes: '1h 30m', '1 hr 30 min', '2 hours'
        m = re.search(r"(\d+)\s*h(?:ou)?r?s?\s*(\d+)?", s)
        if m:
            hours = int(m.group(1))
            mins = int(m.group(2)) if m.group(2) else 0
            minutes = hours * 60 + mins
        else:
            # fallback: lone number assume minutes
            m = re.match(r"^(\d+)$", s)
            if m:
                minutes = int(m.group(1))

    return minutes, seasons
