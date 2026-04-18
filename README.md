# Lucky Air - Sitio Web v1.0

Proyecto académico del curso **Fundamentos de Desarrollo Frontend (18612)** de UCAL.

Sitio web diseñado para atender el caso de estudio internacional **E-commerce at Yunnan Lucky Air** (Berenguer, Cai, Li, Liu y Wang, 2008 - MIT, versión adaptada).

## Descripción del proyecto

Lucky Air es una aerolínea low-cost china (Yunnan, 2004) que quiere convertir su sitio **luckyair.net** en un diferenciador competitivo: no solo una tienda web sino un destino web que genere lealtad, reduzca costos y aumente la conversión.

El sitio cubre los siguientes escenarios del caso:

- Compra, validación y reembolso de tickets online (self-service sin call center)
- Estado de vuelo en tiempo real
- Guía turística de destinos en Yunnan y rutas extra-provinciales
- Comunidad con reseñas por criterios (puntualidad, equipaje, atención)
- Programa de fidelización Lucky Points con canje y socios
- Ventas corporativas (portal B2B) y descuentos para estudiantes
- Pagos con tarjeta, PayPal, Alipay y WeChat Pay
- Centro de ayuda con FAQ y formulario de contacto

## Equipo

| Integrante | Rol | Entregables |
|---|---|---|
| **Felipe Reyes Ingunza** | Owner del repo | Header + Footer globales, `index.html`, `vuelos.html`, `mi-cuenta.html`, `ayuda.html` |
| **Lenin David Mamani Sarmiento** | Contribuidor | `destinos.html`, `destino-detalle.html`, `blog.html` |
| **Piero Batti Peña** | Contribuidor | `lucky-points.html`, `empresas.html`, `estudiantes.html` |
| **Rodrigo Alonso Santos Núñez** | Contribuidor | `login.html`, `checkout.html`, `legal.html`, `nosotros.html` |

## Funcionalidades principales (UA1 - HTML semántico)

Esta versión 1.0 cubre la Unidad de Aprendizaje 1 del curso: **estructuración de contenido web con HTML semántico y Git**.

- 14 páginas HTML con estructura semántica completa (header, nav, main, section, article, aside, footer)
- Formularios validados con HTML5 nativo (required, pattern, type, minlength, maxlength)
- Accesibilidad: skip-links, aria-labels, aria-current, lang="es", contraste implícito
- Tablas con caption, thead, tbody, scope para lectores de pantalla
- Imágenes con alt descriptivo y dimensiones width/height
- Multimedia con `<video>` y `<track>` para subtítulos
- Acordeones nativos con `<details>` y `<summary>`
- Listas de definición `<dl>` para datos estructurados
- Fechas con `<time datetime>` para máquinas

## Estructura del proyecto

```
luckyair-web/
├── index.html                  (Home - Felipe)
├── README.md
├── GIT-WORKFLOW.md             (comandos git paso a paso)
├── .gitignore
├── /pages/                     (páginas internas)
│   ├── vuelos.html             (Felipe)
│   ├── mi-cuenta.html          (Felipe)
│   ├── ayuda.html              (Felipe)
│   ├── destinos.html           (Lenin)
│   ├── destino-detalle.html    (Lenin)
│   ├── blog.html               (Lenin)
│   ├── lucky-points.html       (Piero)
│   ├── empresas.html           (Piero)
│   ├── estudiantes.html        (Piero)
│   ├── login.html              (Rodrigo)
│   ├── checkout.html           (Rodrigo)
│   ├── nosotros.html           (Rodrigo)
│   └── legal.html              (Rodrigo)
├── /css/                       (vacío - EE2)
├── /scripts/                   (vacío - EE3)
├── /data/                      (vacío - EE3)
└── /assets/images/             (imágenes)
```

## Cómo probar el sitio

1. Clona el repositorio:
   ```bash
   git clone https://github.com/FelipeReyesIngunza/luckyair-web.git
   cd luckyair-web
   ```

2. Abre `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).

3. Alternativa: levanta un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
   Luego abre http://localhost:8000

## Enlaces principales

- **Repositorio:** https://github.com/FelipeReyesIngunza/luckyair-web
- **Sitio publicado (GitHub Pages):** https://FelipeReyesIngunza.github.io/luckyair-web (disponible desde EE4)
- **Caso de estudio:** E-commerce at Yunnan Lucky Air - MIT 2008

## Roadmap de evidencias evaluativas

- **EE1 (v1.0) - HTML + Git** — Estado: entregable actual
- **EE2 (v2.0) - CSS + Layout + Responsive** — Próximo
- **EE3 (v3.0) - JavaScript + DOM + Fetch** — Siguiente
- **EE4 (v4.0) - Integración + Calidad + Despliegue** — Final

## Convenciones del proyecto

- Nombres de archivos en minúsculas con guiones (`destino-detalle.html`)
- IDs únicos por página, en minúsculas
- Prefijo de ID en inputs de formulario por sección (ej. `c-email` en contacto, `p-email` en perfil) para evitar colisiones
- Todos los textos sin tildes para evitar problemas de encoding en repos colaborativos
- Comentarios de autoría al inicio de cada bloque de contenido único

## Licencia

Proyecto académico. Material de referencia: UCAL - Fundamentos de Desarrollo Frontend 2026-1.
