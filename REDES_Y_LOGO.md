# Enlaces de contacto y logotipo — V4

El proyecto incorpora una barra de redes, un panel WhatsApp y un acceso al chatbot de IA independiente.

## Destinos incluidos

- WhatsApp de atención general: https://wa.me/50558545354 (enlace publicado por el sitio original).
- Facebook: https://www.facebook.com/tucreditonic/ (identificador en reglamento institucional, octubre de 2025).
- Instagram: https://www.instagram.com/tucreditonic/ (identificador en reglamento institucional, octubre de 2025).
- X: https://x.com/tucreditonic (perfil público de la entidad).
- LinkedIn: https://www.linkedin.com/company/tu-credito-nicaragua/ (perfil de empresa).
- YouTube: enlace provisional a búsqueda de Tu Crédito Nicaragua; no se logró verificar el URL específico del canal institucional. Cambiar el atributo href del botón `youtube` en los index.html al recibir URL confirmado.

## Logo

El archivo `public/assets/logo-tu-credito-proporcionado.png` se recortó de la captura de pantalla aportada para esta tarea. Es una referencia al logotipo real, pero su resolución es limitada. Para producción, reemplazar ese PNG por el SVG/PNG original de la institución, manteniendo la misma ruta. El logo aparece en cabecera, avatar de chat, widget WhatsApp, favicon y sello del hero.

## Seguridad

El widget abre WhatsApp mediante enlace `wa.me`, pero NO incorpora WhatsApp Business API ni graba conversaciones. El chatbot de Cloudflare sigue independiente y no recibe documentos ni datos sensibles. El número de WhatsApp de reporte de pago es distinto, ver página institucional oficial para operaciones de pago.

Fuentes de verificación:
- https://www.tucreditonicaragua.com.ni/
- https://www.tucreditonicaragua.com.ni/contactenos/
- https://www.tucreditonicaragua.com.ni/wp-content/uploads/2025/10/reglamento-de-promocion-APOYEMOS-LA-SELECCION.pdf
- https://x.com/tucreditonic
- https://www.linkedin.com/company/tu-credito-nicaragua/
