# Prueba técnica – Analista III Gerencia de Evolución Contable y Tributaria

Monorepo con backend **Flask** y frontend **Angular**.

## Estructura

```
.
├── apps/
│   ├── frontend/          # Angular (bun)
│   │   ├── src/
│   │   ├── angular.json
│   │   └── package.json
│   └── backend/           # Flask
│       ├── app/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── models/
│       │   └── __init__.py
│       ├── tests/
│       ├── requirements.txt
│       └── run.py
├── docs/                  # Documentación
├── .gitignore
├── AGENTS.md
├── README.md
└── compose.yaml           # Opcional: Docker
```

## Requisitos

- Node.js y [bun](https://bun.sh)
- Angular CLI 19
- Python 3.12

## Backend (Flask)

```powershell
cd apps/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

Probar con pytest:

```powershell
.\.venv\Scripts\python -m pytest
```

Endpoints de ejemplo:

- `GET /api/health`
- `GET /api/example`

## Frontend (Angular)

```powershell
cd apps/frontend
bun install
bun run start
```

La app queda disponible en `http://localhost:4200`.

## Docker (opcional)

```powershell
docker compose up
```

## Convenciones

Ver `AGENTS.md` para la nomenclatura de commits y la declaración de uso de IA.
