import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    return app.test_client()


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_example(client):
    response = client.get("/api/example")
    assert response.status_code == 200
    assert "Hola desde Flask" in response.get_json()["message"]
