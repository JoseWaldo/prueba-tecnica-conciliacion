from io import BytesIO
from pathlib import Path

import pytest

from app import app

DATA = Path(__file__).resolve().parents[3] / "data"

FACTURAS_VALIDAS = (
    "id_factura,nit_proveedor,fecha_factura,concepto,base_gravable,tarifa_iva,"
    "valor_iva,tarifa_retencion,valor_retencion,total_factura\n"
    "FAC-1,9001,2026-01-01,Concepto,1000,0.19,190,0,0,1190\n"
).encode()

CONTABILIDAD_VALIDA = (
    "id_factura,fecha_contabilizacion,cuenta_contable,centro_costo,"
    "valor_debito,valor_credito,estado\n"
    "FAC-1,2026-01-02,512010,CC1001,1190,1190,Contabilizada\n"
).encode()


@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()


def _subir(client):
    with (DATA / "facturas.csv").open("rb") as f1, (DATA / "contabilidad.csv").open("rb") as f2:
        return client.post(
            "/api/conciliacion",
            data={"facturas": f1, "contabilidad": f2},
            content_type="multipart/form-data",
        )


def _post(client, facturas=None, contabilidad=None, nombre_facturas="facturas.csv",
          nombre_contabilidad="contabilidad.csv"):
    data = {}
    if facturas is not None:
        data["facturas"] = (BytesIO(facturas), nombre_facturas)
    if contabilidad is not None:
        data["contabilidad"] = (BytesIO(contabilidad), nombre_contabilidad)
    return client.post("/api/conciliacion", data=data, content_type="multipart/form-data")


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
    response = _post(client)
    assert response.status_code == 400
    assert "No se recibió el archivo" in response.get_json()["error"]


def test_conciliacion_extension_invalida(client):
    response = _post(client, facturas=FACTURAS_VALIDAS, contabilidad=CONTABILIDAD_VALIDA,
                     nombre_facturas="facturas.txt")
    assert response.status_code == 400
    assert "extensión .csv" in response.get_json()["error"]


def test_conciliacion_cabeceras_invalidas(client):
    response = _post(client, facturas=b"id_factura,nit_proveedor\nFAC-1,9001\n",
                     contabilidad=CONTABILIDAD_VALIDA)
    assert response.status_code == 400
    assert "Faltan" in response.get_json()["error"]


def test_conciliacion_archivo_vacio(client):
    response = _post(client, facturas=b"", contabilidad=CONTABILIDAD_VALIDA)
    assert response.status_code == 400
    assert "vacío" in response.get_json()["error"]


def test_ruta_inexistente_devuelve_json(client):
    response = client.get("/api/no-existe")
    assert response.status_code == 404
    assert "error" in response.get_json()
