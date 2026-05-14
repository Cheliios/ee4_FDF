# Lucky Air - Sitio Web v2.0 (EE2)

Proyecto academico del curso **Fundamentos de Desarrollo Frontend - UCAL**.

Repositorio base revisado: `https://github.com/NekoXpert/ee1_grupo2`.
La version original estaba orientada a EE1 con HTML semantico. Esta entrega adapta el sitio a **Evidencia Evaluativa 2: CSS + Layout + Responsive**.

## Equipo

| Integrante | Rol | Aporte |
|---|---|---|
| Felipe Reyes Ingunza | Owner del repo | Header, footer, home y paginas base |
| Lenin David Mamani Sarmiento | Contribuidor | Destinos, destino detalle, blog y ajustes visuales |
| Piero Batti Pena | Contribuidor | Lucky Points, empresas y estudiantes |
| Rodrigo Alonso Santos Nunez | Contribuidor | Login, checkout, legal y nosotros |

## Funcionalidades v2.0

- CSS global en `/css/styles.css`.
- Sistema visual consistente: colores, tipografia, espaciados, bordes y sombras.
- Layout con **Flexbox** en header, navegacion, acciones, botones y listas de beneficios.
- Layout con **CSS Grid** en cards, formularios, secciones y footer.
- Responsive design con media queries para movil, tablet y desktop.
- Estilos organizados por componentes: header, botones, hero, cards, formularios, tablas, footer.
- Correccion de visualizacion: se evita scroll horizontal y se mejora legibilidad.

## Estructura del proyecto

```text
ee1_grupo2/
├── index.html
├── blog.html
├── README.md
├── EVIDENCIA_EE2.md
├── PRUEBAS_RESPONSIVE.md
├── GIT-COMMITS-SUGERIDOS.md
├── /css/
│   └── styles.css
├── /assets/images/
│   ├── lucky-air-logo.svg
│   ├── hero-yunnan.svg
│   └── route-map.svg
└── /pages/
    ├── vuelos.html
    ├── destinos.html
    ├── destino-detalle.html
    ├── lucky-points.html
    ├── empresas.html
    ├── estudiantes.html
    ├── ayuda.html
    ├── login.html
    ├── mi-cuenta.html
    ├── checkout.html
    ├── nosotros.html
    ├── legal.html
    └── blog.html
```

## Como probar

1. Abre `index.html` en Chrome, Edge o Firefox.
2. Revisa la navegacion principal y entra a paginas internas.
3. Abre DevTools con `F12`.
4. Usa el modo responsive y prueba:
   - Movil: 375px
   - Tablet: 768px
   - Desktop: 1366px
5. Verifica que no exista scroll horizontal y que las cards/formularios se ordenen correctamente.

## Evidencia para GitHub

Se recomienda subir los cambios con commits separados:

```bash
git add css/styles.css
git commit -m "feat: agregar sistema visual base CSS para v2"

git add index.html pages/*.html blog.html
git commit -m "feat: aplicar layout con Flexbox y Grid en paginas principales"

git add css/styles.css
git commit -m "fix: mejorar responsive en movil tablet y desktop"

git add README.md EVIDENCIA_EE2.md PRUEBAS_RESPONSIVE.md GIT-COMMITS-SUGERIDOS.md
git commit -m "docs: actualizar README y evidencia EE2"

git push origin master
```

## Estado EE2

- CSS visual: completado.
- Flexbox y Grid: completado.
- Responsive: completado.
- README actualizado: completado.
- Documentacion de pruebas: completado.
