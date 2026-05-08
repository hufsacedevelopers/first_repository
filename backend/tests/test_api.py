from fastapi.testclient import TestClient

from app.main import app

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
