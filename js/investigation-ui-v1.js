/* Magic RPG — Investigation UI v1 runtime layer */
(()=>{
  'use strict';

  const VERSION='1.0.0';
  const APP=document.getElementById('app');
  const FLOW_CLASS='investigation-flow';
  let queued=false;
  let autoScroll=false;
  let observer=null;

  const POINT_NAMES={
    witness:'Спящая свидетельница', photo:'Семейная фотография', ledger:'Журнал поставок',
    ingredients:'Редкая полка', resident:'Жилец у клумбы', grate:'Металлическая решётка',
    roots:'Боковой побег', technician:'Техник Ордена', sigil:'Обгоревшая печать',
    courier:'Напуганный курьер', protocol:'Протокол маяка', closed_case:'Закрытое дело №17',
    maintenance:'Карта обслуживания', tear:'Нестабильный разрыв', vantage:'Точка наблюдения',
    cache:'Тайник оперативника', wreath:'Цветы из венка', phone:'Сообщение Ники', door:'Запертая дверь', photo_home:'Фотография'
  };

  const qs=(selector,root=document)=>root.querySelector(selector);
  const qsa=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const visible=node=>{
    if(!node||!node.isConnected)return false;
    const style=getComputedStyle(node);
    if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
    const rect=node.getBoundingClientRect();
    return rect.width>0&&rect.height>0;
  };
  const normalize=value=>(value||'').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  const titleCase=value=>normalize(value).replace(/(^|\s)\S/g,s=>s.toUpperCase());

  function context(){
    const c2Invest=qs('.c2-shell .ux-investigation');
    if(c2Invest)return {chapter:'chapter2',stage:'investigation',root:c2Invest,shell:c2Invest.closest('.c2-shell'),host:c2Invest};
    const c2Deduction=qs('.c2-shell .ux-deduction');
    if(c2Deduction)return {chapter:'chapter2',stage:'deduction',root:c2Deduction,shell:c2Deduction.closest('.c2-shell'),host:c2Deduction};

    const c3Deduction=qs('.c3-shell .ux6-deduction,.c3-shell .ux6-deduction-head');
    if(c3Deduction){
      const shell=c3Deduction.closest('.c3-shell');
      return {chapter:'chapter3',stage:'deduction',root:qs('.ux6-deduction',shell)||c3Deduction,shell,host:qs('.c3-main',shell)};
    }
    const c3Invest=qs('.c3-shell .ux6-scene');
    if(c3Invest){
      const shell=c3Invest.closest('.c3-shell');
      return {chapter:'chapter3',stage:'investigation',root:c3Invest,shell,host:qs('.c3-main',shell)};
    }

    const c4Invest=qs('.c4-shell .c4-invest');
    if(c4Invest)return {chapter:'chapter4',stage:'investigation',root:c4Invest,shell:c4Invest.closest('.c4-shell'),host:c4Invest};
    const c4Deduction=qs('.c4-shell .c4-deduction');
    if(c4Deduction)return {chapter:'chapter4',stage:'deduction',root:c4Deduction,shell:c4Deduction.closest('.c4-shell'),host:c4Deduction};
    return null;
  }

  function countEvidence(info){
    const selectors=info.chapter==='chapter2'?'.ux-evidence-chip':info.chapter==='chapter3'?'.ux6-evidence-chip':'.c4-evidence-chip';
    return qsa(selectors,info.shell).filter(node=>!/(улик пока нет|нет улик)/i.test(node.textContent||'')).length;
  }

  function selectedObject(info){
    return qs('.ux-hotspot.selected,.ux6-hotspot.selected,.c4-point.selected',info.shell);
  }

  function selectedHypothesis(info){
    return qs('.ux-hypothesis.selected,.ux6-hypothesis.selected,.c4-deduction .c4-choice.active',info.shell);
  }

  function stepsFor(info){
    if(info.stage==='deduction'){
      const evidence=countEvidence(info)>0;
      const hypothesis=!!selectedHypothesis(info);
      return [
        {label:'Улики',done:evidence,active:!hypothesis},
        {label:'Гипотеза',done:hypothesis,active:!hypothesis},
        {label:'Подтверждение',done:false,active:hypothesis}
      ];
    }
    const selected=!!selectedObject(info)||!!qs('.ux-point-copy,.ux6-point-panel,.c4-methods',info.shell);
    const methods=!!qs('.ux-method,.ux6-method,.c4-method',info.shell);
    const evidence=countEvidence(info)>0;
    return [
      {label:'Локация',done:true,active:false},
      {label:'Объект',done:selected||evidence,active:!selected},
      {label:'Метод',done:evidence,active:selected&&methods},
      {label:'Улика',done:evidence,active:false}
    ];
  }

  function flowHost(info){
    if(info.chapter==='chapter3')return qs('.c3-main',info.shell);
    if(info.chapter==='chapter2')return info.root;
    if(info.chapter==='chapter4')return info.root;
    return info.host;
  }

  function renderFlow(info){
    const host=flowHost(info);
    if(!host)return;
    let flow=qs(`:scope > .${FLOW_CLASS}`,host);
    if(!flow){
      flow=document.createElement('div');
      flow.className=FLOW_CLASS;
      flow.setAttribute('aria-label',info.stage==='deduction'?'Этапы вывода':'Этапы расследования');
      host.prepend(flow);
    }
    const steps=stepsFor(info);
    flow.style.setProperty('--inv-step-count',String(steps.length));
    const html=steps.map((step,index)=>`<div class="investigation-flow-step ${step.done?'done':''} ${step.active?'active':''}"><i>${step.done?'✓':index+1}</i><span>${step.label}</span></div>`).join('');
    if(flow.innerHTML!==html)flow.innerHTML=html;
  }

  function hotspotLabel(hotspot,index){
    const id=hotspot.dataset.point||hotspot.dataset.key||hotspot.dataset.target||hotspot.dataset.location;
    const explicit=hotspot.getAttribute('aria-label')||hotspot.getAttribute('title')||hotspot.dataset.name||hotspot.dataset.title;
    if(explicit)return explicit.trim();
    if(id&&POINT_NAMES[id])return POINT_NAMES[id];
    if(id)return titleCase(id);
    const text=(hotspot.textContent||'').trim();
    return text&&!/^[✓+○◇▣▤⌁✦◌◉人♣]$/.test(text)?text:`Объект ${index+1}`;
  }

  function stripScene(info){
    if(info.stage!=='investigation'||info.chapter==='chapter4')return;
    const scene=qs(info.chapter==='chapter2'?'.ux-scene':'.ux6-scene',info.shell);
    if(!scene)return;
    const hotspots=qsa(info.chapter==='chapter2'?'.ux-hotspot':'.ux6-hotspot',scene);
    if(!hotspots.length)return;

    let strip=scene.nextElementSibling;
    if(!strip||!strip.classList.contains('investigation-object-strip')){
      strip=document.createElement('div');
      strip.className='investigation-object-strip';
      strip.setAttribute('aria-label','Объекты на сцене');
      scene.insertAdjacentElement('afterend',strip);
    }

    const signature=hotspots.map((hotspot,index)=>[
      hotspot.dataset.point||index,hotspotLabel(hotspot,index),hotspot.textContent||'',
      hotspot.classList.contains('selected')?'selected':'',hotspot.classList.contains('done')?'done':'',hotspot.disabled?'disabled':''
    ].join(':')).join('|');
    if(strip.dataset.signature===signature)return;
    strip.dataset.signature=signature;
    strip.innerHTML='';
    hotspots.forEach((hotspot,index)=>{
      const label=hotspotLabel(hotspot,index);
      if(hotspot.getAttribute('aria-label')!==label)hotspot.setAttribute('aria-label',label);
      if(!hotspot.hasAttribute('type'))hotspot.setAttribute('type','button');
      const button=document.createElement('button');
      button.type='button';
      button.className=`investigation-object-button ${hotspot.classList.contains('selected')?'selected':''} ${hotspot.classList.contains('done')?'done':''}`;
      button.disabled=hotspot.disabled&&hotspot.classList.contains('done');
      button.dataset.investigationObject=hotspot.dataset.point||String(index);
      button.innerHTML=`<i>${hotspot.classList.contains('done')?'✓':(hotspot.textContent||index+1)}</i><span><b>${label}</b><small>${hotspot.classList.contains('done')?'Изучено':'Нажмите, чтобы выбрать'}</small></span>`;
      button.addEventListener('click',()=>{
        if(hotspot.disabled&&!hotspot.classList.contains('done'))return;
        hotspot.click();
        autoScroll=true;
      });
      strip.appendChild(button);
    });
  }

  function markDoneMethods(info){
    const methods=qsa('.ux-method,.ux6-method,.c4-method',info.shell);
    methods.forEach(method=>{
      const text=(method.textContent||'').toLowerCase();
      const done=method.disabled&&/(завершено|уже получена|готово|✓)/.test(text);
      const value=done?'true':'false';if(method.dataset.investigationDone!==value)method.dataset.investigationDone=value;
      if(!method.hasAttribute('type'))method.setAttribute('type','button');
    });
  }

  function enhanceChapter4Points(info){
    if(info.chapter!=='chapter4'||info.stage!=='investigation')return;
    qsa('.c4-point',info.shell).forEach(point=>{
      if(!point.hasAttribute('type'))point.setAttribute('type','button');
      if(!point.getAttribute('aria-label')){
        const label=qs('b',point)?.textContent?.trim()||'Объект расследования';
        point.setAttribute('aria-label',label);
      }
    });
  }

  function addHint(info){
    if(info.stage!=='investigation')return;
    const target=info.chapter==='chapter2'?qs('.ux-invest-panel',info.shell):info.chapter==='chapter3'?qs('.ux6-stage-card,.ux6-point-panel',info.shell):qs('.c4-point-list',info.shell);
    const existing=qs('.investigation-mobile-hint',info.shell);
    if(selectedObject(info)){existing?.remove();return;}
    if(!target||existing)return;
    const hint=document.createElement('div');
    hint.className='investigation-mobile-hint';
    hint.innerHTML='<span>✦</span><span><b>Выберите объект.</b> Можно нажать на точку в сцене или на большую кнопку под ней.</span>';
    target.insertAdjacentElement('beforebegin',hint);
  }

  function scrollToPanel(info){
    if(!autoScroll)return;
    autoScroll=false;
    const panel=info.chapter==='chapter2'?qs('.ux-invest-panel',info.shell):info.chapter==='chapter3'?qs('.ux6-point-panel',info.shell):qs('.c4-methods',info.shell);
    if(!panel||!visible(panel))return;
    requestAnimationFrame(()=>panel.scrollIntoView({block:'nearest',behavior:'smooth'}));
  }

  function cleanupInactive(){
    document.body.classList.remove('investigation-stage-investigation','investigation-stage-deduction');
    delete document.body.dataset.investigationChapter;
  }

  function apply(){
    queued=false;
    const info=context();
    document.body.classList.add('investigation-ui-v1');
    document.documentElement.dataset.investigationUi=VERSION;
    cleanupInactive();
    if(!info)return;
    document.body.classList.add(`investigation-stage-${info.stage}`);
    document.body.dataset.investigationChapter=info.chapter;
    renderFlow(info);
    stripScene(info);
    markDoneMethods(info);
    enhanceChapter4Points(info);
    addHint(info);
    scrollToPanel(info);
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(apply);
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('.ux-hotspot,.ux6-hotspot,.c4-point,.ux-method,.ux6-method,.c4-method,.ux-hypothesis,.ux6-hypothesis,.c4-deduction .c4-choice');
    if(trigger){autoScroll=trigger.matches('.ux-hotspot,.ux6-hotspot,.c4-point');setTimeout(schedule,0);}
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const target=event.target.closest?.('.investigation-object-button,[role="button"][data-action]:not(button)');
    if(!target)return;
    event.preventDefault();
    target.click();
  });

  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  addEventListener('DOMContentLoaded',()=>{
    apply();
    if(APP){observer=new MutationObserver(schedule);observer.observe(APP,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled']});}
    setTimeout(apply,180);
    console.info(`Magic RPG Investigation UI ${VERSION} active`);
  });
})();
