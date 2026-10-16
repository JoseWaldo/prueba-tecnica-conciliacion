---
name: Bancolombia Personas
source: https://www.bancolombia.com/
extracted_at: 2026-10-15
intent: landing
material: flat
library: bootstrap
---

# DESIGN.md — Bancolombia Personas

Guía de diseño derivada del análisis de https://www.bancolombia.com/. Describe el sistema visual (color, tipografía, espacio, forma, elevación, componentes) para que humanos y agentes de IA construyan interfaces coherentes con la marca.

> Nota: los valores provienen de una extracción automática (confianza heurística baja, 0.45 para el tipo "landing"). Las secciones marcadas con **(supuesto)** son inferencias razonables, no datos medidos.

---

## 1. Principios

- **Flat y limpio**: superficies planas, sombras muy suaves, esquinas redondeadas. Sin degradados ni texturas.
- **Blanco dominante**: el fondo blanco cubre ~57 % del área pintada; el color de marca se usa como acento y para acciones.
- **Amarillo = acción principal**. Es la seña de identidad; se reserva para CTAs y elementos de énfasis.
- **Legibilidad primero**: texto negro sobre fondos claros o de color (todos los pares medidos cumplen WCAG AAA).
- **Voz neutral**, titulares en *Sentence case*, tratamiento en tercera persona.

---

## 2. Color

### 2.1 Roles

| Rol | Hex | Uso |
|---|---|---|
| `primary` | `#fdda24` | Botón principal, énfasis de marca |
| `secondary` | `#00c389` | Acciones secundarias, estados positivos |
| `accent` | `#ff7f41` | Resaltes puntuales (uso muy escaso) |
| `background` | `#ffffff` | Fondo de página |
| `foreground` | `#000000` | Texto principal |

### 2.2 Neutros

| Token | Hex | Uso |
|---|---|---|
| `neutral-black` | `#000000` | Texto principal |
| `neutral-text-body` | `#212529` | Texto base heredado de Bootstrap (~10 % del área) |
| `neutral-ink` | `#171717` | Texto/superficies oscuras |
| `neutral-gray` | `#58595b` | Texto secundario |
| `neutral-surface` | `#f4f4f4` | Fondos de sección y tarjetas (~13 % del área) |
| `neutral-white` | `#ffffff` | Fondo de página |

### 2.3 Rampas tonales

**Primary (amarillo)**
`50 #fff6a2` · `100 #ffea8c` · **`200 #fdda24`** · `300 #dcbf35` · `400 #be9d00` · `500 #a17f00` · `600 #896800` · `700 #705300` · `800 #5d4300` · `900 #4c3500` · `950 #2c1c00`

**Secondary (verde)**
`50 #bbffe4` · `100 #a8ffd6` · `200 #8cf1c3` · `300 #61dba8` · **`400 #00c389`** · `500 #009d66` · `600 #008552` · `700 #006d40` · `800 #005a32` · `900 #004927` · `950 #002a12`

**Accent (naranja)**
`50 #ffe0bc` · `100 #ffd1ab` · `200 #ffbd91` · `300 #ff9f6d` · **`400 #ff7f41`** · `500 #d25607` · `600 #b54100` · `700 #972f00` · `800 #7f2200` · `900 #691700` · `950 #3f0600`

**Neutral**
`50 #f5f5f7` · `100 #e9eaeb` · `200 #d8d9db` · `300 #bfc0c2` · `400 #9ea0a2` · `500 #818284` · `600 #6b6c6e` · **`700 #58595b`** · `800 #464748` · `900 #38393a` · `950 #1e1f20`

*(El paso en negrita es el color base de cada rampa.)*

### 2.4 Pares de contraste medidos

| Superficie | Fondo | Texto | Contraste | Nivel |
|---|---|---|---|---|
| `surface.page` | `#ffffff` | `#000000` | 21:1 | AAA |
| `surface.raised` | `#f7f7f7` | `#000000` | 19.6:1 | AAA |
| `action.primary` | `#fdda24` | `#000000` | 15.23:1 | AAA |
| `action.secondary` | `#00c389` | `#000000` | 9.17:1 | AAA |
| `action.accent` | `#ff7f41` | `#000000` | 8.36:1 | AAA |

### 2.5 Reglas de uso

- Sobre `primary`, `secondary` y `accent` el texto es **siempre negro** (`#000000`), nunca blanco.
- Evitar amarillo `#fdda24` como color de **texto** sobre blanco (contraste insuficiente) **(supuesto)**; para texto de marca usar `primary-700` o inferior.
- El acento naranja es excepcional: máximo un elemento por vista.

---

## 3. Tipografía

### 3.1 Familias

| Familia | Rol |
|---|---|
| `Open Sans` / `OpenSans-Regular` | Principal: títulos y cuerpo |
| `CIBFontSans-Light` | Secundaria, pesos ligeros (53 usos) |

Stack recomendado: `"Open Sans", OpenSans, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`.

El sitio original usa 11 familias; para código nuevo limitarse a **2** (títulos + cuerpo).

### 3.2 Base

- Tamaño base: `16px`, interlineado de cuerpo ≈ `18.4px` (1.15).
- Escala: razón `1.125` (segunda mayor) desde `14px`.
- Medida de línea: ~60 caracteres.
- Tipografía fluida en 5 tamaños (`clamp()` / unidades de viewport).

### 3.3 Escala nombrada

| Rol | Tamaño | Peso | Interlineado |
|---|---|---|---|
| `h2` | 56px | 700 | 55px |
| `title-1` | 55px | 400 | 82.5px |
| `title-2` | 40px | 400 | 40px |
| `title-3` | 30px | 400 | 30px |
| `title-4` | 29px | 400 | 29px |
| `title-5` | 28px | 700 | 30px |
| `title-6` | 27px | 400 | 27px |
| `title-7` | 24px | 400 | 24px |
| `title-8` | 22px | 400 | 50px |
| `h3` | 20px | 700 | 26px |
| `body` | 16px | 400 | 18.4px |

Recomendación **(supuesto)**: consolidar `title-3`/`title-4`/`title-6` (27–30px) en un solo nivel para reducir ruido.

---

## 4. Espaciado y layout

- Unidad base: `2px`.
- Escala observada: `1 · 24 · 29 · 40 · 56 · 60 · 64 · 70 · 74 · 206` px.
- Gaps habituales: `8px` · `12px` · `16px`.
- Contenedor: ancho máximo `1140px`, gutters de `15px` (contenedor `xl` de Bootstrap).
- Ritmo vertical entre secciones: `40px` de padding.
- Primitivas: grid (3 contenedores) y flexbox (78 contenedores). Preferir flex.

### Breakpoints **(supuesto)**

La extracción no devolvió los breakpoints (salieron como `[object Object]`). Al ser Bootstrap, usar los estándar:

| Nombre | Mín. |
|---|---|
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1400px |

### Orden de lectura típico

`nav → hero → contenido → tablas de precios/productos → contenido → footer`.

---

## 5. Forma (border-radius)

| Token | Valor | Uso típico |
|---|---|---|
| `radius-sm` | 3px | Inputs, chips pequeños |
| `radius-md` | 10px | Tarjetas, botones |
| `radius-lg` | 15px | Tarjetas grandes |
| `radius-xl` | 20px / 24px | Contenedores destacados (se detectaron ambos; unificar en 24px) |
| `radius-full` | 40px | Botones tipo píldora |

---

## 6. Elevación

| Nivel | Sombra |
|---|---|
| `xs` | `rgba(0,0,0,.4) 0 0 4px 0` |
| `sm` | `rgba(0,0,0,.1) 0 1px 8px 0` |
| `md` | `rgba(0,0,0,.1) 0 3px 12px 0` |
| `lg` | `rgba(44,42,41,.16) 0 12px 16px 0, rgba(43,42,41,.08) 0 1px 10px 0` |

Sombras de tinte neutro. Usar `sm` para tarjetas en reposo, `md` en hover, `lg` para modales y menús desplegables.

Z-index: el original usa 19 capas (con 1 inconsistencia detectada). Definir una escala corta: `dropdown 1000 · sticky 1020 · modal 1050 · toast 1080` **(supuesto, convención Bootstrap)**.

---

## 7. Componentes

Patrones detectados: botones, tarjetas, enlaces, navegación, footer, modales, dropdowns, tabs, acordeones.

| Componente | Variantes | Tamaños | Instancias |
|---|---|---|---|
| Card | — | — | 24 |
| Button | primary, outline | small | 12 |
| Link | — | — | 2 |

### Botón

- **Primary**: fondo `#fdda24`, texto `#000`, radio `full` (40px), sin borde.
- **Outline**: fondo transparente, borde 1px `#000`, texto `#000`, mismo radio.
- Hover **(supuesto)**: primary → `primary-300`; outline → fondo `#f4f4f4`.
- Focus: anillo visible de 2px con `#000` y offset de 2px **(supuesto)**.
- CTAs con verbos de acción: *Conoce más*, *Solicita*, *Abre tu cuenta* (el análisis detectó *saber* y *rechazar* como dominantes).

### Tarjeta

- Fondo `#ffffff` o `#f4f4f4`, radio `md`–`lg`, sombra `sm`.
- Padding interno 16–24px.

### Navegación

- Barra superior con múltiples niveles de enlaces; texto negro sobre blanco.
- Menús desplegables con sombra `lg` y radio `md`.

### Footer

- Fondo oscuro (`#212529` / `#171717`) con texto blanco **(supuesto)**; enlaces agrupados por columnas.

---

## 8. Voz y contenido

- Voz neutral, informativa.
- Titulares en *Sentence case*, longitud balanceada.
- Tratamiento en tercera persona en el contenido institucional.
- Lema detectado: "Negocios en Colombia".

---

## 9. Do's y Don'ts

**Do**
- Usar amarillo solo para la acción principal de cada vista.
- Mantener texto negro sobre colores de marca.
- Escribir titulares en Sentence case.
- Mantener estética flat: sombras suaves y radios consistentes.
- Limitar el sistema a 2 familias tipográficas.

**Don't**
- No usar más de 2 familias tipográficas (el original usa 11).
- No depender de `!important` (el original tiene 1198 reglas).
- No duplicar declaraciones CSS (se detectaron ~9743 duplicadas).
- No cargar CSS que no se usa (≈91 % sin usar en el original).
- No mezclar radios arbitrarios: usar solo la escala definida.

---

## 10. Design tokens (CSS)

```css
:root {
  /* Color */
  --color-primary: #fdda24;
  --color-primary-300: #dcbf35;
  --color-primary-700: #705300;
  --color-secondary: #00c389;
  --color-secondary-600: #008552;
  --color-accent: #ff7f41;
  --color-bg: #ffffff;
  --color-surface: #f4f4f4;
  --color-fg: #000000;
  --color-fg-body: #212529;
  --color-fg-muted: #58595b;

  /* Tipografía */
  --font-sans: "Open Sans", OpenSans, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --font-size-base: 16px;
  --fs-h2: 56px;
  --fs-h3: 20px;
  --fs-title-2: 40px;
  --fs-title-3: 30px;
  --fs-title-7: 24px;
  --weight-regular: 400;
  --weight-bold: 700;

  /* Espaciado */
  --space-1: 8px;
  --space-2: 12px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 40px;
  --space-6: 56px;
  --container: 1140px;
  --gutter: 15px;

  /* Radios */
  --radius-sm: 3px;
  --radius-md: 10px;
  --radius-lg: 15px;
  --radius-xl: 24px;
  --radius-full: 40px;

  /* Sombras */
  --shadow-xs: 0 0 4px 0 rgba(0, 0, 0, 0.4);
  --shadow-sm: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 3px 12px 0 rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 12px 16px 0 rgba(44, 42, 41, 0.16), 0 1px 10px 0 rgba(43, 42, 41, 0.08);
}
```

---

## 11. Limitaciones de la extracción

- Breakpoints no disponibles (se usan los estándar de Bootstrap).
- Dos valores distintos para `radius-xl` (20px y 24px).
- Tipo de página (`landing`) con confianza baja (0.45).
- Estados hover/focus/disabled no fueron medidos; los indicados son supuestos.
- Se recomienda validar contra el sitio real y contra el manual de marca oficial de Bancolombia antes de usarlo en producción.
