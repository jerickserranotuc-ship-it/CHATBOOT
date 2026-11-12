# Tu Crédito Nicaragua · CHATBOOT V3

## Alcance

Este proyecto es una **propuesta de modernización y réplica de la arquitectura pública** del portal de Tu Crédito Nicaragua, preparada para su validación institucional. Incluye **38 rutas HTML** y un chat con **43 fichas de conocimiento verificable** y soporte opcional para Cloudflare Workers AI.

- Basado en las secciones y enlaces públicos de `https://www.tucreditonicaragua.com.ni/`, revisados el 12 de noviembre de 2026.
- Navegación completa con menús Inicio, Empresa, Créditos, Convenios, Contáctanos, Contratos, Empleo, Reporte de Pago, Reclamos y Educación Financiera.
- Páginas de cada producto, preguntas frecuentes, cinco sedes, contratos, tarifario, calculadora ilustrativa, solicitud, empleo, reclamos y 12 materiales educativos.
- Colores de referencia de la marca: azul `#1E3864`, amarillo `#FFD140`, celeste `#8ED1FC`.
- El chatbot responde preguntas frecuentes desde su base local incluso si no hay binding de IA; para dudas más abiertas intenta Workers AI y retorna a la respuesta local si la llamada falla.
- Los formularios sensibles **no** se clonan ni procesan: redirigen al sitio institucional original. No enviar documentos personales por el chat.

## Importante: fidelidad de la marca

El encabezado intenta mostrar el logo presente en un material público de la cuenta social de Tu Crédito. Si no se puede cargar ese recurso remoto, muestra `public/assets/logo-tu-credito-referencia.svg`, una **recreación de referencia**. **Para una reproducción visual exactamente igual, sustitúyelo por el archivo oficial original** (SVG o PNG) que posea el equipo institucional y confirma las pautas de marca. El gráfico alternativo del héroe es una ilustración vectorial propia; en navegadores que permiten la carga de medios públicos se muestra el material de la cuenta social institucional. Otras fotografías originales, sliders, librerías y formularios de WordPress requieren archivos o acceso a su instalación de origen.

## Publicar sobre el proyecto `chatboot`

1. Realiza una copia del repositorio actual `jerickserranotuc-ship-it/CHATBOOT` para poder volver atrás.
2. Descomprime el ZIP. Abre el repositorio y la rama `main`.
3. Usa `Add file → Upload files` y arrastra **todo el contenido interior del ZIP**, no la carpeta exterior. Deben quedar `public/`, `src/`, `package.json`, `tsconfig.json`, `wrangler.jsonc`, `.gitignore`, `scripts/` y estos documentos en la raíz. Confirma reemplazar los archivos originales.
4. Haz `Commit changes`. Tu integración GitHub → Workers debe iniciar un despliegue. Alternativamente, desde una computadora con Node.js: `npm install` y `npm run deploy`.
5. En Cloudflare → Workers & Pages → `chatboot` → Deployments comprueba `Ready`.
6. En Settings → Domains & Routes habilita `workers.dev` si está desactivado.
7. Comprueba `https://<tu-worker>.workers.dev/api/health`: debe dar `status:ok`, `knowledge_articles:43` y `ai_binding:true` si AI está configurado. En Cloudflare deben existir los bindings `AI` (Workers AI) y `ASSETS` (sitio estático).
8. Abre varias páginas, el menú móvil y el chat. Comprueba que no haya errores en Observability → Workers Logs.

## Rutas y contenido

Las páginas ya fueron generadas dentro de `public/`: `public/index.html`, `public/prestamo-consumo/index.html`, etc. El Worker intercepta una ruta como `/prestamo-consumo/` y sirve internamente `/prestamo-consumo/index.html`. Esto permite enlaces SEO legibles y recarga directa.

La navegación se declara en `scripts/generar_paginas.py`. Para **cambiar los menús o textos comunes**, modifica el generador y ejecútalo con `python scripts/generar_paginas.py`. El generador solamente reescribe los archivos HTML de las rutas, no destruye el resto del proyecto. Si modificas páginas manualmente, al regenerar se pueden sobrescribir esas modificaciones; por eso conviene editar el generador.

Los estilos están en `public/styles.css`; la interactividad y el chatbot en `public/app.js`; el modelo y endpoint en `src/index.ts`; el contenido del asistente en `src/catalog.ts`.

## Cómo ampliar la información del chatbot

Edita `src/catalog.ts`. Cada entrada contiene `id`, `title`, `terms` (frases de búsqueda), `answer` (respuesta redactada) y `sources` (enlaces a fuentes públicas). El buscador selecciona las fichas pertinentes por términos; el modelo de IA, si está habilitado y la pregunta no se contesta directamente con la base, recibe **solo las fichas relevantes** como contexto. Esto **no equivale a entrenamiento automático**: hay que mantener los datos y aprobar cada cambio.

No incluyas teléfonos privados, datos de clientes, expedientes de crédito ni secretos en el catálogo.

## Estado de pruebas

- ✅ 38 archivos de páginas HTML generados.
- ✅ Enlaces internos resueltos: ningún enlace a ruta interna inexistente.
- ✅ JavaScript revisado con `node --check`.
- ✅ TypeScript revisado con un shim temporal de tipos compatibles; el código se transpila y ejecuta en pruebas de Worker simuladas.
- ✅ 7 consultas de referencia respondidas en modo de base local; navegación de rutas, `/api/health`, menú móvil y chat ensayados mediante pruebas locales.
- ⏳ No se desplegó a Cloudflare desde esta sesión y **no se probó Workers AI real con tu cuenta**.
- ⏳ Integraciones con CRM, gestión de solicitudes, envío de formularios, cuentas, reclamos, CAPTCHA y analítica requieren diseño y aprobación de seguridad.

## Pendientes de producción

1. Subir el archivo **original oficial del logo** y las fotografías aprobadas (reemplazar recursos remotos de redes sociales para mayor velocidad y disponibilidad).
2. Validar cada texto y requisito contra la unidad jurídica/comercial, especialmente tarifas, promociones, tiempos de respuesta y condiciones de elegibilidad.
3. Integrar formularios de solicitud, reportes de pago y reclamos **solo** mediante backend institucional y consentimiento informado; **no** capturar datos sensibles en un simple chat público.
4. Implementar protección contra abuso (Cloudflare Turnstile, WAF, rate limiting), monitoreo, política de privacidad y retención de información.
5. Activar el dominio de producción en el DNS oficial y retirar las etiquetas de `noindex,nofollow` del generador y la regla `Disallow: /` de `public/robots.txt` **solamente cuando el portal haya sido aprobado para publicación**. Antes de hacerlo, generar `sitemap.xml` con el dominio de producción definitivo.
6. Probar accesibilidad, optimización de imágenes, rutas, integraciones y formularios reales en staging y producción.

## Nota sobre datos bancarios

No se integraron formularios que reciban cédulas, vouchers ni datos de cuenta en una infraestructura de prueba. Los botones dirigidos a información sensible abren **los canales originales publicados por la institución**. Verifica con el área operativa antes de replicar cuentas receptoras de pagos.

Para referencias y vínculos exactos, consulta `FUENTES.md`.


## V4 — Redes + WhatsApp + identidad

- Barra de cinco redes sociales y enlace principal de WhatsApp.
- Widget de WhatsApp con ventana de bienvenida y botón **Empezar Chat**, independiente del asistente de Workers AI.
- Marca institucional extraída de captura suministrada y colocada en cabecera, chatbot, WhatsApp, favicon y home.
- Se eliminó el texto de la interfaz «Orientación en español» y se mejoró el diseño responsive.
- Para enlaces confirmados y canal YouTube pendiente, ver `REDES_Y_LOGO.md`.
