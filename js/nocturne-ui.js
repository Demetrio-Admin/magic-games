
/* Consolidated source: js/nocturne-ritual-v1.js */
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

/* Nocturne Clean UI — one final compatibility pass for the canonical engine DOM. */
(()=>{
  'use strict';

  const APP=document.getElementById('app');
  const SPELLS={
    telekinesis:'assets/nocturne/spell-telekinesis.webp',
    shield:'assets/nocturne/spell-shield.webp',
    search:'assets/nocturne/spell-search.webp',
    banish:'assets/nocturne/spell-banish.webp'
  };
  const ART={
    c2:'assets/art-v3/ritual-battle.webp',
    incident:'assets/nocturne/bus-stop-flowers.webp',
    c3:'assets/nocturne/first-light-square.webp',
    c4:'assets/nocturne/mirror-sediment.webp',
    heroMale:'assets/nocturne/hero-male.webp',
    heroFemale:'assets/nocturne/hero-female.webp',
    morven:'assets/art-v3/morven.webp',
    liora:'assets/art-v3/liora.webp',
    celeste:'assets/art-v3/celeste.webp'
  };
  let queued=false;

  const clean=value=>(value||'').replace(/\s+/g,' ').trim();
  const profile=()=>{try{return JSON.parse(localStorage.getItem('magicRpgVerticalSliceV1.save')||'null')?.profile||null}catch{return null}};
  const heroArt=()=>profile()?.heroId==='witch'?ART.heroFemale:ART.heroMale;

  function spellKey(node){
    const value=clean(node.textContent).toLowerCase();
    if(/телекин|рассеч|оскол|разорвать/.test(value))return 'telekinesis';
    if(/щит|эгид|защит|контур|барьер/.test(value))return 'shield';
    if(/поиск|раскры|источник|анализ|намерение/.test(value))return 'search';
    if(/изгнан|очищ|печать|финал|разруш|смесь/.test(value))return 'banish';
    return '';
  }

  function portraitFor(node){
    const value=clean(node.textContent).toLowerCase();
    if(value.includes('морвен')||value.includes('цели'))return ART.morven;
    if(value.includes('лиора'))return ART.liora;
    if(value.includes('селест'))return ART.celeste;
    return heroArt();
  }

  function decorateBattle(layout,src,alt,kind){
    if(!layout)return;
    let figure=layout.querySelector(':scope > .nr-clean-battle-art');
    if(!figure){
      figure=document.createElement('figure');
      figure.className=`nr-clean-battle-art nr-clean-${kind}`;
      const image=document.createElement('img');
      image.src=src;
      image.alt=alt;
      image.loading='eager';
      image.decoding='async';
      figure.append(image);
      const objective=layout.querySelector(':scope > .c2-ritual,:scope > .inc-ritual,:scope > .c4-objective');
      if(objective)objective.after(figure);else layout.prepend(figure);
    }
  }

  function decorateBattles(){
    document.querySelectorAll('.c2-shell .c2-battle').forEach(node=>decorateBattle(node,ART.c2,'Памятный плющ внутри ритуального круга','chapter2'));
    document.querySelectorAll('.inc-shell .inc-battle').forEach(node=>decorateBattle(node,ART.incident,'Говорящие астры на остановке №17','incident'));
    document.querySelectorAll('.c3-shell .ux6-battle-layout,.c3-shell .c3-main > .c3-battle').forEach(node=>decorateBattle(node,ART.c3,'Защитный маяк Первого Света ночью','chapter3'));
    document.querySelectorAll('.c4-shell .c4-battle').forEach(node=>decorateBattle(node,ART.c4,'Зеркальный осадок в подпольной лаборатории','chapter4'));
  }

  function decorateActions(){
    document.querySelectorAll('.c2-action,.inc-action,.c3-action,.c4-action').forEach(button=>{
      const key=spellKey(button);
      if(!key||button.querySelector(':scope > .nr-clean-spell'))return;
      const image=document.createElement('img');
      image.className='nr-clean-spell';
      image.src=SPELLS[key];
      image.alt='';
      image.setAttribute('aria-hidden','true');
      button.prepend(image);
    });
  }

  function decorateActors(){
    document.querySelectorAll('.c2-battle-tabs button,.inc-party > *,.c3-battle-tabs button,.c4-team > button').forEach(node=>{
      if(node.querySelector(':scope > .nr-clean-actor'))return;
      const image=document.createElement('img');
      image.className='nr-clean-actor';
      image.src=portraitFor(node);
      image.alt='';
      image.setAttribute('aria-hidden','true');
      node.prepend(image);
    });
  }

  function repairAccessibility(){
    document.querySelectorAll('.modal-close').forEach(button=>button.setAttribute('aria-label','Закрыть'));
    document.querySelectorAll('.c2-back,.c3-back,.c4-back,.inc-back').forEach(button=>button.setAttribute('aria-label','Назад'));
    document.querySelectorAll('.c2-help,.c3-help,.c4-help,.inc-help').forEach(button=>button.setAttribute('aria-label','Помощь'));
  }

  function apply(){
    queued=false;
    document.body.classList.add('nocturne-clean');
    document.documentElement.dataset.uiSystem='nocturne-clean-v1';
    decorateBattles();
    decorateActions();
    decorateActors();
    repairAccessibility();
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>requestAnimationFrame(apply));
  }

  addEventListener('DOMContentLoaded',()=>{
    apply();
    if(APP)new MutationObserver(schedule).observe(APP,{childList:true,subtree:true});
    const modal=document.getElementById('modal-root');
    if(modal)new MutationObserver(schedule).observe(modal,{childList:true,subtree:true});
    setTimeout(apply,300);
  });
})();

/* Consolidated source: js/nocturne-scenes-v2.js */
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
      if(main?.querySelector('.battle-layout-v1,.ux6-battle-layout,.c3-battle'))return;
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

/* Consolidated source: js/chapter2-home-v3.js */
/* Chapter 2 · Parents' home v3
   Repairs the scene stack and adds clear four-point interaction labels. */
(()=>{
  'use strict';

  const APP=document.getElementById('app');
  const SCENE='assets/art-v3/parents-home.webp';
  const POINTS={
    wreath:{index:'01',name:'Венок',task:'Цветы из венка',note:'обязательно'},
    photo:{index:'02',name:'Фото',task:'Старая фотография',note:'дополнительно'},
    phone:{index:'03',name:'Телефон',task:'Сообщение Ники',note:'обязательно'},
    door:{index:'04',name:'Дверь',task:'Заражённая дверь',note:'обязательно'}
  };
  let queued=false;

  const isHome=()=>{
    const shell=document.querySelector('.c2-shell');
    const title=shell?.querySelector('.c2-top h1')?.textContent||'';
    return /дом родителей/i.test(title)?shell:null;
  };

  function addSceneImage(hero){
    let image=hero.querySelector(':scope > .c2h3-scene-image');
    if(image)return;
    image=document.createElement('img');
    image.className='c2h3-scene-image';
    image.src=SCENE;
    image.alt='Тёмный кабинет семьи Вейн с фиолетовыми следами памяти';
    image.loading='eager';
    image.decoding='async';
    hero.prepend(image);
  }

  function decorateScene(hero){
    addSceneImage(hero);
    const label=hero.querySelector('.c2-scene-label');
    if(label)label.textContent='Кабинет семьи Вейн';
    let hint=hero.querySelector(':scope > .c2h3-scene-hint');
    if(!hint){
      hint=document.createElement('div');
      hint.className='c2h3-scene-hint';
      hint.textContent='3 обязательных объекта · фото дополнительно';
      hero.append(hint);
    }
    hero.querySelectorAll('.c2-hotspot[data-key]').forEach(button=>{
      const point=POINTS[button.dataset.key];
      if(!point||button.dataset.c2h3Decorated==='1')return;
      button.dataset.c2h3Decorated='1';
      button.setAttribute('aria-label',`${point.task}${button.classList.contains('done')?' — осмотрено':''}`);
      const index=document.createElement('span');
      index.className='c2h3-point-index';
      index.textContent=point.index;
      const name=document.createElement('span');
      name.className='c2h3-point-name';
      name.textContent=point.name;
      button.replaceChildren(index,name);
    });
  }

  function decorateTasks(shell,hero){
    const story=shell.querySelector('.c2-story');
    if(!story)return;
    let grid=story.querySelector(':scope > .c2h3-task-grid');
    if(!grid){
      grid=document.createElement('div');
      grid.className='c2h3-task-grid';
      story.append(grid);
    }
    const states=Object.fromEntries([...hero.querySelectorAll('.c2-hotspot[data-key]')].map(button=>[button.dataset.key,button.classList.contains('done')]));
    grid.replaceChildren();
    Object.entries(POINTS).forEach(([key,point])=>{
      const done=Boolean(states[key]);
      const task=document.createElement('button');
      task.type='button';
      task.className=`c2h3-task${done?' is-done':''}`;
      task.dataset.action='chapter2-home-point';
      task.dataset.key=key;
      task.disabled=done;
      task.setAttribute('aria-label',`${point.task}. ${done?'Осмотрено':point.note}`);
      const name=document.createElement('span');
      name.className='c2h3-task-name';
      name.textContent=point.task;
      const detail=document.createElement('small');
      detail.textContent=point.note;
      const status=document.createElement('em');
      status.className='c2h3-task-status';
      status.textContent=done?'Осмотрено':'Открыть';
      task.append(name,detail,status);
      grid.append(task);
    });
  }

  function decorateProgress(shell,hero){
    const required=['wreath','phone','door'];
    const complete=required.filter(key=>hero.querySelector(`.c2-hotspot[data-key="${key}"].done`)).length;
    const hud=shell.querySelector('.c2-hud span');
    if(hud){
      hud.textContent=`${complete}/3`;
      hud.setAttribute('aria-label',`${complete} из 3 обязательных объектов осмотрено`);
    }
    const next=shell.querySelector('.c2-footer [data-action="chapter2-to-investigation"]');
    if(next){
      next.classList.add('c2h3-next-button');
      next.textContent=next.disabled?`Осмотрите обязательные объекты · ${complete}/3`:'Перейти к соседнему дому';
    }
  }

  function compactCoach(shell){
    const coach=shell.querySelector('.c2-main > .ux-coach-card.ux-coach-card-inline');
    if(!coach)return;
    const title=coach.querySelector(':scope > b');
    const copy=coach.querySelector(':scope > p');
    if(title)title.textContent='Осмотрите комнату';
    if(copy)copy.textContent='Нажмите на подсвеченный объект. Подробное объяснение всегда доступно по кнопке «?». ';
  }

  function apply(){
    queued=false;
    const shell=isHome();
    document.body.classList.toggle('c2-home-v3-active',Boolean(shell));
    if(!shell)return;
    const hero=shell.querySelector('.c2-home-hero');
    if(!hero)return;
    decorateScene(hero);
    decorateTasks(shell,hero);
    decorateProgress(shell,hero);
    compactCoach(shell);
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>requestAnimationFrame(apply));
  }

  addEventListener('DOMContentLoaded',()=>{
    apply();
    if(APP)new MutationObserver(schedule).observe(APP,{childList:true,subtree:true});
    setTimeout(apply,300);
  });
})();
