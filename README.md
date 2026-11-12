# Tu Crédito Nicaragua · CHATBOOT V6.2 — imágenes y menú corregido

La V6.2 continúa el proyecto de **Cloudflare Workers + GitHub**, sin migración a WordPress.

## Cambios de la V6.2

- La portada usa tus **fotografías adjuntas** de compras y motocicletas en las tarjetas de créditos.
- Sección editorial de **représtamos** con la fotografía adjunta de efectivo.
- La **infografía original de cinco beneficios** se incorpora en una franja azul; en móviles se desplaza horizontalmente para conservar legibilidad.
- Las páginas de **Préstamo de Consumo**, **Crédito Tu Moto** y **Représtamo** también muestran fotografías.
- Las flechas de los submenús ya no dependen del carácter tipográfico `v`: se renderizan con SVG y se alinean junto al texto.
- Se conservan el hero con asesora, redes sociales, IA a la izquierda y WhatsApp a la derecha.
- `/api/version` muestra `V6.2`.

## Instalación

1. Hacé una copia de seguridad de tu repositorio `CHATBOOT`.
2. Descomprimí el ZIP y subí **todo su contenido interior** a la raíz de `main` en GitHub, reemplazando los archivos correspondientes.
3. No uses la opción de Cloudflare «Upload static files»: usá la integración GitHub del Worker existente.
4. En Cloudflare, verificá un despliegue `Ready` para el último commit.
5. Abrí `https://chatboot.jerickserranotuc.workers.dev/api/version` y confirmá `V6.2`.
6. Recargá la portada con `Ctrl + Shift + R` y probá menús, IA y WhatsApp.

## Verificación local

- `python scripts/generar_paginas.py` regenera 50 páginas y conserva las mejoras.
- `python scripts/verificar_v6.py` comprueba rutas, recursos y etiquetas de versión; requiere BeautifulSoup.
- `npm install` seguido de `npm run check` comprueba TypeScript, si tenés Node.js disponible.

## Nota de uso

Las fotos de productos y la infografía fueron proporcionadas por el usuario. La asesora de la portada es una imagen generada. Las fotos de sucursales siguen siendo provisionales y deben reemplazarse por fotografías oficiales. La información financiera exige revisión institucional antes de publicar el sitio como portal oficial. Esta entrega no ejecuta aprobaciones ni recibe solicitudes.
