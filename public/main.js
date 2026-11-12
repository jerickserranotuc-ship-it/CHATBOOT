'use strict';
const $ = (id)=>document.getElementById(id);
const nav=$('nav'), menu=$('menu-btn');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));

const money = (amount)=>new Intl.NumberFormat('es-NI',{style:'currency',currency:'NIO',minimumFractionDigits:2,maximumFractionDigits:2}).format(amount);
function calc(){
  const amount=Number($('loan-amount').value), months=Number($('loan-months').value), annual=Number($('loan-rate').value);
  $('loan-amount-text').textContent=money(amount).replace('.00','');
  $('loan-months-text').textContent=`${months} meses`;
  const r=annual/1200, q=r===0?amount/months:amount*r/(1-Math.pow(1+r,-months));
  $('monthly-result').textContent=money(q);
  $('total-result').textContent=money(q*months);
  $('interest-result').textContent=money(q*months-amount);
}
$('loan-type').addEventListener('change',()=>{if($('loan-type').value!=='custom')$('loan-rate').value=$('loan-type').value;calc();});
$('loan-rate').addEventListener('input',()=>{$('loan-type').value='custom';calc();});
$('loan-amount').addEventListener('input',calc);$('loan-months').addEventListener('input',calc);calc();

const chat=$('chat-box'), toggle=$('chat-toggle'), close=$('chat-close'), input=$('chat-input'), send=$('chat-send'), body=$('chat-body'), status=$('chat-status');
const history=[];let isSending=false;
function openChat(){chat.classList.add('open');toggle.setAttribute('aria-expanded','true');input.focus();}
function closeChat(){chat.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>chat.classList.contains('open')?closeChat():openChat());close.addEventListener('click',closeChat);
document.addEventListener('keydown',e=>{if(e.key==='Escape' && chat.classList.contains('open'))closeChat();});
function bubble(text,role,sources=[]){
  const el=document.createElement('div');el.className=`bubble ${role}`;el.textContent=text;
  if(role==='assistant' && Array.isArray(sources) && sources.length){
    const wrap=document.createElement('div');wrap.className='sources';
    const label=document.createElement('b');label.style.fontSize='11px';label.textContent='Fuentes oficiales:';wrap.append(label);
    for(const source of sources.slice(0,3)){
      if(typeof source.url!=='string'||!source.url.startsWith('https://www.tucreditonicaragua.com.ni/')) continue;
      const a=document.createElement('a');a.href=source.url;a.textContent='↗ '+String(source.title||'Consultar fuente');a.target='_blank';a.rel='noopener noreferrer';wrap.append(a);
    }
    el.append(wrap);
  }
  body.append(el);body.scrollTop=body.scrollHeight;
}
async function ask(question){
  question=(question||'').trim();if(!question||isSending)return;
  openChat();isSending=true;send.disabled=true;input.disabled=true;status.style.display='block';
  bubble(question,'user');input.value='';
  try{
    const ctrl=new AbortController();const abort=setTimeout(()=>ctrl.abort(),22000);
    let response;
    try{response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:question,history}),signal:ctrl.signal});}
    finally{clearTimeout(abort);}
    const data=await response.json();
    if(!response.ok && !data.answer)throw new Error(data.error||`HTTP ${response.status}`);
    const answer=String(data.answer||'No encontramos información para esa consulta. Podés consultar el sitio institucional: https://www.tucreditonicaragua.com.ni/');
    bubble(answer,'assistant',data.sources);
    history.push({role:'user',content:question},{role:'assistant',content:answer});
    if(history.length>12)history.splice(0,history.length-12);
  }catch(err){
    const msg=err.name==='AbortError'?'La consulta tardó demasiado. Probá nuevamente.':'No se pudo contactar el servidor del chatbot. Verificá que Cloudflare haya desplegado el Worker y el binding AI.';
    bubble(msg+' Mientras tanto, podés consultar los requisitos y solicitudes en el sitio institucional: https://www.tucreditonicaragua.com.ni/','assistant',[]);
    console.warn('CHAT_CLIENT_ERROR',err);
  }finally{
    isSending=false;send.disabled=false;input.disabled=false;status.style.display='none';input.focus();
  }
}
$('chat-form').addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(input.value);}});
document.querySelectorAll('[data-ask]').forEach(btn=>btn.addEventListener('click',()=>ask(btn.dataset.ask)));
