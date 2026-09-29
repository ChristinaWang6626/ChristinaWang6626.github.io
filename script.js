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

chatForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(chatForm);
  const email=String(data.get('email')||'').trim();
  const message=String(data.get('message')||'').trim();
  if(!email||!message)return;
  const subject=encodeURIComponent('Message from Tingyin Wang’s website');
  const body=encodeURIComponent(`From: ${email}\n\n${message}`);
  window.location.href=`mailto:tingyinw@sas.upenn.edu?subject=${subject}&body=${body}`;
});
