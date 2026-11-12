// Interfaz del chat. Usa el mismo dominio y el endpoint /api/chat del Worker.
const panel = document.getElementById('chat-panel');
const toggle = document.getElementById('chat-toggle');
const closeButton = document.getElementById('close-chat');
const input = document.getElementById('user-input');
const form = document.getElementById('chat-form');
const messagesElement = document.getElementById('chat-messages');
const statusElement = document.getElementById('chat-status');
const sendButton = document.getElementById('send-button');

let busy = false;
const history = []; // Solo memoria del navegador; no se guarda en una base de datos.

function openChat() {
  panel.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
  input.focus();
}
function closeChat() {
  panel.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();
}
toggle.addEventListener('click', () => panel.classList.contains('open') ? closeChat() : openChat());
closeButton.addEventListener('click', closeChat);
document.querySelectorAll('[data-open-chat]').forEach(button => button.addEventListener('click', openChat));
document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
  openChat();
  input.value = button.dataset.question || '';
  input.focus();
}));

function addMessage(role, content) {
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.textContent = content; // Evita insertar HTML proporcionado por visitantes o el modelo.
  messagesElement.appendChild(el);
  messagesElement.scrollTop = messagesElement.scrollHeight;
  return el;
}

function parseEvents(buffer) {
  const normalized = buffer.replace(/\r\n/g, '\n');
  const parts = normalized.split('\n\n');
  const rest = parts.pop() || '';
  const events = parts.map(block => block.split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.substring(5).trimStart()).join('\n')).filter(Boolean);
  return { events, rest };
}

async function sendMessage(message) {
  if (!message || busy) return;
  busy = true;
  input.value = '';
  input.disabled = true;
  sendButton.disabled = true;
  statusElement.style.display = 'block';
  addMessage('user', message);
  history.push({ role: 'user', content: message });
  const reply = addMessage('assistant', '');
  let text = '';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-12) }),
    });
    if (!response.ok || !response.body) throw new Error('La consulta no pudo completarse');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let complete = false;
    while (!complete) {
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      const parsed = parseEvents(done ? buffer + '\n\n' : buffer);
      buffer = parsed.rest;
      for (const data of parsed.events) {
        if (data === '[DONE]') { complete = true; break; }
        let item;
        try { item = JSON.parse(data); } catch { continue; }
        const chunk = typeof item.response === 'string'
          ? item.response : (item.choices?.[0]?.delta?.content || '');
        if (typeof chunk === 'string') {
          text += chunk;
          reply.textContent = text;
          messagesElement.scrollTop = messagesElement.scrollHeight;
        }
      }
      if (done) complete = true;
    }
    if (!text) throw new Error('No hubo respuesta de la IA');
    history.push({ role: 'assistant', content: text });
  } catch (err) {
    console.error(err);
    reply.textContent = 'No pude responder en este momento. Por favor, inténtalo de nuevo.';
    history.pop(); // Quita el último mensaje si hubo error y permite reintentar.
  } finally {
    busy = false;
    input.disabled = false;
    sendButton.disabled = false;
    statusElement.style.display = 'none';
    input.focus();
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  sendMessage(input.value.trim());
});
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
