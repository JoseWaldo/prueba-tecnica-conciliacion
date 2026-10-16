from flask import Flask
from flask_cors import CORS

from .routes import register_blueprints


def create_app(config_object: str = "app.config.Config") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    CORS(app)
    register_blueprints(app)

    return app
