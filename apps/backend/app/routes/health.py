from flask import Blueprint, jsonify

from app.services.example_service import ExampleService

health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@health_bp.get("/example")
def example():
    message = ExampleService().get_message()
    return jsonify({"message": message})
