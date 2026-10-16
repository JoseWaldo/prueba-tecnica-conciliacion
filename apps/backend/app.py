from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from api import conciliacion_bp, health_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(health_bp)
app.register_blueprint(conciliacion_bp)


@app.errorhandler(HTTPException)
def manejar_error_http(exc: HTTPException):
    if exc.code == 404:
        mensaje = "El recurso que buscas no existe. Verifica la dirección e inténtalo de nuevo."
    elif exc.code == 405:
        mensaje = "La operación solicitada no está permitida para este recurso."
    elif exc.code == 413:
        mensaje = "El archivo es demasiado grande. Sube un archivo de menor tamaño."
    else:
        mensaje = "No pudimos procesar tu solicitud. Revisa los datos enviados e inténtalo de nuevo."
    return jsonify({"error": mensaje}), exc.code


@app.errorhandler(Exception)
def manejar_error_inesperado(exc: Exception):
    return jsonify(
        {"error": "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."}
    ), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
