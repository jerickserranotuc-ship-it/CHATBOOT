// Interfaz del chatbot. Nunca se almacenan conversaciones de visitantes en este frontend.
const panel = document.getElementById('chat-panel');
const toggle = document.getElementById('chat-toggle');
const close = document.getElementById('close-chat');
const log = document.getElementById('chat-messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const send = document.getElementById('send-button');
const status = document.getElementById('chat-status');
let processing = false;
const messages = [];

function openChat() {
  panel.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
  input.focus();
}
function closeChat() {
  panel.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}
for (const b of document.querySelectorAll('[data-open-chat]')) b.addEventListener('click', openChat);
toggle.addEventListener('click', () => panel.classList.contains('open') ? closeChat() : openChat());
close.addEventListener('click', closeChat);

function addMessage(role, content = '') {
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.textContent = content;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}
function setBusy(value) {
  processing = value;
  input.disabled = value;
  send.disabled = value;
  status.style.display = value ? 'block' : 'none';
}
function extract(eventsBuffer) {
  const normalized = eventsBuffer.replace(/\r/g, '');
  const blocks = normalized.split('\n\n');
  const remaining = blocks.pop() || '';
  const data = [];
  for (const block of blocks) {
    const lines = block.split('\n').filter(x => x.startsWith('data:'));
    if (lines.length) data.push(lines.map(x => x.slice(5).trimStart()).join('\n'));
  }
  return { remaining, data };
}

async function submitQuestion(question) {
  const content = question.trim();
  if (!content || processing) return;
  openChat();
  input.value = '';
  addMessage('user', content);
  messages.push({ role: 'user', content });
  setBusy(true);
  const answerEl = addMessage('assistant', '');
  let answer = '';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: messages.slice(-12) })
    });
    if (!response.ok || !response.body) throw new Error('Respuesta no disponible (' + response.status + ')');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let doneSignal = false;
    function consume(data) {
      if (data === '[DONE]') { doneSignal = true; return; }
      try {
        const obj = JSON.parse(data);
        const segment = typeof obj.response === 'string' ? obj.response :
          (obj.choices?.[0]?.delta?.content || '');
        if (segment) {
          answer += segment;
          answerEl.textContent = answer;
          log.scrollTop = log.scrollHeight;
        }
      } catch (error) { console.debug('Evento ignorado', error); }
    }
    while (!doneSignal) {
      const next = await reader.read();
      if (next.done) break;
      buffer += decoder.decode(next.value, { stream: true });
      const parsed = extract(buffer);
      buffer = parsed.remaining;
      for (const data of parsed.data) consume(data);
    }
    if (!doneSignal && buffer.trim()) {
      const parsed = extract(buffer + '\n\n');
      for (const data of parsed.data) consume(data);
    }
    if (!answer.trim()) throw new Error('No hubo contenido de respuesta');
    messages.push({ role: 'assistant', content: answer });
  } catch (error) {
    console.error(error);
    answerEl.textContent = 'No pude responder en este momento. Intentá nuevamente o consultá el sitio oficial: https://www.tucreditonicaragua.com.ni/';
  } finally {
    setBusy(false);
    input.focus();
  }
}
form.addEventListener('submit', e => { e.preventDefault(); submitQuestion(input.value); });
input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuestion(input.value); }});
for (const el of document.querySelectorAll('[data-question]')) {
  el.addEventListener('click', () => submitQuestion(el.getAttribute('data-question') || ''));
}
