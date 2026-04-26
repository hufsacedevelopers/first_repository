import json
from pathlib import Path
from typing import Any

from app.core.config import DATA_DIR


def _read_json_file(file_path: Path) -> list[dict[str, Any]]:
    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_companies_data() -> list[dict[str, Any]]:
    return _read_json_file(DATA_DIR / "companies.json")


def get_jobs_data() -> list[dict[str, Any]]:
    return _read_json_file(DATA_DIR / "jobs.json")


def get_supports_data() -> list[dict[str, Any]]:
    return _read_json_file(DATA_DIR / "supports.json")
