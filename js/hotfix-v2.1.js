/* Magic RPG unified runtime hotfix v2.1
   Fixes mobile blockers, stale PWA cache, Chapter 4 dose exploit, unsafe reset/reward loops,
   and old/corrupted save states without editing the large monolithic app.js. */
(()=>{
  'use strict';
  const HOTFIX_VERSION='2.1.1';
  const ACTIONS_THAT_COMPLETE_C3=new Set(['c3-finish','debug-complete-chapter3']);
  const ACTIONS_THAT_COMPLETE_C4=new Set(['c4-finish','debug-complete-chapter4']);
  const ACTIONS_THAT_RESET_C3=new Set(['debug-reset-chapter3','ux6-reset-c3']);
  const ACTIONS_THAT_RESET_C4=new Set(['debug-reset-chapter4']);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const clone=obj=>obj?JSON.parse(JSON.stringify(obj)):obj;

  function toast(message){
    const root=document.getElementById('toast-root');
    if(root){
      const node=document.createElement('div');
      node.className='toast show hotfix-toast';
      node.textContent=message;
      root.appendChild(node);
      setTimeout(()=>node.remove(),2800);
      return;
    }
    console.info('[Magic RPG hotfix]',message);
  }

  function findSaveKey(){
    let best=null;
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key)continue;
      try{
        const value=JSON.parse(localStorage.getItem(key)||'null');
        if(value&&value.profile&&value.progression&&(value.chapter2||value.chapter3||value.chapter4)){
          best=key;
          if(/magic|rpg|save/i.test(key))return key;
        }
      }catch(_){/* ignore non-json */}
    }
    return best;
  }
  function loadSave(){
    const key=findSaveKey();
    if(!key)return null;
    try{return {key,save:JSON.parse(localStorage.getItem(key)||'null')};}catch(_){return null;}
  }
  function storeSave(key,save){
    try{
      save.updatedAt=new Date().toISOString();
      if(save.progression&&typeof window.currentScreen==='string')save.progression.currentScreen=window.currentScreen;
      localStorage.setItem(key,JSON.stringify(save));
      return true;
    }catch(err){console.warn('hotfix store failed',err);return false;}
  }
  function patchSave(mutator){
    const pack=loadSave();
    if(!pack)return false;
    const {key,save}=pack;
    const result=mutator(save,key);
    if(result===false)return false;
    return storeSave(key,save);
  }

  function getChapterStatus(save,id){return save?.progression?.chapters?.[id]?.status;}
  function ensureHotfixState(save){
    save.hotfix ||= {};
    save.hotfix.version=HOTFIX_VERSION;
    save.story ||= {flags:{},decisions:{}};
    save.story.flags ||= {};
    save.story.decisions ||= {};
    save.progression ||= {chapters:{}};
    save.progression.chapters ||= {};
    save.profile ||= {};
    save.currencies ||= {coins:0};
    save.reputations ||= {};
    save.reputations.order ||= {value:0,label:'Неизвестны Ордену'};
    save.inventory ||= {items:{}};
    save.inventory.items ||= {};
    save.recipes ||= {known:[],mastery:{}};
    save.recipes.known ||= [];
    save.recipes.mastery ||= {};
    save.relationships ||= {};
    save.companions ||= {owned:[],states:{},activeParty:['morven',null]};
    save.companions.owned ||= [];
    save.companions.states ||= {};
    save.companions.activeParty ||= ['morven',null];

    if(getChapterStatus(save,'chapter_03_first_light')==='completed'||save.story.flags['chapter_03.complete']){
      save.hotfix.c3RewardsClaimed=true;
    }
    if(getChapterStatus(save,'chapter_04_bitter_recipe')==='completed'||save.story.flags['chapter_04.complete']){
      save.hotfix.c4RewardsClaimed=true;
    }

    // Repair old or imported saves that point to late Chapter 4 stages without required choices.
    const c4=save.chapter4;
    if(c4){
      c4.investigation ||= {location:'warehouse',time:7,selectedPoint:null,used:{},evidence:{},freeSearch:true};
      c4.alchemy ||= {order:[],temp:null,charge:null,quality:null,score:0};
      const lateFormulaStages=new Set(['formula','alchemy','brief','battle','choice','final']);
      if(lateFormulaStages.has(c4.stage)&&!c4.diagnosis)c4.stage='deduction';
      if(['alchemy','brief','battle','choice','final'].includes(c4.stage)&&!c4.recipeChoice)c4.stage='formula';
      if(['brief','battle','choice','final'].includes(c4.stage)&&!c4.alchemy.quality)c4.stage='alchemy';
      if(c4.stage==='battle'&&c4.battle){
        c4.battle.potionCharges=Math.max(1,Number(c4.battle.potionCharges||1));
        c4.battle.heroActions=Number.isFinite(Number(c4.battle.heroActions))?Number(c4.battle.heroActions):2;
        c4.battle.enemy ||= {pokrov:3,coreRevealed:false,seal:0,hunger:3};
        c4.battle.patients ||= {hp:3,max:3,shield:0};
        c4.battle.lab ||= {hp:3,max:3,shield:0};
      }
    }
  }

  function captureSnapshot(save){
    return clone({
      currencies:save.currencies,
      profile:save.profile,
      reputations:save.reputations,
      orderDecision:save.story?.decisions,
      orderFlags:save.story?.flags,
      liora:save.relationships?.liora,
      celeste:save.relationships?.celeste,
      companions:save.companions,
      inventory:save.inventory,
      recipes:save.recipes,
      codex:save.codex,
      chapter4:save.chapter4,
      chapter4Progress:save.progression?.chapters?.chapter_04_bitter_recipe,
      chapter5Progress:save.progression?.chapters?.chapter_05_city_under_skin
    });
  }
  function restoreNoEconomyDuplicate(save,before){
    if(!before)return;
    save.currencies=clone(before.currencies)||save.currencies;
    save.profile=clone(before.profile)||save.profile;
    save.reputations=clone(before.reputations)||save.reputations;
  }
  function preserveLaterChapterAfterC3Reset(save,before){
    if(!before?.chapter4)return;
    const c4Completed=before.chapter4Progress?.status==='completed'||before.orderFlags?.['chapter_04.complete'];
    if(!c4Completed)return;
    save.chapter4=clone(before.chapter4);
    save.progression.chapters.chapter_04_bitter_recipe=clone(before.chapter4Progress);
    save.progression.chapters.chapter_05_city_under_skin=clone(before.chapter5Progress)||save.progression.chapters.chapter_05_city_under_skin;
    save.relationships.celeste=clone(before.celeste);
    save.companions=clone(before.companions);
    save.inventory=clone(before.inventory);
    save.recipes=clone(before.recipes);
    save.codex=clone(before.codex);
    save.reputations=clone(before.reputations);
    save.story.flags={...(save.story.flags||{}),...(before.orderFlags||{})};
    save.story.decisions={...(save.story.decisions||{}),...(before.orderDecision||{})};
    save.hotfix.c4RewardsClaimed=true;
  }

  function bootSaveRepair(){
    patchSave(save=>{ensureHotfixState(save);});
  }

  function getCurrentBattleSave(){const pack=loadSave();return pack&&pack.save;}

  function handleC4DoseBefore(event,button){
    if(button.dataset.action!=='c4-battle-action'||button.dataset.value!=='dose')return false;
    const pack=loadSave();
    const b=pack?.save?.chapter4?.battle;
    if(!b||pack.save?.chapter4?.stage!=='battle')return false;
    const charges=Number(b.potionCharges||0);
    if(charges<=1){
      event.preventDefault();event.stopImmediatePropagation();
      toast('Последнюю дозу лучше оставить для финального Очищения. Формулу Селесты можно применять, когда доз больше одной.');
      return true;
    }
    button.__hotfixDoseBefore=charges;
    return false;
  }

  async function handleC4DoseAfter(button){
    if(button.dataset.action!=='c4-battle-action'||button.dataset.value!=='dose')return;
    const before=Number(button.__hotfixDoseBefore||0);
    if(before<=1)return;
    await wait(90);
    let changed=false;
    patchSave(save=>{
      const b=save.chapter4?.battle;
      if(!b||save.chapter4?.stage!=='battle')return false;
      const now=Number(b.potionCharges||0);
      if(now>=before){
        b.potionCharges=Math.max(1,before-1);
        b.log=Array.isArray(b.log)?b.log:[];
        b.log.push('Доза формулы израсходована. Последняя доза сохранена для Очищения.');
        changed=true;
      }
    });
    if(changed){
      toast('Формула Селесты потратила 1 дозу.');
      setTimeout(()=>location.reload(),150);
    }
  }

  function bindRuntimeGuards(){
    let beforeCompleteC3=null,beforeCompleteC4=null,beforeResetC3=null,beforeResetC4=null;
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-action]');
      if(!button)return;
      const action=button.dataset.action;
      if(handleC4DoseBefore(event,button))return;
      const pack=loadSave();
      const save=pack?.save;
      if(!save)return;
      ensureHotfixState(save);
      if(ACTIONS_THAT_COMPLETE_C3.has(action))beforeCompleteC3=captureSnapshot(save);
      if(ACTIONS_THAT_COMPLETE_C4.has(action))beforeCompleteC4=captureSnapshot(save);
      if(ACTIONS_THAT_RESET_C3.has(action))beforeResetC3=captureSnapshot(save);
      if(ACTIONS_THAT_RESET_C4.has(action))beforeResetC4=captureSnapshot(save);
    },true);

    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-action]');
      if(!button)return;
      const action=button.dataset.action;
      handleC4DoseAfter(button);
      if(ACTIONS_THAT_COMPLETE_C3.has(action)){
        setTimeout(()=>patchSave(save=>{
          ensureHotfixState(save);
          if(beforeCompleteC3?.orderFlags?.['hotfix.c3_rewards_claimed']||beforeCompleteC3?.chapter4Progress?.status==='completed'||beforeCompleteC3?.orderFlags?.['chapter_03.complete']) restoreNoEconomyDuplicate(save,beforeCompleteC3);
          save.hotfix.c3RewardsClaimed=true;save.story.flags['hotfix.c3_rewards_claimed']=true;
        }),120);
      }
      if(ACTIONS_THAT_COMPLETE_C4.has(action)){
        setTimeout(()=>patchSave(save=>{
          ensureHotfixState(save);
          if(beforeCompleteC4?.orderFlags?.['hotfix.c4_rewards_claimed']||beforeCompleteC4?.orderFlags?.['chapter_04.complete']) restoreNoEconomyDuplicate(save,beforeCompleteC4);
          save.hotfix.c4RewardsClaimed=true;save.story.flags['hotfix.c4_rewards_claimed']=true;
        }),120);
      }
      if(ACTIONS_THAT_RESET_C3.has(action)){
        setTimeout(()=>patchSave(save=>{ensureHotfixState(save);preserveLaterChapterAfterC3Reset(save,beforeResetC3);}),160);
      }
      if(ACTIONS_THAT_RESET_C4.has(action)){
        setTimeout(()=>patchSave(save=>{ensureHotfixState(save);save.story.flags['hotfix.c4_rewards_claimed']=!!beforeResetC4?.orderFlags?.['hotfix.c4_rewards_claimed'];}),160);
      }
    },false);
  }

  function addStyle(){
    const css=`
      .hotfix-toast{background:rgba(24,18,32,.96);border:1px solid rgba(210,180,255,.25);}
      .morwen-bubble{max-height:30vh;overflow:auto;}
      .hotfix-required-skip{display:grid;grid-template-columns:1fr;gap:6px;margin:8px 0;padding:10px;border-radius:16px;background:rgba(120,80,150,.18);border:1px solid rgba(220,190,255,.18)}
      .hotfix-required-skip b{font-size:13px}.hotfix-required-skip small{opacity:.8}.hotfix-required-skip button{width:100%;}
      .c4-action.hotfix-duplicate{display:none!important;}
      .hotfix-target-info{margin-top:4px;font-size:10px;opacity:.82;color:#e9e0ef;}
    `;
    const existing=document.getElementById('magic-hotfix-v21-style');
    if(existing){existing.textContent=css;return;}
    const style=document.createElement('style');style.id='magic-hotfix-v21-style';style.textContent=css;document.head.appendChild(style);
  }

  function c2HomeMissingKeys(){
    const pack=loadSave();const c=pack?.save?.chapter2;if(!c)return [];
    const seen=c.homeSeen||{};
    return ['wreath','phone','door'].filter(k=>!seen[k]);
  }
  function decorateC2HomeFallback(){
    const footer=document.querySelector('.c2-shell .c2-footer');
    if(!footer||footer.querySelector('.hotfix-required-skip'))return;
    const missing=c2HomeMissingKeys();
    if(!missing.length)return;
    const box=document.createElement('div');
    box.className='hotfix-required-skip';
    box.innerHTML=`<b>Если точка на сцене не нажимается</b><small>Мобильный fallback: отмечает обязательные осмотры без пиксельной охоты по картинке.</small><button class="secondary-button" data-hotfix-c2-required="1" type="button">Отметить обязательные точки</button>`;
    footer.prepend(box);
  }
  function decorateC4Battle(){
    document.querySelectorAll('.c4-actions').forEach(panel=>{
      const seen=new Set();
      panel.querySelectorAll('.c4-action[data-action="c4-battle-action"]').forEach(btn=>{
        const id=btn.dataset.value;
        if(seen.has(id))btn.classList.add('hotfix-duplicate');
        else seen.add(id);
      });
    });
    const save=getCurrentBattleSave();
    const b=save?.chapter4?.battle;
    if(!b||save.chapter4?.stage!=='battle')return;
    const targets=document.querySelectorAll('.c4-target');
    const data=[b.patients,b.lab];
    targets.forEach((node,i)=>{
      if(node.querySelector('.hotfix-target-info'))return;
      const t=data[i];if(!t)return;
      const info=document.createElement('div');info.className='hotfix-target-info';
      info.textContent=`HP ${Math.max(0,t.hp)}/${t.max} · Щит ${t.shield||0}`;
      node.appendChild(info);
    });
  }
  function decorateVersion(){
    document.querySelectorAll('.version-line,.hardfix-version,.mobile-hardfix-banner').forEach(n=>{
      if(!n.dataset.hotfixVersion){n.dataset.hotfixVersion='1';n.insertAdjacentHTML('beforeend',` · hotfix ${HOTFIX_VERSION}`);}
    });
  }
  function decorate(){
    decorateC2HomeFallback();
    decorateC4Battle();
    decorateVersion();
  }

  document.addEventListener('click',event=>{
    const fallback=event.target.closest?.('[data-hotfix-c2-required]');
    if(!fallback)return;
    event.preventDefault();event.stopPropagation();
    const missing=c2HomeMissingKeys();
    if(!missing.length){toast('Обязательные точки уже отмечены.');return;}
    missing.forEach(key=>{
      const btn=document.querySelector(`[data-action="chapter2-home-point"][data-key="${key}"]`);
      if(btn)btn.click();
    });
    toast('Обязательные точки осмотра отмечены.');
  },true);

  function refreshServiceWorker(){
    if(!('serviceWorker'in navigator))return;
    navigator.serviceWorker.getRegistrations?.().then(regs=>regs.forEach(reg=>reg.update().catch(()=>{}))).catch(()=>{});
  }

  addEventListener('load',()=>{
    addStyle();
    bootSaveRepair();
    bindRuntimeGuards();
    refreshServiceWorker();
    decorate();
    const app=document.getElementById('app');
    if(app){
      new MutationObserver(()=>requestAnimationFrame(decorate)).observe(app,{childList:true,subtree:true});
    }
    console.info(`Magic RPG hotfix ${HOTFIX_VERSION} active`);
  });
})();
