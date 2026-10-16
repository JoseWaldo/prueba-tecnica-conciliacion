from flask import Flask
from flask_cors import CORS

from api import conciliacion_bp, health_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(health_bp)
app.register_blueprint(conciliacion_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
