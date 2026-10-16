"""Punto de entrada de la aplicación Flask para AWS Lambda.

Usa `apig-wsgi` para adaptar la app WSGI (Flask) a API Gateway HTTP API
(payload 2.0). El handler configurado en Lambda es `lambda_handler.handler`.
"""

from apig_wsgi import make_lambda_handler

from app import app

handler = make_lambda_handler(app, binary_support=True)
