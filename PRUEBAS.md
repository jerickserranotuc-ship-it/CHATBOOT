# Pruebas de V6

Comprobadas en el contenedor de trabajo el 12-11-2026.

- Generación de HTML: `python scripts/generar_paginas.py` → 50 páginas.
- `python scripts/verificar_v6.py` → 50 páginas, seis rutas bajo `/sucursales/`, enlaces internos y assets locales sin rutas faltantes.
- `node --check public/app.js` → sintaxis JavaScript correcta.
- `transpileModule` de TypeScript para `src/index.ts`, `src/catalog.ts`, `src/sucursales.ts`, `src/types.ts` → sin errores de sintaxis.
- Vista previa aislada con Chromium: portada de 1440px y 390px; sucursal León de 1365px; sin errores de página ni scroll horizontal.
- Interacciones de navegador: WhatsApp cerrado → abierto, menú móvil `aria-expanded` cambia a `true`.
- Capturas: `CHATBOOT_V6_PORTADA_ESCRITORIO.png`, `CHATBOOT_V6_PORTADA_MOVIL.png`, `CHATBOOT_V6_SUCURSAL_LEON.png` entregadas fuera del ZIP.

**Pendiente de comprobar en Cloudflare:** despliegue real, binding Workers AI, `/api/chat`, tiempos de respuesta, protección antiabuso, accesibilidad integral, resolución de dominios, carga de medios, formulario oficial y acciones de atención humana.

La verificación `tsc --noEmit` no se pudo completar localmente porque no estaban instaladas las dependencias npm (`@cloudflare/workers-types`). Se incluyen en `package.json` para poder comprobarlas después de `npm install` o durante la compilación de GitHub/Cloudflare.
