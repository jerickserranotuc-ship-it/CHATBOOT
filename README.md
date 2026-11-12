# CHATBOOT · Propuesta de rediseño Tu Crédito Nicaragua (12/11/2026)

Sitio demostrativo completo de navegación, catálogo de productos, simulador educativo, FAQ, sucursales, enlaces oficiales, recursos y asistente de créditos en español.

## Subir a Cloudflare mediante GitHub

1. Antes de reemplazar, **conservá una copia de tu repositorio actual**.
2. En la rama `main` de `jerickserranotuc-ship-it/CHATBOOT`, subí **el contenido de esta carpeta**, no la carpeta contenedora.
3. Conservá rutas `src/index.ts`, `src/catalog.ts`, `src/types.ts`, `public/index.html`, `public/main.js`, `wrangler.jsonc`, `package.json`, `tsconfig.json`.
4. Confirmá cambios con **Commit changes**; Cloudflare debe iniciar un nuevo despliegue si la integración Git está activa. Alternativa: `npm install && npx wrangler deploy` desde la raíz.
5. Cloudflare → Workers & Pages → `chatboot` → Settings: verificar binding de Workers AI `AI`, assets `ASSETS` y dominio `workers.dev`.
6. Abrí `/api/health` en el nuevo dominio. Tiene que devolver `status: ok`, `knowledge_articles` > 20 y `ai_binding:true` si la vinculación está presente.
7. Probá `/` en ventana privada. Presioná "Solicitar crédito", "Tasas", "Moto", "Sucursales" en el chat.

## Por qué el chat responde aun sin IA

Las consultas habituales obtienen respuestas deterministas y fuentes desde `src/catalog.ts`. Preguntas más abiertas se envían a Workers AI usando `@cf/google/gemma-4-26b-a4b-it` y, si el modelo falla por falta de permisos, límites, capacidad o configuración, se utiliza información local. Los errores reales se registran en Cloudflare → Observability → Workers Logs (`WORKERS_AI_ERROR`). No se entrenó ningún modelo desde cero. La "base de conocimiento" se actualiza editando `src/catalog.ts` y publicando la nueva versión.

## Limitaciones antes de publicar en producción

- Este prototipo no recibe formularios con cédula, datos personales ni comprobantes. Los botones llevan a páginas verificadas del sitio institucional existente; la integración con su CRM y los formularios requiere backend seguro, control de acceso, protección de datos, auditoría y consentimiento.
- La calculadora es ilustrativa (amortización de cuota constante sin seguros, comisiones ni ajuste cambiario), no representa la cuota/TCEA contractual.
- El tarifario utilizado está fechado **16/06/2026**. Revisar vigencia, tasas, contratación, horarios, direcciones y números antes del lanzamiento.
- El branding visual es una interpretación rediseñada, **no una réplica píxel a píxel** del sitio WordPress. Para un reemplazo fiel de todo su contenido, plugins, medios, formulario y SEO, sería necesario el código fuente/administración o una exportación de WordPress y assets originales.
- Asegurar permisos sobre logos, fotos, materiales institucionales, identidad visual y cumplimiento legal antes del cambio de dominio.
- Agregar Cloudflare Turnstile, rate limiting, política de privacidad, seguridad y supervisión humana antes de abrir el chatbot a usuarios reales.
- Actualizar `src/catalog.ts` cuando cambien productos o tarifas. No hay sincronización automática con la web.

## Diagnóstico rápido

- Veo la plantilla **Cloudflare AI Chat** en vez de este diseño: estás abriendo otro Worker, un dominio antiguo o un despliegue no actualizado.
- `/api/health` devuelve 404: backend viejo, Worker o ruta incorrecta.
- `ai_binding:false`: falta el binding `AI` en la configuración desplegada.
- `ai_binding:true` pero respuestas solo de base: revisá logs por errores de Workers AI (por ejemplo, cuota 429, términos, 403 o capacidad).
- El código TS no se puede subir con **Upload your static files**. Usá GitHub o `wrangler deploy`.

## Fuentes

Ver `FUENTES.md`. Se enlazan recursos institucionales directamente sin almacenar datos personales.
