# Pruebas sugeridas antes de aprobar el despliegue

1. Abrir `/api/health` y verificar que el estado es `ok`; 43 fichas; `ai_binding:true` cuando Workers AI esté conectado.
2. Probar `/`, `/prestamo-consumo/`, `/tu-credi-nomina-descuento-de-planilla/`, `/credito-tu-moto/`, `/preguntas-frecuentes/`, `/educacion-financiera/`, `/reclamos-y-sugerencias/`, `/calculadora-de-cuotas/`.
3. En escritorio abrir submenús con ratón y teclado; en móvil abrir hamburguesa y desplegables.
4. Probar calculadora cambiando monto, plazo y tasa; verificar que no se presenta como oferta.
5. Preguntar al chatbot: "Hola", "Quiero un préstamo de consumo", "¿Qué requisitos piden?", "¿Qué es la TCEA?", "¿Dónde queda la sucursal Estelí?", "¿Cómo reporto mi pago?", "¿Qué es un fondo de emergencia?", "¿Cómo pongo un reclamo?".
6. Desconectar de forma controlada el binding AI en staging (no producción) y comprobar que las preguntas frecuentes siguen respondiendo por base local.
7. Confirmar que ninguna página de staging recoja cédula, contraseña o datos bancarios en formularios propios.
8. Revisar vigencia de tarifas, horarios, teléfonos y enlaces externos; validar jurídicamente todo texto antes de producción.
