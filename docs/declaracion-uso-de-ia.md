# Declaración de uso de IA

Registro de lo generado o modificado con ayuda de agentes de IA en este proyecto.

---

## 2026-10-15 — Estructura inicial del repositorio

- **Agente:** opencode (deepseek/deepseek-v4-pro)
- **Resumen:** creación de la estructura inicial del monorepo (backend Flask + frontend Angular), archivos de ejemplo, `AGENTS.md`, `README.md`, `.gitignore` y `compose.yaml`.
- **Archivos afectados:**
  - `apps/frontend/**` — scaffolding generado con Angular CLI 19 (gestor bun).
  - `apps/backend/**` — estructura Flask (app factory, routes, services, models, tests) y archivos de ejemplo.
  - `docs/declaracion-uso-de-ia.md`
  - `AGENTS.md`
  - `README.md`
  - `.gitignore`
  - `compose.yaml`

## 2026-10-15 — Backend de conciliación de facturas

- **Agente:** opencode (deepseek/deepseek-v4-pro)
- **Resumen:** refactorización de la estructura del backend a módulos planos (`app.py`, `routes.py`, `services.py`, `models.py`) y desarrollo del endpoint `POST /api/conciliacion` con las reglas de negocio (IVA esperado, total esperado, campos vacíos, facturas duplicadas y sin registro contable), clasificación por estado y pruebas con los CSV de ejemplo.
- **Archivos afectados:**
  - `apps/backend/app.py`
  - `apps/backend/routes.py`
  - `apps/backend/services.py`
  - `apps/backend/models.py`
  - `apps/backend/tests/test_app.py`
  - `README.md`
  - `compose.yaml`
