/* Magic RPG — Battle UI v1 runtime layer
   Presentation-only layer: preserves original battle rules and actions. */
(()=>{
  'use strict';

  const VERSION='1.0.0';
  const APP=document.getElementById('app');
  let queued=false;
  let observer=null;

  const qs=(selector,root=document)=>root.querySelector(selector);
  const qsa=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const visible=node=>{
    if(!node||!node.isConnected)return false;
    const style=getComputedStyle(node);
    if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
    const rect=node.getBoundingClientRect();
    return rect.width>0&&rect.height>0;
  };
  const clean=value=>(value||'').replace(/\s+/g,' ').trim();

  function context(){
    const c2=qs('.c2-shell .c2-battle');
    if(c2)return {chapter:'chapter2',root:c2,shell:c2.closest('.c2-shell'),main:c2.closest('.c2-main')};
    const incident=qs('.inc-shell .inc-battle');
    if(incident)return {chapter:'incident',root:incident,shell:incident.closest('.inc-shell'),main:incident.closest('.inc-main')};
    const c3=qs('.c3-shell .ux6-battle-layout');
    if(c3)return {chapter:'chapter3',root:c3,shell:c3.closest('.c3-shell'),main:c3.closest('.c3-main')};
    const c4=qs('.c4-shell .c4-battle');
    if(c4)return {chapter:'chapter4',root:c4,shell:c4.closest('.c4-shell'),main:c4.closest('.c4-main')};
    return null;
  }

  function selectors(info){
    return ({
      chapter2:{
        objective:'.c2-ritual',checks:'.c2-ritual-grid > div',enemy:'.c2-enemy',intent:'.c2-intent',actors:'.c2-battle-tabs',
        actions:'.c2-actions',action:'.c2-action',panel:'.c2-action-panel',finish:'[data-action="chapter2-battle-action"][data-battle-action="purify"]',
        end:'[data-action="chapter2-end-turn"]',targets:'.c2-root.selectable,.c2-team .target'
      },
      incident:{
        objective:'.inc-ritual',checks:'.inc-ritual-list > div',enemy:'.inc-enemy',intent:'.inc-intent',actors:'.inc-party',
        actions:'.inc-actions',action:'.inc-action',panel:'.inc-actions-wrap',finish:'[data-action="incident-final"]',
        end:'[data-action="incident-end-turn"]',targets:'.inc-link.selectable'
      },
      chapter3:{
        objective:'.c3-objective',checks:'.c3-objective-step,.c3-objective-list > div',enemy:'.c3-arena',intent:'.c3-intent',actors:'.c3-units',
        actions:'.c3-actions',action:'.c3-action',panel:'.c3-actions',finish:'[data-action="c3-battle-action"][data-battle-action="banish"]',
        end:'[data-action="c3-end-turn"]',targets:''
      },
      chapter4:{
        objective:'.c4-objective',checks:'.c4-objective-grid > div',enemy:'.c4-enemy',intent:'.c4-intent',actors:'.c4-team',
        actions:'.c4-actions',action:'.c4-action',panel:'.c4-action-panel',finish:'[data-action="c4-battle-action"][data-value="purify"]',
        end:'[data-action="c4-end-turn"]',targets:''
      }
    })[info.chapter];
  }

  function decorateShell(info){
    document.body.classList.add('battle-ui-v1');
    document.body.dataset.battleChapter=info.chapter;
    document.documentElement.dataset.battleUi=VERSION;
    info.shell.classList.add('battle-shell-v1');
    info.main?.classList.add('battle-main-v1');
    info.root.classList.add('battle-layout-v1');
  }

  function objectiveProgress(info,s){
    const objective=qs(s.objective,info.root);
    if(!objective)return;
    objective.classList.add('battle-objective-card');
    const checks=qsa(s.checks,objective);
    if(!checks.length)return;
    const done=checks.filter(node=>node.classList.contains('done')).length;
    const fail=checks.some(node=>node.classList.contains('fail'));
    let progress=qs(':scope > .battle-objective-progress',objective);
    if(!progress){
      progress=document.createElement('div');
      progress.className='battle-objective-progress';
      objective.appendChild(progress);
    }
    const pct=Math.max(0,Math.min(100,Math.round(done/checks.length*100)));
    progress.classList.toggle('danger',fail);
    progress.innerHTML=`<div><span style="width:${pct}%"></span></div><b>${done}/${checks.length}</b>`;
    checks.forEach(node=>{
      node.classList.add('battle-check');
      node.setAttribute('aria-label',`${node.classList.contains('done')?'Выполнено':node.classList.contains('fail')?'Провалено':'Не выполнено'}: ${clean(node.textContent)}`);
    });
  }

  function nextStepText(info,s){
    if(info.chapter==='chapter2'){
      const p=qs('.c2-ritual p',info.root);
      if(p)return clean(p.textContent).replace(/^Дальше:\s*/i,'');
    }
    const finish=qs(s.finish,info.root);
    if(finish){
      const reason=qs('small,.why',finish)||qs('span',finish);
      if(finish.disabled&&reason)return clean(reason.textContent);
      if(!finish.disabled)return 'Финальное действие готово.';
    }
    if(info.chapter==='incident'){
      const small=qs('.inc-ritual small',info.root);
      const text=clean(small?.textContent);
      const match=text.match(/Финал недоступен:\s*([^.]*(?:\.|$))/i);
      if(match)return clean(match[1]);
    }
    const pending=qsa(s.checks,info.root).find(node=>!node.classList.contains('done')&&!node.classList.contains('fail'));
    return pending?`Следующая цель: ${clean(pending.textContent)}`:'Следуйте ритуальной цели.';
  }

  function renderNextStep(info,s){
    const objective=qs(s.objective,info.root);
    if(!objective)return;
    const text=nextStepText(info,s);
    if(!text)return;
    let node=qs(':scope > .battle-next-step',objective);
    if(!node){
      node=document.createElement('div');
      node.className='battle-next-step';
      objective.appendChild(node);
    }
    const ready=/готово|доступно/i.test(text);
    node.classList.toggle('ready',ready);
    node.innerHTML=`<i>${ready?'✓':'→'}</i><span><b>${ready?'Финал доступен':'Что делать дальше'}</b><small>${text}</small></span>`;
  }

  function markEnemy(info,s){
    qs(s.enemy,info.root)?.classList.add('battle-enemy-card');
    qs(s.intent,info.root)?.classList.add('battle-intent-card');
    const statusSelectors={
      chapter2:'.c2-statuses span',incident:'.inc-stats span',chapter3:'.c3-chip',chapter4:'.c4-statuses span'
    }[info.chapter];
    qsa(statusSelectors,info.root).forEach(node=>node.classList.add('battle-status-chip'));
  }

  function actorNodes(info,s){
    const host=qs(s.actors,info.shell);
    if(!host)return {host:null,nodes:[]};
    const nodes=info.chapter==='chapter2'?qsa('button',host):info.chapter==='chapter4'?qsa('button',host):qsa(':scope > *',host);
    return {host,nodes};
  }

  function actorIsActive(node){
    return node.classList.contains('active')||node.classList.contains('v112-active')||node.getAttribute('aria-selected')==='true';
  }

  function enhanceActors(info,s){
    const {host,nodes}=actorNodes(info,s);
    if(!host||!nodes.length)return;

    if(info.chapter==='chapter2'){
      const panel=qs(s.panel,info.root);
      if(panel&&host.parentElement!==info.root){
        panel.insertAdjacentElement('beforebegin',host);
      }
    }

    host.classList.add('battle-actor-tabs');
    host.setAttribute('role','tablist');
    nodes.forEach((node,index)=>{
      node.classList.add('battle-actor-tab');
      node.setAttribute('role','tab');
      node.setAttribute('aria-selected',actorIsActive(node)?'true':'false');
      if(!node.matches('button,a')&&!node.hasAttribute('tabindex'))node.tabIndex=0;
      if(info.chapter==='chapter3')node.dataset.battleActorIndex=String(index);
    });

    if(info.chapter==='chapter3'){
      const originals=qsa('.c3-battle-tabs .c3-battle-tab',info.shell);
      if(originals.length===nodes.length){
        host.classList.add('battle-actor-ready');
        qs('.c3-battle-tabs',info.shell)?.classList.add('battle-original-tabs-hidden');
      }
    }
  }

  function actionReason(button){
    const reason=qs('small,.why',button);
    if(reason)return clean(reason.textContent);
    if(button.disabled){
      const span=qs('span',button);
      if(span&&/(нужно|сначала|нет |осталось|недоступ|потрач|законч|скрыт|использован)/i.test(span.textContent||''))return clean(span.textContent);
    }
    return '';
  }

  function enhanceActions(info,s){
    const host=qs(s.actions,info.root);
    if(!host)return;
    host.classList.add('battle-actions-grid');
    const finish=qs(s.finish,info.root);
    qsa(s.action,host).forEach(button=>{
      button.classList.add('battle-action-card');
      if(button.disabled)button.setAttribute('aria-disabled','true');else button.removeAttribute('aria-disabled');
      const reason=actionReason(button);
      if(reason&&button.disabled)button.title=reason;else button.removeAttribute('title');
      if(button===finish)button.classList.add('battle-finish-action');
      const badge=qs('em',button);badge?.classList.add('battle-cost-badge');
    });
    qs(s.panel,info.root)?.classList.add('battle-action-panel');
  }

  function targetPrompt(info,s){
    qsa('.battle-target-prompt',info.root).forEach(node=>node.remove());
    if(!s.targets)return;
    const targets=qsa(s.targets,info.root).filter(visible);
    if(!targets.length)return;
    targets.forEach(node=>node.classList.add('battle-selectable-target'));
    const text=info.chapter==='chapter2'
      ?(targets.some(node=>node.classList.contains('c2-root'))?'Выберите Корневую Связь. Действие потратится после выбора.':'Выберите цель для Щита.')
      :'Выберите раскрытую Связь для Телекинеза.';
    const prompt=document.createElement('div');
    prompt.className='battle-target-prompt';
    prompt.innerHTML=`<i>◎</i><span><b>Выбор цели</b><small>${text}</small></span>`;
    const anchor=info.chapter==='chapter2'?qs('.c2-team,.c2-enemy',info.root):qs('.inc-enemy',info.root);
    anchor?.insertAdjacentElement('beforebegin',prompt);
  }

  function markFooter(info,s){
    const end=qs(s.end,info.shell);
    if(end){
      end.classList.add('battle-end-turn');
      if(!end.getAttribute('aria-label'))end.setAttribute('aria-label',clean(end.textContent));
    }
    const footer=qs('.c2-footer,.inc-footer,.c3-footer,.c4-footer',info.shell);
    footer?.classList.add('battle-footer-v1');
  }

  function accessibility(info,s){
    qsa('button,[role="button"]',info.root).forEach(node=>{
      if(!node.hasAttribute('type')&&node.tagName==='BUTTON')node.setAttribute('type','button');
      if(node.disabled)node.setAttribute('aria-disabled','true');
    });
  }

  function cleanup(){
    document.body.classList.remove('battle-ui-v1');
    delete document.body.dataset.battleChapter;
  }

  function apply(){
    queued=false;
    const info=context();
    if(!info){cleanup();return;}
    const s=selectors(info);
    decorateShell(info);
    objectiveProgress(info,s);
    renderNextStep(info,s);
    markEnemy(info,s);
    enhanceActors(info,s);
    enhanceActions(info,s);
    targetPrompt(info,s);
    markFooter(info,s);
    accessibility(info,s);
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>requestAnimationFrame(apply));
  }

  document.addEventListener('click',event=>{
    const unit=event.target.closest?.('.c3-unit[data-battle-actor-index]');
    if(unit&&!unit.dataset.v112C3Tab){
      const tabs=qsa('.c3-battle-tabs .c3-battle-tab',unit.closest('.c3-shell'));
      tabs[Number(unit.dataset.battleActorIndex)]?.click();
    }
    if(event.target.closest?.('.battle-action-card,.battle-actor-tab,.battle-end-turn,.battle-selectable-target'))setTimeout(schedule,0);
  },false);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const target=event.target.closest?.('.battle-actor-tab:not(button):not(a),.battle-selectable-target[role="button"]:not(button)');
    if(!target)return;
    event.preventDefault();
    target.click();
  });

  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>{schedule();setTimeout(schedule,220);},{passive:true});
  addEventListener('DOMContentLoaded',()=>{
    apply();
    if(APP){
      observer=new MutationObserver(schedule);
      observer.observe(APP,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled','aria-disabled']});
    }
    setTimeout(apply,180);
    setTimeout(apply,600);
    console.info(`Magic RPG Battle UI ${VERSION} active`);
  });
})();
