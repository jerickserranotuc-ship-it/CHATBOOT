# CHATBOOT — Agente de Venta de Créditos

Proyecto completo de Cloudflare Workers + Workers AI con página informativa y chatbot en español.
La base factual es una **síntesis de fuentes públicas** del portal de Tu Crédito Nicaragua consultadas el 12 de noviembre de 2026. El proyecto no declara asociación, agencia ni autorización de la institución.

## Archivos
- `src/knowledge.ts`: conocimiento sobre productos, tasas, condiciones, sucursales, dudas frecuentes y enlaces oficiales.
- `src/index.ts`: backend con IA e instrucciones de comportamiento seguro.
- `src/types.ts`: tipos de Workers AI.
- `public/index.html`: página de bienvenida con accesos temáticos.
- `public/chat.js`: chat web en español que utiliza `/api/chat`.
- `wrangler.jsonc`: configuración de ASSETS y AI.
- `package.json` y `tsconfig.json`: dependencias y validación.

## Actualización del repositorio conectado
1. Descomprime el ZIP. En GitHub, abre `jerickserranotuc-ship-it/CHATBOOT` y la rama `main`.
2. En `Add file > Upload files`, arrastra **los archivos y carpetas que están dentro** de `CHATBOOT`, no la carpeta exterior. Conserva las rutas `src/*` y `public/*`.
3. Verifica que se estén actualizando los archivos esperados. Confirma `Commit changes`.
4. En Cloudflare, abre **chatboot > Deployments** y comprueba que el despliegue nuevo quede `Ready`.
5. Comprueba `Bindings` = `AI` y `ASSETS` y activa `workers.dev` en `Domains & Routes` si sigue desactivado.
6. Abre la dirección real del Worker. Prueba: `¿Qué requisitos tiene crédito consumo?`, `¿Cuánto es la TCEA de consumo según el tarifario?`, `¿Dónde queda Matagalpa?`, `¿Cómo solicito un crédito?`.

## Actualización desde una terminal (opcional)
`npm install`
`npm run check`
`npx wrangler login`
`npm run deploy`

## Limitaciones importantes
- NO presenta información en tiempo real ni realiza consultas al sitio durante las conversaciones.
- No procesa solicitudes, cédulas, pagos, aprobaciones ni elegibilidad. Remite a medios oficiales.
- Verifica tarifas y requisitos antes de difundirlo comercialmente; las publicaciones cambian y pueden contener diferencias.
- El tarifario incluido es el documento fechado el 16/06/2026, no una oferta personalizada.
- Mantén visible el aviso de independencia respecto de Tu Crédito Nicaragua hasta que exista una relación formal verificada.
- Antes de publicar para clientes reales, añade política de privacidad, reglas de retención y controles antiabuso/rate limiting.

## Fuentes
Consulta `FUENTES.md`.
