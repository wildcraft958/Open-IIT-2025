"""Utility helpers shared across the analytics codebase."""

from __future__ import annotations

import re
from pathlib import Path


def ensure_dir(path: Path) -> None:
    """Ensure that *path* exists before writing outputs."""

    path.mkdir(parents=True, exist_ok=True)


def clean_list_field(x: str | None) -> list[str]:
    """Split comma-separated strings into a trimmed list while handling empties."""

    if x is None or str(x).strip() == '' or str(x).lower() == 'nan':
        return []
    return [item.strip() for item in str(x).split(',') if item and item.strip()]


def parse_duration_to_minutes(duration_str: str | None) -> tuple[int | None, int | None]:
    """Return a tuple of (minutes, seasons) parsed from Netflix duration strings."""

    if not duration_str or str(duration_str).lower() == 'nan':
        return (None, None)
    normalized = str(duration_str).lower().strip()
    if 'min' in normalized:
        mins = re.findall(r'(\d+)\s*min', normalized)
        return (int(mins[0]) if mins else None, None)
    if 'season' in normalized:
        seasons = re.findall(r'(\d+)\s*season', normalized)
        return (None, int(seasons[0]) if seasons else None)
    return (None, None)
