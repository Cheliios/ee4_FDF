# Commits sugeridos para evidenciar evolucion a v2.0

Usa estos comandos dentro del repositorio clonado:

```bash
git checkout -b ee2-css-layout

git add css/styles.css
git commit -m "feat: agregar sistema visual base CSS para v2"

git add index.html blog.html pages/*.html
git commit -m "feat: aplicar estilos globales y layout responsive"

git add css/styles.css
git commit -m "fix: ajustar media queries para movil tablet y desktop"

git add README.md EVIDENCIA_EE2.md PRUEBAS_RESPONSIVE.md GIT-COMMITS-SUGERIDOS.md
git commit -m "docs: documentar cambios y pruebas de evidencia EE2"

git push origin ee2-css-layout
```

Si tu docente no pide branch, puedes usar `master` directamente:

```bash
git push origin master
```
