'use strict';
const el=id=>document.getElementById(id);
const nav=el('main-nav'), hamburger=el('mobile-menu');
hamburger?.addEventListener('click',()=>{const on=nav.classList.toggle('open');hamburger.setAttribute('aria-expanded',String(on));hamburger.setAttribute('aria-label',on?'Cerrar menú':'Abrir menú');});
document.querySelectorAll('.nav-arrow').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();const group=button.closest('.nav-group'),open=group.classList.toggle('active');button.setAttribute('aria-expanded',String(open));document.querySelectorAll('.nav-group').forEach(other=>{if(other!==group){other.classList.remove('active');other.querySelector('.nav-arrow')?.setAttribute('aria-expanded','false');}}); }));
document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))document.querySelectorAll('.nav-group').forEach(group=>{group.classList.remove('active');group.querySelector('.nav-arrow')?.setAttribute('aria-expanded','false');});});
// Calculadora educativa: no es una cotización financiera ni calcula la TCEA.
function calc(){const a=el('calc-amount'),m=el('calc-months'),r=el('calc-rate');if(!a||!m||!r)return;const amount=Number(a.value),months=Number(m.value),annual=Number(r.value);el('calc-months-text').textContent=`${months} meses`;if(!(amount>0&&months>0&&annual>=0&&annual<=300)){el('calc-payment').textContent='Revisá los datos';return;}const rate=annual/1200;const q=rate===0?amount/months:amount*rate/(1-Math.pow(1+rate,-months));const money=x=>new Intl.NumberFormat('es-NI',{style:'currency',currency:'NIO',maximumFractionDigits:2}).format(x);el('calc-payment').textContent=money(q);el('calc-total').textContent=money(q*months);el('calc-interest').textContent=money(q*months-amount);}
for(const id of ['calc-amount','calc-months','calc-rate'])el(id)?.addEventListener('input',calc);calc();
// Chat con consulta al Worker propio: base verificada, IA opcional y respuestas de respaldo.
const launch=el('chat-launch'),panel=el('chat-shell'),close=el('chat-close'),list=el('chat-list'),input=el('chat-question'),form=el('chat-form'),send=el('chat-send'),typing=el('chat-typing');let busy=false;const history=[];
function openChat(focus=true){const wp=el('wa-panel'),wl=el('wa-launch');if(wp?.classList.contains('open')){wp.classList.remove('open');wp.setAttribute('aria-hidden','true');wl?.setAttribute('aria-expanded','false');}panel.classList.add('open');panel.setAttribute('aria-hidden','false');launch.setAttribute('aria-expanded','true');if(focus)input.focus();}
function closeChat(focus=true){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');launch.setAttribute('aria-expanded','false');if(focus)launch.focus();}
launch.addEventListener('click',()=>panel.classList.contains('open')?closeChat():openChat());close.addEventListener('click',closeChat);document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.classList.contains('open'))closeChat();});
function bubble(text,role,sources=[]){const div=document.createElement('div');div.className='bubble '+role;div.textContent=text;
 if(role==='assistant'&&Array.isArray(sources)&&sources.length){const box=document.createElement('div');box.className='chat-source';const label=document.createElement('b');label.textContent='Consultá las fuentes:';box.append(label);for(const source of sources.slice(0,3)){if(typeof source.url!=='string'||!(source.url.startsWith('https://www.tucreditonicaragua.com.ni/')||/^\/sucursales\/[a-z-]+\/$/.test(source.url)))continue;const a=document.createElement('a');a.href=source.url;if(source.url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}a.textContent='↗ '+String(source.title||'Fuente institucional');box.append(a);}div.append(box);}list.append(div);list.scrollTop=list.scrollHeight;return div;}
async function ask(raw){const question=(raw||'').trim();if(!question||busy)return;busy=true;openChat(false);send.disabled=true;input.disabled=true;typing.hidden=false;bubble(question,'user');input.value='';let ctrl=new AbortController();let timer=setTimeout(()=>ctrl.abort(),24000);try{const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:question,history}),signal:ctrl.signal,cache:'no-store'});const data=await response.json();if(!response.ok&&!data.answer)throw Error(data.error||String(response.status));const answer=String(data.answer||'No encuentro una respuesta verificada. Consultá a Tu Crédito por sus canales oficiales.');bubble(answer,'assistant',data.sources||[]);history.push({role:'user',content:question},{role:'assistant',content:answer});if(history.length>10)history.splice(0,history.length-10);}catch(error){console.error('CHAT_ERROR_CLIENT',error);bubble('No se pudo contactar el servidor de la IA. Podés ver productos, requisitos y contacto en el menú o escribir al WhatsApp institucional (+505) 5854 5354.','assistant',[{title:'Contáctanos',url:'https://www.tucreditonicaragua.com.ni/contactenos/'}]);}finally{clearTimeout(timer);busy=false;send.disabled=false;input.disabled=false;typing.hidden=true;input.focus();}}
form.addEventListener('submit',event=>{event.preventDefault();ask(input.value);});input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ask(input.value);}});
document.querySelectorAll('[data-ask]').forEach(button=>button.addEventListener('click',()=>ask(button.dataset.ask)));

// Panel flotante de WhatsApp: no almacena conversaciones ni simula envíos.
(function(){
  const launch=document.getElementById('wa-launch');
  const panel=document.getElementById('wa-panel');
  const close=document.getElementById('wa-close');
  if(!launch||!panel||!close)return;
  const time=document.getElementById('wa-time');
  if(time)time.textContent=new Intl.DateTimeFormat('es-NI',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  const setOpen=(open)=>{panel.classList.toggle('open',open);panel.setAttribute('aria-hidden',String(!open));launch.setAttribute('aria-expanded',String(open));launch.setAttribute('aria-label',open?'Cerrar atención por WhatsApp':'Abrir atención por WhatsApp');};
  launch.addEventListener('click',()=>{const next=!panel.classList.contains('open');if(next&&typeof closeChat==='function'&&document.getElementById('chat-shell')?.classList.contains('open'))closeChat(false);setOpen(next);});
  close.addEventListener('click',()=>{setOpen(false);launch.focus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))setOpen(false)});
  document.addEventListener('pointerdown',e=>{if(panel.classList.contains('open')&&!e.target.closest('#wa-widget'))setOpen(false)});
})();
