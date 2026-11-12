# Pruebas CHATBOOT V6.2

- Se generaron **50 páginas HTML** desde `scripts/generar_paginas.py`.
- El verificador estático `scripts/verificar_v6.py` validó que no faltan rutas internas ni recursos.
- Imágenes suministradas: 3 fotografías y una infografía, convertidas a WebP y presentes en `/public/assets`.
- Revisión visual con Chromium mediante HTML local: escritorio 1440px, portátil 1024px, móvil 390px.
- Tarjetas de Consumo y Moto con imágenes renderizadas.
- Représtamos y Beneficios verificados mediante capturas de las secciones visibles.
- Menú desplegable probado con clic; chevrons SVG alineados al texto en escritorio y operativos en móvil.
- Sin errores de ejecución JS en los anchos probados, sin desbordamiento horizontal de la página.
- IA fija a la izquierda y WhatsApp a la derecha.
- Tres páginas de producto muestran fotografías locales en el código generado.
- `node --check public/app.js` y `python -m py_compile scripts/generar_paginas.py` sin errores.

**No realizado:** despliegue real en la cuenta del usuario, llamadas reales a Cloudflare Workers AI, pruebas con datos financieros sensibles ni compilación remota de producción. El sitio está configurado para pruebas, pendiente de revisión institucional final.
