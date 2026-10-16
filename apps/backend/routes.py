from flask import Blueprint, jsonify, request

from services import conciliar

bp = Blueprint("routes", __name__)


@bp.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@bp.post("/api/conciliacion")
def conciliacion():
    facturas = request.files.get("facturas")
    contabilidad = request.files.get("contabilidad")
    if not facturas or not contabilidad:
        return jsonify({"error": "Debe subir facturas.csv y contabilidad.csv"}), 400

    return jsonify(conciliar(facturas.read(), contabilidad.read()))
