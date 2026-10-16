from flask import Blueprint, jsonify, request

from domain.errors import ValidacionError
from services.conciliacion import conciliar

conciliacion_bp = Blueprint("conciliacion", __name__)


@conciliacion_bp.post("/api/conciliacion")
def conciliacion():
    try:
        return jsonify(conciliar(request.files.get("facturas"), request.files.get("contabilidad")))
    except ValidacionError as exc:
        return jsonify({"error": str(exc)}), 400
