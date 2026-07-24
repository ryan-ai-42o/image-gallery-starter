"""Simple per-username JSON cache for raw business_discovery responses."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

_SAFE_CHARS = re.compile(r"[^A-Za-z0-9_.-]")


def _cache_path(cache_dir: Path, username: str) -> Path:
    # Instagram usernames are already restricted to [A-Za-z0-9_.], but
    # sanitize defensively since this becomes a filesystem path.
    safe_name = _SAFE_CHARS.sub("_", username)
    return cache_dir / f"{safe_name}.json"


def load(cache_dir: Path, username: str) -> dict[str, Any] | None:
    path = _cache_path(cache_dir, username)
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save(cache_dir: Path, username: str, data: dict[str, Any]) -> None:
    cache_dir.mkdir(parents=True, exist_ok=True)
    path = _cache_path(cache_dir, username)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
