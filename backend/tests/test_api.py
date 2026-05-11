from fastapi.testclient import TestClient

from app.main import app
from app.services.accessibility_service import _rows_from_gg_json_payload

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_companies_returns_payload():
    res = client.get("/companies")
    assert res.status_code == 200
    payload = res.json()
    assert isinstance(payload, dict)
    assert payload.get("source") in ("live", "static")
    assert "data" in payload
    data = payload["data"]
    assert isinstance(data, list)
    assert len(data) > 0
    assert "companyName" in data[0]
    assert "friendlinessScore" in data[0]


def test_jobs_returns_list():
    res = client.get("/jobs")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "title" in data[0]
    assert "accessibilityTags" in data[0]


def test_gg_json_parser_object_root():
    """Ggsigundspsnactsport 형태: 루트가 서비스명 dict."""
    sample = {
        "Ggsigundspsnactsport": [
            {"head": [{"list_total_count": 2}]},
            {
                "row": [
                    {"SIGUN_NM": "가평군", "INST_NM": "기관A"},
                    {"SIGUN_NM": "고양시", "INST_NM": "기관B"},
                ]
            },
        ]
    }
    rows = _rows_from_gg_json_payload(sample)
    assert len(rows) == 2
    assert rows[0]["SIGUN_NM"] == "가평군"


def test_accessibility_institutions_rejects_unknown_sigun():
    res = client.get("/accessibility/institutions?sigunNm=서울특별시")
    assert res.status_code == 400


def test_accessibility_institutions_no_param_ok():
    res = client.get("/accessibility/institutions")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_gg_json_parser_legacy_list_root():
    """구형: [{서비스키: [ head 블록, row 블록 ]}]"""
    sample = [
        {
            "SomeService": [
                {"head": []},
                {"row": [{"SIGUN_NM": "수원시", "INST_NM": "C"}]},
            ]
        }
    ]
    rows = _rows_from_gg_json_payload(sample)
    assert len(rows) == 1
    assert rows[0]["SIGUN_NM"] == "수원시"
