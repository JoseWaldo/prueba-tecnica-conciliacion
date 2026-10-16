from flask import Blueprint, jsonify, request

from services import ValidacionError, conciliar

bp = Blueprint("routes", __name__)


@bp.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@bp.post("/api/conciliacion")
def conciliacion():
    try:
        return jsonify(conciliar(request.files.get("facturas"), request.files.get("contabilidad")))
    except ValidacionError as exc:
        return jsonify({"error": str(exc)}), 400
