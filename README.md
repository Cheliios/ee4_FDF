# Lucky Air - Sitio Web v3.0 (EE3 - JavaScript)

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

| Integrante | Rol | Entregables |
|---|---|---|
| **Felipe Reyes Ingunza** | Owner del repo | Header + Footer globales, `index.html`, `vuelos.html`, `mi-cuenta.html`, `ayuda.html` |
| **Lenin David Mamani Sarmiento** | Contribuidor | `destinos.html`, `destino-detalle.html`, `blog.html` |
| **Piero Batti Peña** | Contribuidor | `lucky-points.html`, `empresas.html`, `estudiantes.html` |
| **Rodrigo Alonso Santos Núñez** | Contribuidor | `login.html`, `checkout.html`, `legal.html`, `nosotros.html` |
| **Adso Martin Obregón Gutiérrez** | Contribuidor | `quejas.html`, `estado-queja.html` |

## EE3 - JavaScript + DOM + localStorage

Esta versión 3.0 cubre la Unidad de Aprendizaje 3: **interactividad real con JavaScript puro (vanilla)**, sin librerías ni frameworks. Todo el JS vive en `scripts/` y se enlaza con `defer`; no hay manejadores `onclick` en línea (todo con `addEventListener`).

### Convenciones de JavaScript

- JavaScript puro (vanilla). Sin jQuery, React ni otras librerías.
- Cada archivo `.js` inicia con su comentario de autoría y cada función lleva una línea que explica qué hace.
- La validación HTML5 (`required`, `pattern`, `type`) se mantiene y encima se agrega validación con JS que muestra mensajes de error propios (`.error-msg`, `aria-live`).
- Accesibilidad: mensajes con `aria-live`, menú hamburguesa usable con teclado (`Esc`, foco), modales con foco y cierre con `Esc`.

### Estructura de `scripts/`

| Archivo | Autor | Función |
|---|---|---|
| `validacion.js` | Felipe Reyes | Utilidades reutilizables de validación en `window.LA` (`validarEmail`, `validarVacio`, `validarPatron`, `mostrarError`, `limpiarError`, ...) |
| `main.js` | Felipe Reyes | Globales en las 16 páginas: menú hamburguesa JS, nav activa (`aria-current`), año dinámico, estado de sesión, botón "volver arriba", notificaciones (toasts) y accesibilidad de modales |
| `cuentas.js` | Felipe Reyes | Sistema de cuentas con localStorage: registrar y luego iniciar sesión con esa cuenta (`window.LA.cuentas`) |
| `index.js` | Felipe Reyes | Buscador del home: contador de pasajeros, fecha de vuelta condicional y validación |
| `vuelos.js` | Felipe Reyes | Buscar/comprar (render dinámico), validar ticket, estado de vuelo y calculadora de reembolso |
| `mi-cuenta.js` | Felipe Reyes | Perfil y preferencias guardados y cargados desde localStorage |
| `ayuda.js` | Felipe Reyes | Filtro en vivo de FAQ + validación de contacto con contador de caracteres |
| `destinos.js` `destino-detalle.js` `blog.js` | Lenin Mamani | Filtros/orden, carrusel + reseñas, buscador de artículos + newsletter |
| `lucky-points.js` `empresas.js` `estudiantes.js` | Piero Batti | Calculadora de puntos, ahorro corporativo, validación de grupo/archivo |
| `login.js` `checkout.js` `legal.js` `nosotros.js` | Rodrigo Santos | Login/registro/recuperar, pago, pestañas legales, contador animado |

### Persistencia en localStorage (claves)

| Clave | Contenido |
|---|---|
| `la_cuentas` | Cuentas registradas (la contraseña se guarda ofuscada; es una simulación académica, no seguridad real) |
| `la_sesion` | Sesión activa (`{ nombre, email }`); el header muestra "Hola, X" y "Salir" en las 16 páginas |
| `la_perfil` | Datos del perfil de "Mi cuenta" |
| `la_preferencias` | Preferencias de comunicación e idioma |
| `la_reembolso` | Última cotización de la calculadora de reembolso |

### Flujo de cuenta de extremo a extremo

1. En `login.html` te registras (se valida y se guarda la cuenta en `la_cuentas`).
2. Inicias sesión con esa misma cuenta: las credenciales se verifican contra lo guardado.
3. La sesión queda en `la_sesion` y el header saluda "Hola, X" con botón "Salir" en todo el sitio.
4. En "Mi cuenta" el perfil se precarga desde la sesión y se guardan perfil y preferencias.

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
├── index.html                  (Home - Felipe)
├── README.md
├── .gitignore
├── /pages/                     (páginas internas: 15 .html)
├── /scripts/                   (JavaScript - EE3)
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
