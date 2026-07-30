/* Magic RPG mobile layout & touch safety v1.1 */
(()=>{
  'use strict';
  const VERSION='1.1.0';
  const ROOT=document.documentElement;
  const DECORATIVE_SELECTOR=[
    '.vp-art','.vp-art-v2','.vp-dust','.vp-start-art','.vp-start-runes','.vp-morwen-mark',
    '.c2-vines','.c2-flower','.c2-cat','.c3-liora','.c3-cat','.c3-sigil','.c4-celeste','.cat',
    '.ux-danger-person','.ux6-training-sign','.ux6-training-child','.ux6-training-beacon','.ux6-shield-ring'
  ].join(',');
  let scheduled=false;

  const px=value=>`${Math.max(0,Math.round(value||0))}px`;
  const visible=node=>{
    if(!node||!node.isConnected)return false;
    const style=getComputedStyle(node);
    if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
    const rect=node.getBoundingClientRect();
    return rect.width>0&&rect.height>0;
  };

  function viewportHeight(){
    const vv=window.visualViewport;
    const height=vv&&vv.height>0?vv.height:window.innerHeight;
    return Math.max(320,height||document.documentElement.clientHeight||320);
  }

  function updateViewport(){
    const height=viewportHeight();
    ROOT.style.setProperty('--mobile-app-height',px(height));
    ROOT.style.setProperty('--app-height',px(height));
    const keyboard=Math.max(0,(window.innerHeight||height)-height-(window.visualViewport?.offsetTop||0));
    ROOT.style.setProperty('--mobile-keyboard-offset',px(keyboard));
  }

  function activeShell(){
    return [...document.querySelectorAll('.c2-shell,.c3-shell,.c4-shell,.inc-shell,.game-shell')].find(visible)||null;
  }

  function updateChromeMetrics(){
    const shell=activeShell();
    if(!shell)return;
    const top=shell.querySelector(':scope > .c2-top,:scope > .c3-top,:scope > .c4-top,:scope > .inc-top,:scope > .topbar')||document.querySelector('.topbar');
    const footer=shell.querySelector(':scope > .c2-footer,:scope > .c3-footer,:scope > .c4-footer,:scope > .inc-footer')||document.querySelector('.bottom-nav');
    const nav=document.querySelector('.bottom-nav');
    if(top&&visible(top))ROOT.style.setProperty('--mobile-top-size',px(top.getBoundingClientRect().height));
    if(footer&&visible(footer))ROOT.style.setProperty('--mobile-footer-size',px(footer.getBoundingClientRect().height));
    else ROOT.style.setProperty('--mobile-footer-size','0px');
    if(nav&&visible(nav))ROOT.style.setProperty('--mobile-nav-size',px(nav.getBoundingClientRect().height));
  }

  function disableDecorativeHitboxes(scope=document){
    scope.querySelectorAll?.(DECORATIVE_SELECTOR).forEach(node=>{
      if(node.dataset.mobileDecoration==='1'&&node.style.getPropertyValue('pointer-events')==='none'&&node.style.getPropertyPriority('pointer-events')==='important')return;
      node.style.setProperty('pointer-events','none','important');
      node.dataset.mobileDecoration='1';
    });
  }

  function c2HomeKey(text){
    const value=(text||'').toLowerCase();
    if(value.includes('цвет')||value.includes('венок'))return 'wreath';
    if(value.includes('ника')||value.includes('сообщен')||value.includes('телефон'))return 'phone';
    if(value.includes('двер'))return 'door';
    return null;
  }

  function enhanceC2Checklist(scope=document){
    scope.querySelectorAll?.('.c2-story .c2-check').forEach(check=>{
      const key=c2HomeKey(check.textContent);
      if(!key)return;
      const done=check.classList.contains('done');
      if(check.dataset.mobileHomeKey!==key)check.dataset.mobileHomeKey=key;
      if(check.getAttribute('role')!=='button')check.setAttribute('role','button');
      const tab=done?'-1':'0';
      if(check.getAttribute('tabindex')!==tab)check.setAttribute('tabindex',tab);
      const disabled=done?'true':'false';
      if(check.getAttribute('aria-disabled')!==disabled)check.setAttribute('aria-disabled',disabled);
    });
  }

  function originalHomeAction(key){
    return document.querySelector(`[data-action="chapter2-home-point"][data-key="${CSS.escape(key)}"]`);
  }

  function triggerChecklist(check){
    if(!check||check.classList.contains('done'))return;
    const button=originalHomeAction(check.dataset.mobileHomeKey);
    if(button){button.click();return;}
    const fallback=document.querySelector('[data-hotfix-c2-required]');
    fallback?.click();
  }

  function knownDecoration(node){
    return node?.closest?.(DECORATIVE_SELECTOR)||null;
  }

  function repairCoveredActions(){
    const actions=[...document.querySelectorAll('button:not([disabled]),[role="button"][data-action]:not([aria-disabled="true"]),.c2-hotspot,.ux-hotspot,.ux6-hotspot')];
    const viewport=viewportHeight();
    actions.forEach(action=>{
      if(!visible(action))return;
      const r=action.getBoundingClientRect();
      if(r.bottom<0||r.top>viewport||r.right<0||r.left>window.innerWidth)return;
      const x=Math.min(window.innerWidth-1,Math.max(0,r.left+r.width/2));
      const y=Math.min(viewport-1,Math.max(0,r.top+r.height/2));
      const stack=document.elementsFromPoint(x,y);
      if(stack.some(node=>node===action||action.contains(node)))return;
      const blocker=stack.map(knownDecoration).find(Boolean);
      if(blocker){
        if(blocker.dataset.mobileHitboxRepaired!=='1'){
          blocker.style.setProperty('pointer-events','none','important');
          blocker.dataset.mobileHitboxRepaired='1';
        }
      }
    });
  }

  function scrollFocusedControl(target){
    const scroller=target.closest('.c2-main,.c3-main,.c4-main,.inc-main,.modal-body,#screen-content > .screen,.game-shell > .screen');
    if(!scroller)return;
    requestAnimationFrame(()=>{
      const rect=target.getBoundingClientRect();
      const topSize=parseFloat(getComputedStyle(ROOT).getPropertyValue('--mobile-top-size'))||0;
      const footerSize=parseFloat(getComputedStyle(ROOT).getPropertyValue('--mobile-footer-size'))||0;
      const navSize=parseFloat(getComputedStyle(ROOT).getPropertyValue('--mobile-nav-size'))||0;
      const lower=viewportHeight()-Math.max(footerSize,navSize)-12;
      if(rect.top<topSize+8||rect.bottom>lower){
        target.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});
      }
    });
  }

  function apply(){
    scheduled=false;
    updateViewport();
    disableDecorativeHitboxes();
    enhanceC2Checklist();
    updateChromeMetrics();
    repairCoveredActions();
    if(document.body&&!document.body.classList.contains('mobile-layout-v11'))document.body.classList.add('mobile-layout-v11');
    if(ROOT.dataset.mobileLayout!==VERSION)ROOT.dataset.mobileLayout=VERSION;
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(apply);
  }

  document.addEventListener('click',event=>{
    const check=event.target.closest?.('.c2-check[data-mobile-home-key]');
    if(!check)return;
    event.preventDefault();
    event.stopPropagation();
    triggerChecklist(check);
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const check=event.target.closest?.('.c2-check[data-mobile-home-key]');
    if(!check)return;
    event.preventDefault();
    triggerChecklist(check);
  });

  document.addEventListener('focusin',event=>{
    if(event.target?.matches?.('button,input,select,textarea,[role="button"]'))scrollFocusedControl(event.target);
  });

  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>{schedule();setTimeout(schedule,180);setTimeout(schedule,520);},{passive:true});
  addEventListener('pageshow',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule,{passive:true});
  window.visualViewport?.addEventListener('scroll',schedule,{passive:true});

  addEventListener('DOMContentLoaded',()=>{
    apply();
    const app=document.getElementById('app');
    const modal=document.getElementById('modal-root');
    const observer=new MutationObserver(schedule);
    if(app)observer.observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled','aria-disabled']});
    if(modal)observer.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    setTimeout(apply,120);
    setTimeout(apply,600);
    console.info(`Magic RPG mobile layout ${VERSION} active`);
  });
})();
