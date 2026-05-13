"""기업명 비교용 정규화 (구인 businessName ↔ 표준사업장 workplaceName 등)."""

from __future__ import annotations

import re
import unicodedata


def normalize_company_name_key(raw: str) -> str:
    if not raw:
        return ""
    s = unicodedata.normalize("NFKC", raw).strip()
    s = re.sub(r"\s+", " ", s)
    s = _strip_legal_entity_tokens(s)
    s = re.sub(r"\s+", " ", s.strip()).lower()
    return s


def _strip_legal_entity_tokens(s: str) -> str:
    edge_patterns = [
        (re.compile(r"^\(주\)\s*", re.I)),
        (re.compile(r"^\(주식회사\)\s*", re.I)),
        (re.compile(r"^㈜\s*")),
        (re.compile(r"^주식회사\s*")),
        (re.compile(r"^\(유\)\s*", re.I)),
        (re.compile(r"^\(유한회사\)\s*", re.I)),
        (re.compile(r"^유한회사\s*")),
        (re.compile(r"^\(합\)\s*", re.I)),
        (re.compile(r"^\(합자회사\)\s*", re.I)),
        (re.compile(r"^합자회사\s*")),
        (re.compile(r"\s*\(주\)$", re.I)),
        (re.compile(r"\s*\(주식회사\)$", re.I)),
        (re.compile(r"\s*주식회사$")),
        (re.compile(r"\s*\(유\)$", re.I)),
        (re.compile(r"\s*\(유한회사\)$", re.I)),
        (re.compile(r"\s*유한회사$")),
        (re.compile(r"\s*\(합\)$", re.I)),
        (re.compile(r"\s*\(합자회사\)$", re.I)),
        (re.compile(r"\s*합자회사$")),
        (re.compile(r"^\(사\)\s*", re.I)),
        (re.compile(r"\s*\(사\)$", re.I)),
    ]
    latin_tail = re.compile(
        r"\b(co\.?\s*,?\s*ltd\.?|inc\.?|llc\.?|corp\.?)\b",
        re.I,
    )

    prev = ""
    cur = s
    while cur != prev:
        prev = cur
        for pat in edge_patterns:
            cur = pat.sub("", cur)
        cur = cur.strip()
    cur = latin_tail.sub("", cur).strip()
    return cur
