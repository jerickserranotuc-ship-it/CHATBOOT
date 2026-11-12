# Tu Crédito Nicaragua — CHATBOOT V5 (corregida)

**Versión verificable:** `tucredito-v5-20261112`

La anterior entrega V4 seguía diciendo **V3** en su README y, además, el generador de páginas de V3 podía borrar las mejoras de redes/WhatsApp cuando se ejecutaba. Esta entrega **corrige ambos problemas**.

## Qué cambia visualmente respecto a V3

- Barra superior de redes sociales (Facebook, Instagram, X, LinkedIn y acceso provisional de búsqueda en YouTube).
- Logotipo suministrado en la captura del usuario colocado en el encabezado, el héroe, el chatbot y la ventana de WhatsApp.
- **Héroe rediseñado:** elimina la imagen remota que se veía vacía; ahora se renderiza una tarjeta institucional local con accesos a Consumo, Nómina y Tu Moto y botón verde de WhatsApp.
- Franja visible bajo el encabezado principal para contactar directamente a WhatsApp.
- Widget flotante de WhatsApp con bienvenida y botón «Empezar Chat».
- Asistente automático separado, para no confundirlo con atención humana.
- Estilos móviles ajustados y CSS/JS versionados para evitar que el navegador conserve la V3 anterior.

## Cómo subir la V5

1. En GitHub, abrí `jerickserranotuc-ship-it/CHATBOOT` en la rama **main**.
2. Hacé una copia/backup del repositorio. Luego `Add file → Upload files`.
3. Arrastrá **todo el CONTENIDO INTERIOR** del ZIP (no la carpeta exterior): `public/`, `src/`, `scripts/`, `package.json`, `tsconfig.json`, `wrangler.jsonc`, etc. Reemplazá todos los archivos existentes.
4. Seleccioná **Commit changes**. Confirmá que GitHub muestre el nuevo `README.md` con el título `CHATBOOT V5`.
5. Entrá en Cloudflare → Workers & Pages → `chatboot` → **Deployments**. Verificá que se haya desplegado el commit que acabás de subir y que indique **Ready**.
6. En el dominio de tu Worker abrí `/api/version`. Debe devolver `"version":"V5"` y `"whatsapp":true`. Si devuelve 404 o V3, **seguís viendo un despliegue anterior**, aunque GitHub tenga el código nuevo.
7. Recargá la página con Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac), o probá en una ventana de incógnito.
8. Si `/api/version` indica V5 y aún ves elementos antiguos, inspeccioná si Cloudflare tiene una ruta o un dominio que apunte a otro Worker distinto de `chatboot`.

## Chat y seguridad

El chatbot usa 43 fichas de información de origen público. Las consultas frecuentes tienen respuesta local incluso si Workers AI falla, pero la publicación real debe comprobarse en `/api/chat`. No se registran solicitudes, se aprueban créditos ni se recopilan datos sensibles. Los formularios institucionales originales siguen enlazados.

WhatsApp principal: +505 5854 5354. YouTube es una búsqueda, no un canal institucional verificado. Confirmá los enlaces institucionales antes del lanzamiento.

Las imágenes y logos se han tomado de las capturas facilitadas por el usuario y deben sustituirse por recursos maestros institucionales antes de producción. El diseño es una modernización y no una reproducción píxel por píxel de WordPress.

## Regenerar páginas

`scripts/generar_paginas.py` **ya incluye** los widgets de redes y WhatsApp, el nuevo héroe y las rutas V5. Ejecutarlo con `python scripts/generar_paginas.py` **no debe restaurar V3**. Si modificás el generador, comprobá que las páginas generadas mantienen estos elementos.

## Pruebas

- Todas las páginas HTML tienen `meta name="chatboot-build" content="tucredito-v5-20261112"`.
- `/api/version` indica versión, página y funcionalidades activadas.
- `public/styles.css?v=tucredito-v5-20261112` y `public/app.js?v=tucredito-v5-20261112` desactivan la reutilización de recursos con nombre viejo.
- Para comparar exactamente dos versiones, verificá el resultado de `/api/version`.
