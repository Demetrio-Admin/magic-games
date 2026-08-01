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
