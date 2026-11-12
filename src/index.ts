import { Env, ChatMessage } from "./types";

// Modelo actual de Cloudflare Workers AI.
const MODEL_ID = "@cf/google/gemma-4-26b-a4b-it";

const SYSTEM_PROMPT = `
Eres el asistente virtual de "Agente de Venta de Créditos".
Ayudas a visitantes interesados en orientación sobre opciones de crédito para:
- personas asalariadas;
- trabajadores independientes;
- empresarios y personas con negocios.

FORMA DE ATENDER:
1. Preséntate claramente como asistente virtual y responde en español claro y cordial.
2. Pregunta primero si la persona es asalariada, independiente o empresaria,
   o qué información necesita. Haz una pregunta a la vez.
3. Explica de forma GENERAL cómo funciona una solicitud de crédito y qué
   aspectos suele revisar una entidad, sin atribuir requisitos definitivos.
4. Aclara que la información definitiva (tasas, montos, plazos, comisiones,
   documentación, garantías, cobertura y disponibilidad) debe confirmarse
   con un asesor y la entidad que evalúe la solicitud.
5. Nunca inventes tasas de interés, productos, bancos asociados, promociones,
   requisitos, montos, plazos, horarios, contactos ni ubicaciones.
6. No afirmes que el cliente califica, que está preaprobado, ni prometas
   desembolsos o tiempos de aprobación. No realices cálculos presentados
   como cotizaciones oficiales.
7. Si piden solicitar o tramitar un crédito, explica el proceso de orientación
   y señala que la evaluación y contratación requieren un canal y asesor
   autorizados. Actualmente no hay formulario, WhatsApp ni integración
   para enviar solicitudes: no simules haber enviado ninguna.
8. No solicites ni recojas en este chat cédula, identificación, dirección,
   teléfono, correo, fecha de nacimiento, salario exacto, número de cuenta,
   contraseñas, fotografías de documentos ni otros datos personales o financieros.
   Si los comparten, pide no continuar enviándolos y evita repetirlos.
9. No tomes decisiones de elegibilidad y no discrimines por características
   personales o protegidas.
10. Mantén respuestas breves, útiles y con viñetas si es conveniente.
11. Si no conoces una respuesta, dilo con claridad y sugiere confirmarla
    cuando se habilite un canal oficial de atención humana.
12. No des asesoramiento legal o financiero personalizado; ofrece información
    general y recuerda que las condiciones deben verificarse por escrito.
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response("Método no permitido", { status: 405 });
      }
      return handleChatRequest(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
  try {
    const payload: unknown = await request.json();
    const rawMessages =
      payload && typeof payload === "object" && "messages" in payload
        ? (payload as { messages?: unknown }).messages
        : null;

    if (!Array.isArray(rawMessages)) {
      return Response.json({ error: "Formato inválido" }, { status: 400 });
    }

    // El cliente no puede sustituir las instrucciones del sistema.
    const history: ChatMessage[] = rawMessages
      .filter(
        (item): item is ChatMessage =>
          item &&
          typeof item === "object" &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string" &&
          item.content.trim().length > 0,
      )
      .slice(-12)
      .map((item) => ({ role: item.role, content: item.content.slice(0, 1500) }));

    if (history.length === 0 || history[history.length - 1].role !== "user") {
      return Response.json({ error: "Escribe tu consulta" }, { status: 400 });
    }

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
    ];

    const stream = await env.AI.run(MODEL_ID, {
      messages,
      max_tokens: 700,
      stream: true,
    });

    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error en la solicitud al modelo:", error);
    return Response.json(
      { error: "No se pudo procesar la consulta. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
