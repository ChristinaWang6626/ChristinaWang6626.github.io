const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-button');
const views=[...document.querySelectorAll('[data-view]')];
const navLinks=[...document.querySelectorAll('[data-view-link]')];
const validViews=new Set(views.map(view=>view.dataset.view));

function showView(){
  const requested=location.hash.slice(1);
  const active=validViews.has(requested)?requested:'about';
  views.forEach(view=>{
    const selected=view.dataset.view===active;
    view.hidden=!selected;
    view.setAttribute('aria-hidden',String(!selected));
  });
  navLinks.forEach(link=>{
    const selected=link.dataset.viewLink===active;
    link.classList.toggle('active',selected);
    if(selected)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  header?.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
  if(menu)menu.textContent='Menu';
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

menu?.addEventListener('click',()=>{
  const open=header.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.textContent=open?'Close':'Menu';
});

window.addEventListener('hashchange',showView);
showView();
document.querySelector('#year').textContent=new Date().getFullYear();
