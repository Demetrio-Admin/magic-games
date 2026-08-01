/* Magic RPG — Nocturne scene atlas v2
   Presentation-only scene mapping. Game rules and save data remain untouched. */
(()=>{
  'use strict';

  const APP=document.getElementById('app');
  const MODAL=document.getElementById('modal-root');
  const SAVE_KEY='magicRpgVerticalSliceV1.save';
  const ART={
    house:'assets/nocturne/main-house.webp',
    study:'assets/nocturne/occult-study.webp',
    apartment:'assets/nocturne/memory-apartment.webp',
    pact:'assets/nocturne/memory-pact.webp',
    busStop:'assets/nocturne/bus-stop-flowers.webp',
    square:'assets/nocturne/first-light-square.webp',
    warehouse:'assets/nocturne/memory-warehouse.webp',
    sediment:'assets/nocturne/mirror-sediment.webp',
    alchemy:'assets/art-v3/alchemy-lab.webp',
    liora:'assets/art-v3/liora.webp',
    celeste:'assets/art-v3/celeste.webp',
    heroMale:'assets/nocturne/hero-male.webp',
    heroFemale:'assets/nocturne/hero-female.webp'
  };
  let queued=false;

  const clean=value=>(value||'').replace(/\s+/g,' ').trim();
  const titleOf=root=>clean(root?.querySelector('h1')?.textContent);

  function profile(){
    try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')?.profile||null;}catch{return null;}
  }

  function heroArt(){return profile()?.heroId==='witch'?ART.heroFemale:ART.heroMale;}

  function makePicture(src,alt,className='nr-v2-canvas-art'){
    const image=document.createElement('img');
    image.className=className;
    image.src=src;
    image.alt=alt;
    image.loading='eager';
    image.decoding='async';
    return image;
  }

  function sceneFigure(src,alt,label,kind='story'){
    const figure=document.createElement('figure');
    figure.className=`nr-v2-scene-art nr-v2-scene-${kind}`;
    figure.dataset.nrScene=src;
    figure.append(makePicture(src,alt,'nr-v2-scene-image'));
    if(label){
      const caption=document.createElement('figcaption');
      caption.textContent=label;
      figure.append(caption);
    }
    return figure;
  }

  function ensureFigure(root,src,alt,label,kind='story',anchor=null){
    if(!root)return;
    let figure=root.querySelector(':scope > .nr-v2-scene-art');
    if(figure?.dataset.nrScene===src)return;
    figure?.remove();
    figure=sceneFigure(src,alt,label,kind);
    if(anchor?.parentElement===root)anchor.after(figure);
    else root.prepend(figure);
  }

  function ensureCanvas(root,src,alt){
    if(!root)return;
    let image=root.querySelector(':scope > .nr-v2-canvas-art');
    if(!image){
      image=makePicture(src,alt);
      root.prepend(image);
    }else if(image.getAttribute('src')!==src){
      image.src=src;
      image.alt=alt;
    }
    root.classList.add('nr-v2-authored-canvas');
    [...root.children].forEach(child=>{
      if(child!==image&&(child.matches('.vp-art,.vp-art-v2,.vp-art-v3')||child.querySelector?.(':scope > svg'))){
        child.classList.add('nr-v2-legacy-art');
        child.setAttribute('aria-hidden','true');
      }
    });
  }

  function decorateHome(){
    document.querySelectorAll('.home-scene').forEach(scene=>{
      ensureCanvas(scene,ART.house,'Гостиная главного дома ночью');
    });
  }

  function decorateHeroChoices(){
    document.querySelectorAll('.hero-choice').forEach(choice=>{
      if(choice.querySelector(':scope > .nr-v2-hero-choice-art'))return;
      const src=choice.dataset.hero==='witch'?ART.heroFemale:ART.heroMale;
      const alt=choice.dataset.hero==='witch'?'Портрет ведьмы':'Портрет колдуна';
      choice.prepend(makePicture(src,alt,'nr-v2-hero-choice-art'));
    });
  }

  function metaArt(title,hero){
    if(/лаборатор/i.test(title))return {src:ART.alchemy,alt:'Алхимическая лаборатория',label:'Лаборатория'};
    if(/книга теней|история героя|сумка|доступные дела/i.test(title))return {src:ART.study,alt:'Книга Теней в оккультном кабинете',label:'Архив дома'};
    if(/спутник|отряд/i.test(title))return {src:ART.house,alt:'Гостиная главного дома',label:'Общий зал'};
    if(/герой/i.test(title))return {src:hero,alt:'Портрет главного героя',label:'Главный герой'};
    return null;
  }

  function decorateMetaScreens(){
    document.querySelectorAll('#screen-content > .screen,.game-shell > .screen').forEach(screen=>{
      if(screen.querySelector('.home-scene'))return;
      const title=titleOf(screen);
      const art=metaArt(title,heroArt());
      if(!art)return;
      const roomHero=screen.querySelector('.rx-room-hero');
      if(roomHero){
        ensureCanvas(roomHero,art.src,art.alt);
        return;
      }
      ensureFigure(screen,art.src,art.alt,art.label,'meta',screen.querySelector(':scope > .screen-header'));
    });
  }

  function c2Scene(title){
    if(/памятный плющ/i.test(title))return null;
    if(/дом родителей|очищающая смесь/i.test(title))return null;
    if(/судьба семени|возвращение|призыв|первый договор|глава завершена/i.test(title)){
      return {src:ART.pact,alt:'Книга Теней и серебряная заколка в ритуальном круге',label:'Память закреплена'};
    }
    return {src:ART.apartment,alt:'Заброшенная квартира, пронизанная фиолетовыми корнями памяти',label:'След памяти'};
  }

  function decorateChapter2(){
    document.querySelectorAll('.c2-shell').forEach(shell=>{
      const main=shell.querySelector('.c2-main');
      const title=titleOf(shell);
      if(/расследование/i.test(title)){
        ensureCanvas(main?.querySelector('.ux-scene'),ART.apartment,'Заброшенная квартира, пронизанная корнями памяти');
        return;
      }
      const resultScene=main?.querySelector('.nui-result-head,.c2-result,.c2-summary');
      const art=resultScene
        ?{src:ART.pact,alt:'Книга Теней и серебряная заколка в ритуальном круге',label:'Память закреплена'}
        :c2Scene(title);
      if(art)ensureFigure(main,art.src,art.alt,art.label,'chapter');
    });
  }

  function decorateIncident(){
    document.querySelectorAll('.inc-shell').forEach(shell=>{
      const main=shell.querySelector('.inc-main');
      const title=titleOf(shell);
      const battle=main?.querySelector('.nr-battle-art img');
      if(battle){
        if(battle.getAttribute('src')!==ART.busStop)battle.src=ART.busStop;
        battle.alt='Остановка №17, окружённая говорящими астрами';
        return;
      }
      const scene=main?.querySelector('.inc-scene,.ux-scene');
      if(scene)ensureCanvas(scene,ART.busStop,'Остановка №17, окружённая говорящими астрами');
      else ensureFigure(main,ART.busStop,'Остановка №17, окружённая говорящими астрами',/завершено/i.test(title)?'После ритуала':'Остановка №17','incident');
    });
  }

  function decorateChapter3(){
    document.querySelectorAll('.c3-shell').forEach(shell=>{
      const main=shell.querySelector('.c3-main');
      const title=titleOf(shell);
      if(main?.querySelector('.battle-layout-v1'))return;
      if(/приказ после боя|после операции|глава завершена/i.test(title)){
        ensureFigure(main,ART.liora,'Лиора Вейн, маг Первого Света','Лиора Вейн','portrait');
        return;
      }
      const canvas=main?.querySelector('.c3-scene,.ux6-scene,.ux6-training-scene,.ux6-danger-scene');
      if(canvas)ensureCanvas(canvas,ART.square,'Площадь Первого Света и защитный маяк ночью');
      else ensureFigure(main,ART.square,'Площадь Первого Света и защитный маяк ночью','Площадь Первого Света','chapter');
    });
  }

  function decorateChapter4(){
    document.querySelectorAll('.c4-shell').forEach(shell=>{
      const main=shell.querySelector('.c4-main');
      const title=titleOf(shell);
      const battle=main?.querySelector('.nr-battle-art img');
      if(battle){
        if(battle.getAttribute('src')!==ART.sediment)battle.src=ART.sediment;
        battle.alt='Алхимический голод поднимается из чёрного осадка';
        return;
      }
      if(/после очищения|глава завершена/i.test(title)){
        ensureFigure(main,ART.celeste,'Селеста Роу, алхимик подпольной лаборатории','Селеста Роу','portrait');
        return;
      }
      if(/проверка партии|диагноз/i.test(title)){
        const canvas=main?.querySelector('.c4-invest-scene');
        if(canvas)ensureCanvas(canvas,ART.warehouse,'Склад подменённых алхимических партий');
        else ensureFigure(main,ART.warehouse,'Склад подменённых алхимических партий','Подпольный склад','chapter');
        return;
      }
      if(/формула противоядия|перед ритуалом/i.test(title)){
        ensureFigure(main,ART.alchemy,'Лаборатория Селесты с алхимическим оборудованием','Лаборатория Селесты','chapter');
        return;
      }
      if(/варка противоядия|смесь готова/i.test(title)){
        ensureFigure(main,ART.alchemy,'Алхимическое оборудование лаборатории Селесты','Лаборатория Селесты','meta');
        return;
      }
      const hero=main?.querySelector('.c4-hero');
      if(hero)ensureCanvas(hero,ART.alchemy,'Лаборатория Селесты с алхимическим оборудованием');
    });
  }

  function decorateModalRooms(){
    document.querySelectorAll('#modal-root .modal-body').forEach(body=>{
      if(body.querySelector('.hero-choice'))return;
      const title=clean(body.closest('.modal')?.querySelector('h2')?.textContent||body.parentElement?.querySelector('h2')?.textContent);
      const art=metaArt(title,heroArt());
      if(art)ensureFigure(body,art.src,art.alt,art.label,'modal');
    });
  }

  function apply(){
    queued=false;
    document.body.classList.add('nocturne-scenes-v2');
    document.documentElement.dataset.sceneAtlas='nocturne-scenes-v2';
    decorateHome();
    decorateHeroChoices();
    decorateMetaScreens();
    decorateChapter2();
    decorateIncident();
    decorateChapter3();
    decorateChapter4();
    decorateModalRooms();
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>requestAnimationFrame(apply));
  }

  addEventListener('DOMContentLoaded',()=>{
    apply();
    if(APP)new MutationObserver(schedule).observe(APP,{childList:true,subtree:true});
    if(MODAL)new MutationObserver(schedule).observe(MODAL,{childList:true,subtree:true});
    addEventListener('resize',schedule,{passive:true});
    setTimeout(apply,260);
  });
})();
