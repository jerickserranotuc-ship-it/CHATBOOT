# Tu Crédito Nicaragua · CHATBOOT V6 PREMIUM

**Versión de prueba para Cloudflare Workers + GitHub (no es WordPress).**

## Qué cambió respecto de V5
- Portada realmente nueva, siguiendo el boceto `Tu Crédito WEB Draft.png` aportado por el cliente: fondo blanco, hero con retrato ilustrativo, acentos azul/amarillo, cuatro tarjetas de productos, pasos del proceso, sucursales, educación financiera y CTA final.
- **50 páginas HTML generadas**: las existentes, cinco páginas independientes de sucursal, directorio general, cinco páginas informativas de productos adicionales y archivo de temas históricos del plan.
- Datos de sucursales en `data/sucursales.json`: dirección, teléfono, WhatsApp y enlaces de fuente.
- Generador reproducible `scripts/generar_paginas.py`, que construye las páginas estáticas y sincroniza `src/sucursales.ts` para el chatbot.
- Asistente que responde preguntas comunes desde `src/catalog.ts`, ofrece datos específicos de sucursales y usa Workers AI solo cuando hace falta. **No aprende por sí solo**: hay que mantener sus fichas verificadas.
- Redes sociales, panel flotante de WhatsApp y enlaces de atención humana. 
- Identificador inequívoco `/api/version` -> `V6` / `tucredito-v6-20261112`.

## Instalación en el proyecto EXISTENTE `CHATBOOT`
1. Descargá este ZIP y **extraelo**.
2. Entrá a `https://github.com/jerickserranotuc-ship-it/CHATBOOT` en la rama `main`.
3. Antes de tocar nada, guardá una copia de seguridad del repositorio actual.
4. Hacé **Add file → Upload files** y arrastrá **el contenido interior** de esta carpeta (no la carpeta contenedora). Mantené `src/`, `public/`, `scripts/`, `data/`, `package.json`, `wrangler.jsonc` y `tsconfig.json` en la raíz, sustituyendo archivos homónimos.
5. Confirmá (**Commit changes**) en `main`.
6. En Cloudflare → **Workers & Pages** → `chatboot` → **Deployments**, verificá que el nuevo commit esté **Ready**. La compilación de Cloudflare debería ejecutar el comando de despliegue configurado para el repositorio.
7. En `https://TU-SUBDOMINIO.workers.dev/api/version` buscá `"version":"V6"`; usá la dirección real que muestra la pestaña **Domains**. Probá `.../api/health` y `.../sucursales/leon/`.
8. Abrí la portada con `Ctrl+Shift+R` para omitir la caché.

### Si GitHub rechaza muchos archivos
Usá GitHub Desktop o git para copiar los archivos del ZIP a la carpeta local del repositorio y hacer `git add .`, `git commit -m "Rediseño Tu Crédito V6"` y `git push`. No uses «Upload your static files» de Cloudflare: no compila TypeScript ni configura Workers AI.

## Requisitos
- `npm install` para instalar `wrangler`, TypeScript y los tipos de Cloudflare.
- `npm run check` para comprobar tipos. `npm run deploy` con Wrangler autenticado.
- Workers AI con binding `AI` y `assets.binding` = `ASSETS` en `wrangler.jsonc`.

## Antes de producción
- Los enlaces de solicitud abren el **formulario institucional original**; esta versión no procesa ni almacena solicitudes ni datos de clientes.
- **Logo:** `public/assets/logo-tu-credito-boceto-920.png` es una ampliación de un logo presente en el boceto del cliente, **no** un SVG maestro ni un recurso HD nativo. Sustituir por el logo oficial SVG/PNG del área de diseño.
- **Retrato de portada:** imagen promocional generada; no representa a una empleada real de la institución.
- **Fotografías de sucursales:** imágenes de referencia recortadas del boceto, con aviso visible; no son originales HD verificadas. Sustituir por fotografías auténticas de cada local y validar las identificaciones.
- Revisar teléfonos, direcciones, horarios, montos, tasas, contratos, tarifas, privacidad, accesibilidad, formularios y contenido editorial con el equipo institucional.
- El proyecto usa `noindex` / `robots.txt` de **staging**. Solo quitarlo tras revisar con la institución, configurar dominio/canonicals, Analytics/Search Console, privacidad y seguridad.
- Este prototipo incluye enlaces de referencia a material público; no se sincroniza automáticamente con el WordPress oficial.

## Mantenimiento de contenidos
- Direcciones y canales: editar `data/sucursales.json` y luego ejecutar `python scripts/generar_paginas.py` (esto también regenera `src/sucursales.ts`).
- Respuestas comunes del chatbot: `src/catalog.ts` (resumen propio con links a fuentes). Para agregar contenido conviene un proceso de revisión editorial; no sustituir automáticamente por scraping sin validación.
- Página HTML y navegación: `scripts/generar_paginas.py`, regenerar después de editar.
- CSS: `public/styles.css`; JS: `public/app.js`.
- Contratos, formularios y tarifario se enlazan al sitio oficial para evitar publicar versiones obsoletas.

### Plan de acción recibido
El PDF «Plan de Acción TU CREDITO Rediseño WEB - Webmaster y Redes Sociales 2026» propone WordPress, reestructuración de sitemap, imágenes, formularios, SEO y Search Console. **Esta V6 es una etapa de prototipo Cloudflare**; WordPress, migración completa de artículos, analítica y buscador se realizarán después. El plan menciona 44 URLs históricas, no idénticas a las 50 rutas actuales de este prototipo.
