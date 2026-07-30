/*
 * АРХИВИРОВАНО (не подключён к index.html).
 *
 * Причина: этот файл дублирует и частично конфликтует с логикой, которая
 * уже реализована и работает в js/app.js (case 'c4-battle-action') и
 * js/mobile-layout-v1.1.js (enhanceC2Checklist / triggerChecklist для .c2-check).
 *
 * В частности, обработчик 'c4-battle-action' + data-value="dose" здесь
 * через stopImmediatePropagation() ПЕРЕХВАТЫВАЕТ клик и подменяет реакцию
 * на "приём дозы" в главе 4 своей веткой spendC4Dose(), которая ведёт учёт
 * b.bait / b.enemy.hunger отдельно от актуальной c4BattleAction() в app.js.
 * Если случайно подключить этот файл в index.html, баланс главы 4 может
 * начать вести себя иначе, чем в остальной игре — без единого сообщения
 * об ошибке в консоли.
 *
 * Если что-то из этого файла действительно нужно (например, сброс
 * прогресса главы 4 через resetC4Safely) — переносите функцию отдельно,
 * с явным тестом, а не подключайте файл целиком.
 */
(() => {
  'use strict';

  const VERSION = 'full-audit-1.0.0';
  let repairing = false;

  const api = () => globalThis.__magicTest || null;
  const getSave = () => api()?.getSave?.() || null;

  function findSaveKey() {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      try {
        const value = JSON.parse(localStorage.getItem(key));
        if (value?.profile && value?.progression?.chapters && value?.story) return key;
      } catch (_) {}
    }
    return null;
  }

  function persist(save) {
    if (!save) return;
    save.updatedAt = new Date().toISOString();
    const key = findSaveKey();
    if (key) localStorage.setItem(key, JSON.stringify(save));
  }

  function render(save, screen) {
    const test = api();
    if (!test || !save) return;
    test.setSave(save, screen || save.progression?.currentScreen || 'home');
    persist(save);
    test.renderGame();
  }

  function notify(message) {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const node = document.createElement('div');
    node.className = 'toast show';
    node.textContent = message;
    root.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  }

  function injectStyles() {
    if (document.getElementById('full-audit-style')) return;
    const style = document.createElement('style');
    style.id = 'full-audit-style';
    style.textContent = `
      .c2-check[data-action]{cursor:pointer;min-height:42px;display:flex;align-items:center;touch-action:manipulation}
      .c2-check[data-action]:focus-visible{outline:2px solid currentColor;outline-offset:2px}
      .full-hotfix-optional{opacity:.82}
      .full-hotfix-shield{display:inline-flex;margin-left:6px;padding:2px 6px;border:1px solid currentColor;border-radius:999px;font-size:10px;font-weight:700}
      .full-hotfix-hidden{display:none!important}
      .full-hotfix-version{position:fixed;left:6px;bottom:6px;z-index:5;font:9px/1.2 system-ui;opacity:.42;pointer-events:none}
    `;
    document.head.appendChild(style);
  }

  function repairSave(save) {
    if (!save || repairing) return false;
    let changed = false;
    save.story ||= { flags: {}, decisions: {} };
    save.story.flags ||= {};
    save.story.decisions ||= {};
    save.inventory ||= { items: {} };
    save.inventory.items ||= {};
    save.recipes ||= { known: [], mastery: {} };
    save.recipes.known ||= [];
    save.recipes.mastery ||= {};
    save.relationships ||= {};
    save.reputations ||= {};
    save.companions ||= { owned: [], states: {}, activeParty: ['morven', null] };
    save.companions.owned ||= [];
    save.companions.states ||= {};
    save.companions.activeParty ||= ['morven', null];

    const c4 = save.chapter4;
    if (c4) {
      c4.investigation ||= { location:'warehouse', time:7, selectedPoint:null, used:{}, evidence:{}, freeSearch:true };
      c4.investigation.used ||= {};
      c4.investigation.evidence ||= {};
      c4.alchemy ||= { order:[], temp:null, charge:null, quality:null, score:0 };

      const needsDiagnosis = ['formula','alchemy','brief','battle','choice','final'].includes(c4.stage);
      const needsRecipe = ['alchemy','brief','battle','choice','final'].includes(c4.stage);
      const needsQuality = ['brief','battle','choice','final'].includes(c4.stage);

      if (needsDiagnosis && !c4.diagnosis) { c4.stage='deduction'; changed=true; }
      else if (needsRecipe && !c4.recipeChoice) { c4.stage='formula'; changed=true; }
      else if (needsQuality && !c4.alchemy.quality) { c4.stage='alchemy'; changed=true; }

      if (c4.stage==='battle' && !c4.battle) { c4.stage='brief'; changed=true; }
      if (c4.stage==='final' && !c4.finalChoice) { c4.stage='choice'; changed=true; }
    }
    return changed;
  }

  function decorateChapter2Home(save) {
    if (save?.chapter2?.stage !== 'home') return;
    const checks = [...document.querySelectorAll('.c2-check')];
    ['wreath','phone','door'].forEach((key, index) => {
      const node = checks[index];
      if (!node) return;
      node.dataset.action = 'chapter2-home-point';
      node.dataset.key = key;
      node.setAttribute('role','button');
      node.setAttribute('tabindex','0');
    });

    const story = document.querySelector('.c2-story');
    if (story && !story.querySelector('[data-key="photo"]')) {
      const photo = document.createElement('div');
      photo.className = `c2-check full-hotfix-optional ${save.chapter2.homeSeen?.photo ? 'done' : ''}`;
      photo.dataset.action = 'chapter2-home-point';
      photo.dataset.key = 'photo';
      photo.setAttribute('role','button');
      photo.setAttribute('tabindex','0');
      photo.textContent = 'Осмотреть семейную фотографию · необязательно';
      story.appendChild(photo);
    }

    const hud = document.querySelector('.c2-hud > span:first-child');
    if (hud) {
      const h = save.chapter2.homeSeen || {};
      const required = [h.wreath,h.phone,h.door].filter(Boolean).length;
      hud.textContent = `${required}/3 обязательных${h.photo ? ' · фото ✓' : ''}`;
    }
  }

  function decorateChapter4Battle(save) {
    const c4 = save?.chapter4;
    const battle = c4?.battle;
    if (c4?.stage !== 'battle' || !battle) return;

    document.querySelectorAll('.c4-target').forEach((node,index) => {
      const target = index===0 ? battle.patients : battle.lab;
      if (!target) return;
      node.querySelector('.full-hotfix-shield')?.remove();
      if (target.shield > 0) {
        const badge = document.createElement('span');
        badge.className = 'full-hotfix-shield';
        badge.textContent = `Щит +${target.shield}`;
        node.querySelector('b')?.appendChild(badge);
      }
    });

    const panel = document.querySelector('.c4-action-panel');
    if (!panel) return;
    const seen = new Set();
    panel.querySelectorAll('.c4-action').forEach(button => {
      const id = button.dataset.value;
      if (seen.has(id)) button.classList.add('full-hotfix-hidden');
      else seen.add(id);
    });

    if (battle.tab === 'celeste') {
      const dose = panel.querySelector('.c4-action[data-value="dose"]');
      if (dose && battle.potionCharges <= 1) {
        dose.disabled = true;
        const old = dose.querySelector('small');
        if (old) old.remove();
        const reason = document.createElement('small');
        reason.textContent = 'Последняя доза зарезервирована для финального Очищения';
        dose.appendChild(reason);
      }
    }
  }

  function decorate() {
    injectStyles();
    const save = getSave();
    if (!save) return;
    if (repairSave(save)) {
      repairing = true;
      render(save, save.progression?.currentScreen || 'home');
      repairing = false;
      notify('Старое сохранение безопасно восстановлено.');
      return;
    }
    decorateChapter2Home(save);
    decorateChapter4Battle(save);
    if (!document.querySelector('.full-hotfix-version')) {
      const mark = document.createElement('div');
      mark.className = 'full-hotfix-version';
      mark.textContent = VERSION;
      document.body.appendChild(mark);
    }
  }

  function spendC4Dose(save) {
    const c = save.chapter4;
    const b = c?.battle;
    if (!b || b.status !== 'active' || b.teamUsed) return false;
    if ((b.potionCharges || 0) <= 1) {
      notify('Последняя доза нужна для финального Очищения.');
      return true;
    }

    b.teamUsed = true;
    b.potionCharges -= 1;
    const recipe = c.recipeChoice;

    if (recipe === 'revealing') {
      b.enemy.coreRevealed = true;
      b.enemy.pokrov = Math.max(0,b.enemy.pokrov-1);
      b.log.push('Проявляющая доза раскрыла ядро и ослабила Покров.');
    } else if (recipe === 'bitter') {
      b.bait += 1;
      b.enemy.pokrov = Math.max(0,b.enemy.pokrov-1);
      b.log.push('Горькая доза подготовила приманку и ослабила Покров.');
    } else {
      const apply = () => { b.patients.shield += 1; b.lab.shield += 1; };
      if (b.enemy.hunger > 0) {
        if (b.bait > 0) {
          b.bait -= 1;
          b.enemy.hunger -= 1;
          apply();
          b.log.push('Горькая приманка поглощена вместо стабилизирующей дозы.');
        } else {
          b.enemy.hunger -= 1;
          b.log.push('Алхимический голод съел стабилизирующую дозу.');
        }
      } else apply();
    }

    if (c.alchemy?.quality === 'excellent' && recipe !== 'stabilizing') {
      b.resonance = Math.min(6,(b.resonance || 0)+1);
    }
    render(save,'chapter4');
    return true;
  }

  function resetC4Safely(save) {
    const c = save.chapter4;
    if (!c || save.progression?.chapters?.chapter_04_bitter_recipe?.status !== 'completed') return false;
    if (!confirm('Сбросить главу 4 и корректно отозвать её награды?')) return true;

    save.currencies.coins = Math.max(0,(save.currencies.coins || 0)-55);
    save.profile.heroXp = Math.max(0,(save.profile.heroXp || 0)-45);
    if (c.finalChoice === 'report') save.reputations.order.value = (save.reputations.order.value || 0)-1;
    if (c.finalChoice === 'expose') save.reputations.independence = Math.max(0,(save.reputations.independence || 0)-2);

    save.chapter4 = {
      status:'available',stage:'intro',approach:null,
      investigation:{location:'warehouse',time:7,selectedPoint:null,used:{},evidence:{},freeSearch:true},
      diagnosis:null,recipeChoice:null,
      alchemy:{order:[],temp:null,charge:null,quality:null,score:0},
      battle:null,finalChoice:null,rewarded:false
    };
    save.progression.chapters.chapter_04_bitter_recipe={status:'available',progress:0};
    save.progression.chapters.chapter_05_city_under_skin={status:'locked',progress:0};
    save.progression.activeQuestId='chapter_04_bitter_recipe';

    Object.keys(save.story.decisions).filter(k=>k.startsWith('chapter_04.')).forEach(k=>delete save.story.decisions[k]);
    Object.keys(save.story.flags).filter(k=>k.startsWith('chapter_04.')||k==='alchemy.extended_unlocked').forEach(k=>delete save.story.flags[k]);
    save.companions.owned=save.companions.owned.filter(id=>id!=='celeste');
    delete save.companions.states.celeste;
    if(save.companions.activeParty[1]==='celeste') save.companions.activeParty[1]=null;
    save.relationships.celeste={trust:0,label:'Не знакомы'};
    delete save.inventory.items.memory_antidote;
    delete save.inventory.items.mirror_sediment_page;
    save.recipes.known=save.recipes.known.filter(id=>id!=='memory_antidote');
    delete save.recipes.mastery.memory_antidote;
    if(save.codex?.creatures) delete save.codex.creatures.mirror_sediment;
    if(save.codex?.discoveries) save.codex.discoveries=save.codex.discoveries.filter(id=>id!=='mirror_sediment');

    render(save,'home');
    notify('Глава 4 и её награды корректно сброшены.');
    return true;
  }

  document.addEventListener('click',event => {
    const button=event.target.closest?.('[data-action]');
    if(!button) return;
    const action=button.dataset.action;
    const save=getSave();

    if(action==='c4-battle-action' && button.dataset.value==='dose' && save) {
      event.preventDefault();
      event.stopImmediatePropagation();
      spendC4Dose(save);
      return;
    }

    if(action==='debug-reset-chapter4' && save?.progression?.chapters?.chapter_04_bitter_recipe?.status==='completed') {
      event.preventDefault();
      event.stopImmediatePropagation();
      resetC4Safely(save);
    }
  },true);

  document.addEventListener('keydown',event => {
    if((event.key==='Enter'||event.key===' ') && event.target.matches?.('.c2-check[data-action]')) {
      event.preventDefault();
      event.target.click();
    }
  });

  const observer=new MutationObserver(()=>requestAnimationFrame(decorate));
  const start=()=>{
    injectStyles();
    const app=document.getElementById('app');
    if(app) observer.observe(app,{childList:true,subtree:true});
    decorate();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
