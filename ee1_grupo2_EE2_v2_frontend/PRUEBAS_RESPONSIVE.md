# Pruebas responsive EE2

## Herramienta usada

Chrome DevTools > Toggle Device Toolbar.

## Resoluciones verificadas

| Dispositivo | Resolucion | Resultado |
|---|---:|---|
| Movil | 375 x 667 | Menu y cards se muestran en una columna. Sin scroll horizontal. |
| Tablet | 768 x 1024 | Cards en dos columnas cuando hay espacio disponible. Formularios legibles. |
| Desktop | 1366 x 768 | Header, hero, cards y footer se muestran distribuidos correctamente. |

## Fallas corregidas

- Se reemplazo maquetacion dispersa por clases reutilizables.
- Se agregaron media queries para evitar desbordes.
- Las cards se ajustan automaticamente usando CSS Grid.
- La navegacion se reorganiza en movil.
- Los formularios pasan de 4 columnas a 2 o 1 columna segun el ancho.

## Conclusion

El sitio es usable en movil, tablet y escritorio. La lectura, alineacion y separacion visual se mantienen de manera consistente.
