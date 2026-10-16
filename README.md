# Prueba técnica — Analista III · Gerencia de Evolución Contable y Tributaria

Prototipo de **conciliación de facturas y retenciones**: carga dos archivos CSV
(`facturas.csv` y `contabilidad.csv`), aplica las reglas de negocio definidas en
`docs/caso-de-estudio.md` y devuelve un resumen y un detalle clasificando cada
factura como **Correcta** o **Con inconsistencia**.

Monorepo con **backend Flask (Python)** y **frontend Angular (bun)**.

## Índice

1. [Estructura del repositorio](#estructura-del-repositorio)
2. [Requisitos, versiones y dependencias](#requisitos-versiones-y-dependencias)
3. [Instalación y ejecución](#instalación-y-ejecución)
   - [Backend (Flask)](#backend-flask)
   - [Frontend (Angular)](#frontend-angular)
   - [Docker (opcional)](#docker-opcional)
4. [Pruebas](#pruebas)
5. [Archivos de prueba (CSV)](#archivos-de-prueba-csv)
6. [API](#api)
7. [Reglas de negocio implementadas](#reglas-de-negocio-implementadas)
8. [Supuestos tomados](#supuestos-tomados)
9. [Decisiones técnicas](#decisiones-técnicas)
10. [Funcionalidades no completadas](#funcionalidades-no-completadas)
11. [Declaración de uso de IA generativa](#declaración-de-uso-de-ia-generativa)

## Estructura del repositorio

```
.
├── apps/
│   ├── backend/                 # API REST en Flask
│   │   ├── app.py               # App factory y arranque (puerto 5000)
│   │   ├── routes.py            # Blueprint / endpoints HTTP
│   │   ├── services.py          # Lógica de negocio y validaciones
│   │   ├── models.py            # Dataclass Factura
│   │   ├── requirements.txt     # Dependencias de Python
│   │   └── tests/               # Pruebas con pytest
│   └── frontend/                # Angular (bun)
│       ├── src/
│       ├── angular.json
│       └── package.json
├── data/                        # Archivos de prueba (CSV)
│   ├── facturas.csv
│   └── contabilidad.csv
├── docs/
│   └── caso-de-estudio.md       # Enunciado y reglas de negocio
├── AGENTS.md                    # Convenciones de trabajo del repositorio
├── compose.yaml                 # Orquestación opcional con Docker
└── README.md
```

## Requisitos, versiones y dependencias

- **Python 3.12** (probado y referenciado en `compose.yaml` con `python:3.12-slim`).
- **Backend (dependencias de Python, sin fijar versión exacta)** — ver `apps/backend/requirements.txt`:
  - `flask`
  - `flask-cors`
  - `python-dotenv`
  - `pytest`
- **Node.js** y **bun** (gestor de paquetes, no npm).
- **Angular 19** / **Angular CLI 19.1.6** (ver `apps/frontend/package.json`):
  - `@angular/*` `^19.1.0`
  - `typescript` `~5.7.2`
  - `rxjs` `~7.8.0`

## Instalación y ejecución

### Backend (Flask)

```powershell
cd apps/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

El backend queda disponible en `http://localhost:5000`.

### Frontend (Angular)

```powershell
cd apps/frontend
bun install
bun run start
```

La aplicación queda disponible en `http://localhost:4200`.

> **Importante:** el frontend aún es el scaffolding por defecto de Angular
> (pantalla "Hello"). Ver [Funcionalidades no completadas](#funcionalidades-no-completadas).
> La conciliación se valida de extremo a extremo desde el backend con
> `pytest` o llamando directamente a la API.

### Docker (opcional)

```powershell
docker compose up
```

Levanta backend (`:5000`) y frontend (`:4200`) usando las imágenes
`python:3.12-slim` y `oven/bun:1`.

## Pruebas

Desde `apps/backend`:

```powershell
.\.venv\Scripts\python -m pytest
```

Las pruebas cubren: health check, resumen de conciliación, clasificación de
casos (duplicados, IVA, sin registro contable, campos vacíos) y validaciones
(archivos faltantes, extensión inválida, cabeceras faltantes, archivo vacío).

## Archivos de prueba (CSV)

Los archivos usados para validar y probar la solución están en la carpeta
`data/`:

| Archivo                  | Ruta                    | Descripción                                      |
| ------------------------ | ----------------------- | ------------------------------------------------ |
| `facturas.csv`           | `data/facturas.csv`     | 50 facturas con casos correctos e inconsistentes |
| `contabilidad.csv`       | `data/contabilidad.csv` | Registros contables (incluye duplicados)         |

Incluyen intencionalmente: facturas duplicadas (`FAC-0004`, `FAC-0015`), campos
obligatorios vacíos (`FAC-0013`, `FAC-0029`, `FAC-0042`), diferencias de IVA y
de total, y facturas sin registro contable (`FAC-0007`, `FAC-0021`, `FAC-0034`).

Resultado esperado con estos archivos: **50 facturas totales, 35 correctas y
15 con inconsistencia**.

## API

| Método | Ruta                | Descripción                                    |
| ------ | ------------------- | ---------------------------------------------- |
| `GET`  | `/api/health`       | Health check (`{"status": "ok"}`)              |
| `POST` | `/api/conciliacion` | Conciliación de facturas y contabilidad        |

`POST /api/conciliacion` recibe `multipart/form-data` con dos archivos:

- `facturas` (`.csv`)
- `contabilidad` (`.csv`)

Respuesta (`200`):

```json
{
  "resumen": {
    "total_facturas": 50,
    "facturas_correctas": 35,
    "facturas_con_inconsistencia": 15
  },
  "detalle": [
    {
      "id_factura": "FAC-0004",
      "nit_proveedor": "900471498",
      "fecha_factura": "2026-01-02",
      "concepto": "Soporte técnico",
      "base_gravable": 3570000.0,
      "tarifa_iva": 0.05,
      "valor_iva": 178500.0,
      "tarifa_retencion": 0.025,
      "valor_retencion": 89250.0,
      "total_factura": 3659250.0,
      "estado": "Con inconsistencia",
      "inconsistencias": ["Factura duplicada"]
    }
  ]
}
```

Errores de validación devuelven `400` con `{"error": "<mensaje>"}`.

## Reglas de negocio implementadas

1. IVA esperado = `base_gravable × tarifa_iva`.
2. Total esperado = `base_gravable + IVA_esperado − valor_retencion`.
3. Detección de facturas duplicadas (mismo `id_factura`).
4. Detección de facturas sin registro contable.
5. Detección de campos obligatorios vacíos (`nit_proveedor`, `fecha_factura`,
   `concepto`).
6. Clasificación por estado: **Correcta** o **Con inconsistencia** (con listado
   de causas).

## Supuestos tomados

- Los valores numéricos se tratan como `float`; los cálculos se redondean a 2
  decimales (`round(..., 2)`) para la comparación con los valores reportados.
- Una celda vacía o no numérica se interpreta como `0.0` para los campos
  numéricos.
- Los archivos se leen en codificación UTF-8 (con tolerancia a BOM:
  `utf-8-sig`).
- La existencia de registro contable se determina únicamente por la presencia
  del `id_factura` en `contabilidad.csv` (no se valida el estado de ese
  registro).
- La detección de facturas duplicadas se basa únicamente en la unicidad del
  `id_factura`: dos o más filas de `facturas.csv` con el mismo `id_factura` se
  marcan como duplicadas, sin comparar los demás campos.

## Decisiones técnicas

- **Backend modular plano** (`app.py`, `routes.py`, `services.py`, `models.py`)
  para mantener el código simple y trazable en el alcance de la prueba.
- **Capas separadas**: `routes.py` actúa como orquestador HTTP (valida request,
  invoca el servicio y mapea excepciones a respuestas HTTP); `services.py`
  concentra validación y reglas de negocio; `models.py` usa `dataclass`.
- Validaciones centralizadas en `ValidacionError`, convertidas a `400`.
- `flask-cors` para permitir el consumo desde el frontend Angular.
- Pruebas con `pytest` usando el cliente de test de Flask y los CSV de `data/`.

## Funcionalidades no completadas

- **Frontend:** sigue siendo el scaffolding por defecto de Angular; no se
  implementaron la pantalla de carga de archivos, el resumen, la tabla con
  filtro por estado ni el consumo de la API.
- La comparación de totales no valida explícitamente la retención esperada
  (`base_gravable × tarifa_retencion`) como causa independiente.

## Declaración de uso de IA generativa

Se utilizó **Inteligencia Artificial Generativa** en este proyecto. Registro de
lo generado o modificado con ayuda de agentes de IA:

### 2026-10-15 — Estructura inicial del repositorio

- **Agente:** opencode (deepseek/deepseek-v4-pro)
- **Resumen:** creación de la estructura inicial del monorepo (backend Flask +
  frontend Angular), archivos de ejemplo, `AGENTS.md`, `README.md`,
  `.gitignore` y `compose.yaml`.
- **Archivos afectados:**
  - `apps/frontend/**` — scaffolding generado con Angular CLI 19 (gestor bun).
  - `apps/backend/**` — estructura Flask (app factory, routes, services, models,
    tests) y archivos de ejemplo.
  - `AGENTS.md`
  - `README.md`
  - `.gitignore`
  - `compose.yaml`

### 2026-10-15 — Backend de conciliación de facturas

- **Agente:** opencode (deepseek/deepseek-v4-pro)
- **Resumen:** refactorización de la estructura del backend a módulos planos
  (`app.py`, `routes.py`, `services.py`, `models.py`) y desarrollo del endpoint
  `POST /api/conciliacion` con las reglas de negocio (IVA esperado, total
  esperado, campos vacíos, facturas duplicadas y sin registro contable),
  clasificación por estado y pruebas con los CSV de ejemplo.
- **Archivos afectados:**
  - `apps/backend/app.py`
  - `apps/backend/routes.py`
  - `apps/backend/services.py`
  - `apps/backend/models.py`
  - `apps/backend/tests/test_app.py`
  - `README.md`
  - `compose.yaml`

### 2026-10-16 — Validaciones de archivos y reorganización de capas

- **Agente:** opencode (deepseek/deepseek-v4-pro)
- **Resumen:** se agregaron validaciones al endpoint de conciliación (presencia
  de archivos, extensión `.csv`, codificación, archivo vacío y cabeceras
  obligatorias) mediante la excepción `ValidacionError`. Posteriormente se
  consolidó toda la validación en la capa de servicios: `_validar_archivo` y el
  manejo de `ValidacionError` pasaron de `routes.py` a `services.py`, dejando a
  `routes.py` como orquestador puro. Se añadieron pruebas de validación y se
  movieron los CSV de ejemplo de `docs/` a `data/` (actualizando la ruta en las
  pruebas).
- **Archivos afectados:**
  - `apps/backend/routes.py`
  - `apps/backend/services.py`
  - `apps/backend/tests/test_app.py`
  - `data/facturas.csv` (movido desde `docs/facturas.csv`)
  - `data/contabilidad.csv` (movido desde `docs/contabilidad.csv`)

### 2026-10-16 — Documentación: README, archivos de prueba y declaración de IA

- **Agente:** opencode (deepseek/deepseek-v4-pro)
- **Resumen:** reescritura del `README.md` con instrucciones reproducibles de
  instalación y ejecución (versiones, dependencias, comandos y configuración),
  supuestos, decisiones técnicas, funcionalidades no completadas, ubicación de
  los archivos de prueba y la sección de declaración de uso de IA generativa.
  Se movió el contenido de `docs/declaracion-uso-de-ia.md` al `README.md` y se
  actualizó `AGENTS.md` para que el registro de uso de IA se haga dentro del
  `README` en lugar del archivo separado.
- **Archivos afectados:**
  - `README.md`
  - `AGENTS.md`
  - `docs/declaracion-uso-de-ia.md` (contenido trasladado al `README.md`)
