# Evidencia Evaluativa 2 - Cambios realizados

## 1. Implementacion del diseño visual y maquetacion CSS

Se creo el archivo `/css/styles.css` con un sistema visual centralizado mediante variables CSS. Se definieron colores institucionales de Lucky Air, tipografia, sombras, bordes redondeados, espaciados y estilos reutilizables.

Se aplico **Flexbox** en:

- Header global.
- Navegacion principal.
- Botones de accion.
- Lista de beneficios.

Se aplico **Grid** en:

- Cards de destinos.
- Formularios.
- Secciones de contenido.
- Footer.

## 2. Gestion del repositorio GitHub

El proyecto esta organizado para subir a GitHub con commits claros por hito: CSS base, layout Flexbox/Grid, responsive y documentacion.

## 3. Verificacion responsive

Se agregaron media queries para adaptar el sitio a:

- Movil: 375px.
- Tablet: 768px.
- Desktop: 1366px.

Las secciones cambian de varias columnas a una sola columna en pantallas pequenas para evitar scroll horizontal y mejorar lectura.

## 4. Mantenibilidad y escalabilidad

Los estilos fueron organizados por componentes y clases reutilizables, por ejemplo:

- `.container`
- `.site-header`
- `.hero`
- `.grid`
- `.card`
- `.form-card`
- `.site-footer`

Esto permite modificar el sitio sin repetir codigo ni afectar otras paginas.
