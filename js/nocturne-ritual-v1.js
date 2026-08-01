/* Magic RPG — Nocturne Ritual v1
   Presentation-only decoration layer. Game rules and save data remain untouched. */
(()=>{
  'use strict';

  const APP=document.getElementById('app');
  const SAVE_KEY='magicRpgVerticalSliceV1.save';
  const ART={
    heroMale:'assets/nocturne/hero-male.webp',
    heroFemale:'assets/nocturne/hero-female.webp',
    morven:'assets/art-v3/morven.webp',
    liora:'assets/art-v3/liora.webp',
    celeste:'assets/art-v3/celeste.webp',
    nika:'assets/art-v3/nika.webp',
    battle:'assets/art-v3/ritual-battle.webp',
    incident:'assets/art-v3/neighbor-yard.webp',
    chapter3:'assets/art-v3/ritual-battle.webp',
    chapter4:'assets/art-v3/alchemy-lab.webp'
  };
  const SPELLS={
    telekinesis:'assets/nocturne/spell-telekinesis.webp',
    shield:'assets/nocturne/spell-shield.webp',
    search:'assets/nocturne/spell-search.webp',
    banish:'assets/nocturne/spell-banish.webp'
  };
  let queued=false;

  const clean=value=>(value||'').replace(/\s+/g,' ').trim();
  const all=(selector,root=document)=>[...root.querySelectorAll(selector)];

  function readProfile(){
    try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')?.profile||null;}catch{return null;}
  }

  function heroPortrait(){
    return readProfile()?.heroId==='witch'?ART.heroFemale:ART.heroMale;
  }

  function battleContext(){
    const root=document.querySelector('.battle-layout-v1');
    if(!root)return null;
    if(root.closest('.c2-shell'))return {root,kind:'chapter2',src:ART.battle,alt:'Памятный плющ в ритуальном круге'};
    if(root.closest('.inc-shell'))return {root,kind:'incident',src:ART.incident,alt:'Магическая аномалия во дворе'};
    if(root.closest('.c3-shell'))return {root,kind:'chapter3',src:ART.chapter3,alt:'Ритуальная угроза у защитного маяка'};
    if(root.closest('.c4-shell'))return {root,kind:'chapter4',src:ART.chapter4,alt:'Алхимический голод в лаборатории'};
    return null;
  }

  function decorateStart(){
    const screen=document.querySelector('.start-screen');
    if(!screen)return;
    const kicker=screen.querySelector('.brand-kicker');
    const title=screen.querySelector('.start-title');
    const subtitle=screen.querySelector('.start-subtitle');
    const version=screen.querySelector('.version-line');
    if(kicker)kicker.textContent='Magic RPG · Nocturne';
    if(title)title.innerHTML='Между светом<br>и тьмой';
    if(subtitle)subtitle.textContent='Город помнит каждую клятву. Расследуйте магические дела, готовьте зелья и завершайте ритуалы вместе со спутниками.';
    if(version)version.textContent='Вертикальный срез · прогресс сохраняется автоматически';
  }

  function decorateBattleArt(){
    const info=battleContext();
    if(!info)return;
    let figure=info.root.querySelector(':scope > .nr-battle-art');
    if(!figure){
      figure=document.createElement('figure');
      figure.className=`nr-battle-art nr-${info.kind}`;
      figure.innerHTML=`<img src="${info.src}" alt="${info.alt}" loading="eager"><span aria-hidden="true"></span>`;
      info.root.prepend(figure);
    }
  }

  function portraitFor(label){
    const value=label.toLowerCase();
    if(value.includes('морвен')||value.includes('цели'))return ART.morven;
    if(value.includes('лиора'))return ART.liora;
    if(value.includes('селест'))return ART.celeste;
    if(value.includes('ника'))return ART.nika;
    return heroPortrait();
  }

  function decorateActors(){
    all('.battle-actor-tab').forEach(tab=>{
      if(tab.querySelector(':scope > .nr-actor-portrait'))return;
      const img=document.createElement('img');
      img.className='nr-actor-portrait';
      img.src=portraitFor(clean(tab.textContent));
      img.alt='';
      img.setAttribute('aria-hidden','true');
      tab.prepend(img);
    });
  }

  function spellKey(button){
    const value=clean(button.textContent).toLowerCase();
    if(/телекин|разорвать|рассеч|оскол/.test(value))return 'telekinesis';
    if(/щит|эгид|защит|контур/.test(value))return 'shield';
    if(/поиск|раскры|источник|анализ/.test(value))return 'search';
    if(/изгнан|очищ|печать|финал|разрушить/.test(value))return 'banish';
    return '';
  }

  function decorateActions(){
    all('.battle-action-card').forEach(button=>{
      const key=spellKey(button);
      if(!key){button.classList.add('nr-action-text-only');return;}
      button.dataset.nrSpell=key;
      if(button.querySelector(':scope > .nr-spell-icon'))return;
      const img=document.createElement('img');
      img.className='nr-spell-icon';
      img.src=SPELLS[key];
      img.alt='';
      img.setAttribute('aria-hidden','true');
      button.prepend(img);
    });
  }

  function decoratePortraits(){
    all('.party-avatar,.hero-orb').forEach(node=>{
      if(node.querySelector('img'))return;
      const img=document.createElement('img');
      img.src=heroPortrait();
      img.alt='';
      img.setAttribute('aria-hidden','true');
      node.replaceChildren(img);
    });
  }

  function apply(){
    queued=false;
    document.body.classList.add('nocturne-ritual-v1');
    document.documentElement.dataset.visualTheme='nocturne-ritual-v1';
    decorateStart();
    decorateBattleArt();
    decorateActors();
    decorateActions();
    decoratePortraits();
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>requestAnimationFrame(apply));
  }

  addEventListener('DOMContentLoaded',()=>{
    apply();
    if(APP)new MutationObserver(schedule).observe(APP,{childList:true,subtree:true});
    addEventListener('resize',schedule,{passive:true});
    setTimeout(apply,250);
  });
})();
