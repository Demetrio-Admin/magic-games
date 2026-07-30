/* Magic RPG — Core Screens v1 runtime helpers */
(()=>{
  'use strict';
  const VERSION='1.0.0';
  let queued=false;

  const visible=node=>{
    if(!node||!node.isConnected)return false;
    const style=getComputedStyle(node);
    if(style.display==='none'||style.visibility==='hidden')return false;
    const rect=node.getBoundingClientRect();
    return rect.width>0&&rect.height>0;
  };

  function screenName(){
    const root=document.querySelector('#screen-content > .screen,.game-shell > .screen');
    if(!root)return 'unknown';
    if(root.querySelector('.home-scene'))return 'home';
    if(root.querySelector('.case-card'))return 'cases';
    if(root.querySelector('.inventory-grid'))return 'inventory';
    if(root.querySelector('.companion-list,.party-strip'))return 'companions';
    if(root.querySelector('.timeline,.chapter-row'))return 'journal';
    if(root.querySelector('.recipe-card'))return 'laboratory';
    if(root.querySelector('.codex-list,.codex-card'))return 'codex';
    if(root.querySelector('.spell-grid,.hero-panel'))return 'hero';
    return 'other';
  }

  function labelInteractiveCards(scope=document){
    scope.querySelectorAll?.('.quick-card,.room-card,.item-card,.companion-card,.party-slot').forEach(card=>{
      if(card.matches('button,a,[role="button"]'))return;
      if(card.dataset.action){
        card.setAttribute('role','button');
        if(!card.hasAttribute('tabindex'))card.tabIndex=0;
      }
    });
  }

  function markPrimaryQuest(scope=document){
    const cards=[...scope.querySelectorAll?.('.quest-card,.case-card')||[]];
    cards.forEach(card=>{
      const text=(card.textContent||'').toLowerCase();
      const primary=text.includes('главная история')||text.includes('текущая глава')||text.includes('в процессе');
      card.classList.toggle('core-primary-quest',primary);
    });
  }

  function keepLastActionReachable(){
    const scroll=document.querySelector('#screen-content > .screen,.game-shell > .screen');
    if(!visible(scroll))return;
    const last=[...scroll.querySelectorAll('button:not([disabled]),[role="button"]:not([aria-disabled="true"])')].filter(visible).at(-1);
    if(!last)return;
    const nav=document.querySelector('.bottom-nav');
    const navHeight=visible(nav)?nav.getBoundingClientRect().height:0;
    scroll.style.setProperty('scroll-padding-bottom',`${Math.ceil(navHeight+24)}px`);
  }

  function apply(){
    queued=false;
    document.body?.classList.add('core-screens-v1');
    document.documentElement.dataset.coreScreens=VERSION;
    document.body.dataset.coreScreen=screenName();
    labelInteractiveCards();
    markPrimaryQuest();
    keepLastActionReachable();
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(apply);
  }

  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const card=event.target.closest?.('[role="button"][data-action]:not(button):not(a)');
    if(!card)return;
    event.preventDefault();
    card.click();
  });

  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  addEventListener('DOMContentLoaded',()=>{
    apply();
    const app=document.getElementById('app');
    if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
    setTimeout(apply,160);
    console.info(`Magic RPG Core Screens ${VERSION} active`);
  });
})();
