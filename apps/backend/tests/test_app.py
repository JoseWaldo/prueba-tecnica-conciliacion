from pathlib import Path

import pytest

from app import app

DOCS = Path(__file__).resolve().parents[3] / "docs"


@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()


def _subir(client):
    with (DOCS / "facturas.csv").open("rb") as f1, (DOCS / "contabilidad.csv").open("rb") as f2:
        return client.post(
            "/api/conciliacion",
            data={"facturas": f1, "contabilidad": f2},
            content_type="multipart/form-data",
        )


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_conciliacion_resumen(client):
    data = _subir(client).get_json()
    assert data["resumen"] == {
        "total_facturas": 50,
        "facturas_correctas": 35,
        "facturas_con_inconsistencia": 15,
    }


def test_conciliacion_casos(client):
    detalle = {d["id_factura"]: d for d in _subir(client).get_json()["detalle"]}

    assert "Factura duplicada" in detalle["FAC-0004"]["inconsistencias"]
    assert "IVA no coincide con base x tarifa" in detalle["FAC-0006"]["inconsistencias"]
    assert "Factura sin registro contable" in detalle["FAC-0007"]["inconsistencias"]
    assert "Campos obligatorios vacíos" in detalle["FAC-0013"]["inconsistencias"]
    assert detalle["FAC-0001"]["estado"] == "Correcta"


def test_conciliacion_sin_archivos(client):
    response = client.post("/api/conciliacion", data={}, content_type="multipart/form-data")
    assert response.status_code == 400
