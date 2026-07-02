# Lucky Air - Sitio Web v4.0 (EE4 - JavaScript)

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
- Libro de reclamaciones (quejas y estado del reclamo)

## Equipo

| Integrante | 

| **Lenin David Mamani Sarmiento** | 
| **Piero Batti Peña** | 
| **Rodrigo Alonso Santos Núñez** | 


## EE4 - CRUD

### Estructura de `scripts/`

| Archivo | Autor | Función |

| `estudiantes-crud.js` `empresas-crud.js` | Lenin Mamani |
| `reservas-crud.js` `usuarios-crud.js` | Piero Batti | 
| `vuelos-crud.js` `reembolsos-crud.js` | Rodrigo Santos | 


## Cómo probar el sitio

1. Clona el repositorio y entra a la carpeta.
2. Abre `index.html` en un navegador moderno (Chrome, Firefox, Edge).
3. Recomendado (para que localStorage funcione sin restricciones de `file://`), levanta un servidor local:
   ```bash
   python -m http.server 8000
   ```
   Luego abre http://localhost:8000

## Estructura del proyecto

```
ee1_grupo2/
├── index.html                  (Home)
├── README.md
├── .gitignore
├── /pages/                     (páginas internas: 15 .html)
├── /scripts/crud               (JavaScript - EE4)
├── /styles/                    (main.css)
├── /data/                      (site-data.json)
└── /images/ /assets/           (recursos)
```

## Roadmap de evidencias evaluativas

- **EE1 (v1.0) - HTML + Git** — entregado
- **EE2 (v2.0) - CSS + Layout + Responsive** — entregado
- **EE3 (v3.0) - JavaScript + DOM + localStorage** — entregable actual
- **EE4 (v4.0) - Integración + Calidad + Despliegue** — final

## Convenciones del proyecto

- Nombres de archivos en minúsculas con guiones (`destino-detalle.html`)
- Prefijo de ID en inputs por sección (ej. `c-email` en contacto, `p-email` en perfil) para evitar colisiones
- Textos sin tildes en el contenido para evitar problemas de encoding en repos colaborativos
- Comentarios de autoría al inicio de cada bloque de contenido único

## Licencia

Proyecto académico. Material de referencia: UCAL - Fundamentos de Desarrollo Frontend 2026-1.
