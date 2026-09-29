const views=[...document.querySelectorAll('[data-view-panel]')];
const navLinks=[...document.querySelectorAll('[data-view-link]')];
const validViews=new Set(views.map(view=>view.dataset.viewPanel));

function showView(){
  const requested=location.hash.slice(1);
  const active=validViews.has(requested)?requested:'research';
  views.forEach(view=>{
    const selected=view.dataset.viewPanel===active;
    view.hidden=!selected;
    view.setAttribute('aria-hidden',String(!selected));
  });
  navLinks.forEach(link=>{
    const selected=link.dataset.viewLink===active;
    link.classList.toggle('active',selected);
    if(selected)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

window.addEventListener('hashchange',showView);
showView();
document.querySelector('#year').textContent=new Date().getFullYear();

const chat=document.querySelector('[data-chat-assistant]');
const chatPanel=chat?.querySelector('.chat-panel');
const chatLauncher=chat?.querySelector('.chat-launcher');
const chatClose=chat?.querySelector('.chat-close');
const chatForm=chat?.querySelector('[data-chat-form]');
const chatFormView=chat?.querySelector('[data-chat-form-view]');
const chatSuccess=chat?.querySelector('[data-chat-success]');
const chatSend=chat?.querySelector('.chat-send');
const chatStatus=chat?.querySelector('.chat-form-status');
const chatRetry=chat?.querySelector('.chat-retry');
const chatAnother=chat?.querySelector('[data-chat-another]');
const chatEndpoint='https://formsubmit.co/ajax/tingyinw@sas.upenn.edu';

function setChat(open){
  if(!chatPanel||!chatLauncher)return;
  chatPanel.hidden=!open;
  chatLauncher.setAttribute('aria-expanded',String(open));
  chatLauncher.setAttribute('aria-label',open?'Close chat with Tingyin':'Open chat with Tingyin');
  if(open)requestAnimationFrame(()=>chatPanel.querySelector('input')?.focus());
  else chatLauncher.focus();
}

chatLauncher?.addEventListener('click',()=>setChat(chatPanel.hidden));
chatClose?.addEventListener('click',()=>setChat(false));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!chatPanel?.hidden)setChat(false);
});

chatForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!chatSend||!chatStatus||!chatRetry||!chatFormView||!chatSuccess)return;
  chatStatus.className='chat-form-status';
  chatStatus.textContent='';
  chatRetry.hidden=true;
  chatSend.disabled=true;
  chatSend.textContent='Sending…';
  const payload=Object.fromEntries(new FormData(chatForm).entries());
  try{
    const response=await fetch(chatEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok||result.success===false||result.success==='false')throw new Error('Submission failed');
    chatForm.reset();
    chatFormView.hidden=true;
    chatSuccess.hidden=false;
  }catch(error){
    chatStatus.textContent='Message failed to send. Please check your email and message, then try again.';
    chatStatus.className='chat-form-status show error';
    chatRetry.hidden=false;
  }finally{
    chatSend.disabled=false;
    chatSend.textContent='Send message';
  }
});

chatRetry?.addEventListener('click',()=>chatForm?.requestSubmit());
chatAnother?.addEventListener('click',()=>{
  if(!chatFormView||!chatSuccess||!chatStatus||!chatRetry)return;
  chatSuccess.hidden=true;
  chatFormView.hidden=false;
  chatStatus.className='chat-form-status';
  chatStatus.textContent='';
  chatRetry.hidden=true;
  chatForm?.querySelector('input[type="email"]')?.focus();
});
