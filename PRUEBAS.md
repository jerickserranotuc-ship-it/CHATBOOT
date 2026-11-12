# Pruebas de CHATBOOT V5

**V5 comprobada localmente el 12 de noviembre de 2026.**

- Ejecutar `python scripts/verificar_v5.py`: valida 38 rutas con redes sociales, WhatsApp, logotipo, recursos CSS/JS versionados, la API y README V5.
- Ejecutar `python scripts/generar_paginas.py` y volver a ejecutar el verificador: el generador es idempotente y no elimina redes/WhatsApp.
- `node --check public/app.js`: revisa sintaxis del frontend.
- En la web publicada, abrir `/api/version`: debe responder `version: V5` y `build: tucredito-v5-20261112`.
- En Cloudflare comprobar que `Bindings` incluye `AI` y `ASSETS`, que el último `Deployment` corresponde al commit nuevo y que `/api/health` devuelve `status:ok`.
- Abrir la web en incógnito o hacer recarga forzada: Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac).
- Probar las cinco redes (YouTube abre una búsqueda, **no** un canal oficial verificado), WhatsApp y el asistente.
- Antes del lanzamiento, comprobar obligaciones legales, datos de productos, tasas, privacidad y uso de los recursos institucionales.

**No se ha podido probar un despliegue real contra la cuenta Cloudflare del usuario desde este entorno.**
