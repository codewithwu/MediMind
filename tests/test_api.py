from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_upload_endpoint_missing_file():
    response = client.post("/api/upload")
    assert response.status_code == 422


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
