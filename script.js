const views=[...document.querySelectorAll('[data-view-panel]')];
const navLinks=[...document.querySelectorAll('[data-view-link]')];
const validViews=new Set(['about',...views.map(view=>view.dataset.viewPanel)]);

function showView(){
  const requested=location.hash.slice(1);
  const active=validViews.has(requested)?requested:'about';
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
