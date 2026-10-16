# AGENTS.md

Guía de trabajo para agentes de IA (y personas) en este repositorio.

## Sobre el proyecto

Monorepo de la prueba técnica **Analista III – Gerencia de Evolución Contable y Tributaria**.

- `apps/frontend`: aplicación **Angular** (gestor de paquetes: **bun**).
- `apps/backend`: API REST con **Flask** (Python, entorno virtual `.venv`).

## Requisitos obligatorios para el agente de IA

### 1. Declaración de uso de IA

Cada vez que el agente de IA genere o modifique código, documentación o cualquier
artefacto del proyecto, **DEBE** registrar lo realizado en
`docs/declaracion-uso-de-ia.md`, incluido este primer paso de estructuración.

Formato sugerido por entrada:

- Fecha.
- Agente/modelo utilizado.
- Resumen de lo generado o modificado.
- Lista de archivos afectados.

### 2. Nomenclatura de commits

El agente **DEBE** crear los commits siguiendo Conventional Commits:

```
<tipo>(<alcance>): <descripción>
```

Tipos permitidos:

| Tipo       | Uso                                              |
| ---------- | ------------------------------------------------ |
| `feat`     | Nueva funcionalidad                              |
| `fix`      | Corrección de errores                            |
| `docs`     | Cambios de documentación                         |
| `refactor` | Refactorización sin cambio de comportamiento     |
| `test`     | Agregar o corregir pruebas                       |
| `chore`    | Tareas de mantenimiento o configuración          |
| `style`    | Formato, sin cambios de código                   |
| `build`    | Sistema de compilación o dependencias            |
| `ci`       | Integración/despliegue continuo                  |
| `perf`     | Mejoras de rendimiento                           |

Ejemplos: `feat(backend): agrega endpoint de conciliación`, `docs: actualiza README`.

### 3. Convenciones generales

- No hacer commit de secretos, `.env`, `node_modules/`, `.venv/` ni `dist/`.
- El backend usa un entorno virtual de Python; instalar dependencias dentro de él.
- El frontend usa **bun** como gestor de paquetes (no npm).
- Ejecutar las pruebas antes de marcar una tarea como completada.
