const api = globalThis.__magicTest;

if (!api) {
  throw new Error('UI audit requires ?ui-audit=1 so the test API is available.');
}

const waitFrames = (count = 4) => new Promise(resolve => {
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    resolve();
  };
  const next = () => count-- > 0 ? requestAnimationFrame(next) : done();
  const fallback = setTimeout(done, 160);
  requestAnimationFrame(next);
});

const clone = value => structuredClone(value);

function baseSave() {
  const save = api.createDefaultSave('witch', 'Александра');
  save.settings.reducedMotion = true;
  return save;
}

function enableCoach(save) {
  save.settings.reducedMotion = false;
  save.ux ||= {dismissed:{}};
  save.ux.dismissed = {};
  return save;
}

function unlockChapter3(save) {
  save.progression.chapters.chapter_02_roots_of_memory = {status:'completed', progress:100};
  save.story.flags['chapter_02.complete'] = true;
  save.chapter2.status = 'completed';
  save.chapter2.stage = 'summary';
  save.chapter2.ending = 'save';
  save.chapter2.alchemy.quality = 'excellent';
  save.progression.chapters.chapter_03_first_light = {status:'available', progress:0};
  api.ensurePart3Unlocks(save);
  api.ensurePart4Unlocks(save);
  return save;
}

function unlockChapter4(save) {
  unlockChapter3(save);
  save.progression.chapters.chapter_03_first_light = {status:'completed', progress:100};
  save.story.flags['chapter_03.complete'] = true;
  save.chapter3.status = 'completed';
  save.chapter3.stage = 'final';
  save.chapter3.amulet = 'save';
  save.chapter3.registration = 'conditional';
  save.relationships.liora = {trust:5, label:'Союзница'};
  if (!save.companions.owned.includes('liora')) save.companions.owned.push('liora');
  save.companions.states.liora = {level:3, trust:5, rank:0};
  save.companions.activeParty[1] = 'liora';
  api.ensurePart4Unlocks(save);
  api.ensureChapter4State(save);
  save.progression.chapters.chapter_04_bitter_recipe = {status:'available', progress:0};
  return save;
}

function chapter2Save(stage) {
  const save = baseSave();
  save.progression.chapters.chapter_02_roots_of_memory = {status:'in_progress', progress:25};
  save.chapter2.status = 'in_progress';
  save.chapter2.stage = stage;
  return save;
}

function chapter3Save(stage) {
  const save = unlockChapter3(baseSave());
  save.progression.chapters.chapter_03_first_light = {status:'in_progress', progress:35};
  delete save.story.flags['chapter_03.complete'];
  save.chapter3.status = 'in_progress';
  save.chapter3.stage = stage;
  return save;
}

function chapter4Save(stage) {
  const save = unlockChapter4(baseSave());
  save.progression.chapters.chapter_04_bitter_recipe = {status:'in_progress', progress:45};
  delete save.story.flags['chapter_04.complete'];
  save.chapter4.status = 'in_progress';
  save.chapter4.stage = stage;
  return save;
}

function fillChapter2Evidence(save) {
  const r = save.chapter2.rework;
  r.evidence = {
    grave_soil:{title:'Погребальная земля', label:'ритуальная', text:'След памяти', type:'ritual'},
    root_pattern:{title:'Ритм корней', label:'тактическая', text:'Рост можно остановить', type:'tactical'},
    witness_words:{title:'Слова свидетельницы', label:'человеческая', text:'Обещание не завершено', type:'human'},
    ledger_warning:{title:'Запись в журнале', label:'ритуальная', text:'Покров восстановится', type:'ritual'}
  };
  r.hypothesis = 'unfinished_promise';
  return save;
}

function fillChapter3Evidence(save) {
  const r = save.chapter3.rework6;
  r.evidence = {
    fear_trace:{title:'След страха', label:'ритуальная', type:'ritual'},
    technician_statement:{title:'Слова техника', label:'человеческая', type:'human'},
    beacon_amplifier:{title:'Резонанс маяка', label:'тактическая', type:'tactical'},
    shield_protocol:{title:'Протокол Щита', label:'ресурсная', type:'resource'},
    escape_tear:{title:'Путь отхода', label:'тактическая', type:'tactical'}
  };
  r.hypothesis = 'fear_amplifier';
  return save;
}

function fillChapter4Evidence(save) {
  const r = save.chapter4.investigation;
  r.evidence = {
    supplier_trace:{title:'След поставщика', label:'Печать Триады', type:'logistics'},
    double_vial:{title:'Двойная колба', label:'Подмена упаковки', type:'chemical'},
    altered_journal:{title:'Исправленный журнал', label:'Чужой почерк', type:'logistics'},
    hunger_trace:{title:'Голодный след', label:'Реакция на усиления', type:'magical'},
    bitter_residue:{title:'Горький осадок', label:'Стабилизатор', type:'chemical'}
  };
  return save;
}

const scenarios = [
  {id:'start', label:'Стартовый экран', screen:'start', build:baseSave, start:true},
  {id:'start-new-game', label:'Создание героя', screen:'start', build:baseSave, start:true, action:'[data-action="new-game"]', expectModal:true},
  {id:'home-early', label:'Дом до главы 2', screen:'home', build:baseSave},
  {id:'home-chapter4', label:'Дом перед главой 4', screen:'home', build:() => unlockChapter4(baseSave())},
  {id:'home-settings', label:'Настройки и сохранение', screen:'home', build:baseSave, action:'[data-action="open-debug"]', expectModal:true},
  {id:'home-room', label:'Комната дома', screen:'home', build:baseSave, action:'[data-action="open-room"][data-room="living_room"]', expectModal:true},
  {id:'home-coach', label:'Дом · подсказка Морвена', screen:'home', build:() => enableCoach(baseSave()), expectCoach:true, expectMorwenInFlow:true},
  {id:'cases', label:'Доска дел', screen:'cases', build:() => unlockChapter4(baseSave())},
  {id:'inventory', label:'Инвентарь', screen:'inventory', build:() => unlockChapter4(baseSave())},
  {id:'inventory-item', label:'Карточка предмета', screen:'inventory', build:baseSave, action:'[data-action="item-details"]', expectModal:true},
  {id:'companions', label:'Спутники', screen:'companions', build:() => unlockChapter4(baseSave())},
  {id:'companion-details', label:'Карточка спутника', screen:'companions', build:baseSave, action:'[data-action="companion-details"]', expectModal:true},
  {id:'journal', label:'Журнал', screen:'journal', build:() => unlockChapter4(baseSave())},
  {id:'codex', label:'Книга Теней', screen:'codex', build:() => unlockChapter4(baseSave())},
  {id:'laboratory', label:'Лаборатория', screen:'laboratory', build:() => unlockChapter4(baseSave())},
  {id:'hero', label:'Развитие героя', screen:'hero', build:() => unlockChapter4(baseSave())},
  {id:'party-picker', label:'Выбор отряда', screen:'home', build:() => unlockChapter4(baseSave()), action:'[data-action="open-party-picker"]', expectModal:true},

  {id:'c2-intro', label:'Глава 2 · вступление', screen:'chapter2', build:() => chapter2Save('intro')},
  {id:'c2-home', label:'Глава 2 · дом родителей', screen:'chapter2', build:() => chapter2Save('home')},
  {id:'c2-home-help', label:'Глава 2 · подсказка', screen:'chapter2', build:() => chapter2Save('home'), action:'[data-action="ux-help"]', expectModal:true},
  {id:'c2-investigation', label:'Глава 2 · расследование', screen:'chapter2', build:() => chapter2Save('investigation')},
  {id:'c2-investigation-coach-point', label:'Глава 2 · подсказка выбора объекта', screen:'chapter2', build:() => enableCoach(chapter2Save('investigation')), expectCoach:true},
  {id:'c2-investigation-coach-method', label:'Глава 2 · подсказка выбора метода', screen:'chapter2', build:() => {
    const save = enableCoach(chapter2Save('investigation'));
    save.chapter2.rework.selectedPoint = 'witness';
    return save;
  }, expectCoach:true},
  {id:'c2-investigation-coach-ready', label:'Глава 2 · подсказка готовности вывода', screen:'chapter2', build:() => enableCoach(fillChapter2Evidence(chapter2Save('investigation'))), expectCoach:true},
  {id:'c2-deduction', label:'Глава 2 · доска выводов', screen:'chapter2', build:() => fillChapter2Evidence(chapter2Save('deduction'))},
  {id:'c2-danger', label:'Глава 2 · опасная сцена', screen:'chapter2', build:() => {
    const save = fillChapter2Evidence(chapter2Save('danger'));
    save.chapter2.rework.danger.selected = ['witness','hairpin'];
    return save;
  }},
  {id:'c2-alchemy', label:'Глава 2 · алхимия', screen:'chapter2', build:() => chapter2Save('alchemy')},
  {id:'c2-alchemy-coach', label:'Глава 2 · подсказка алхимии', screen:'chapter2', build:() => enableCoach(chapter2Save('alchemy')), expectCoach:true},
  {id:'c2-alchemy-result', label:'Глава 2 · результат алхимии', screen:'chapter2', build:() => {
    const save = fillChapter2Evidence(chapter2Save('alchemy_result'));
    save.chapter2.alchemy = {order:['water','salt','lavender'], temp:'mid', stopped:true, charge:64, quality:'excellent', score:6};
    return save;
  }},
  {id:'c2-battle-hero', label:'Глава 2 · бой героя', screen:'chapter2', build:() => fillChapter2Evidence(chapter2Save('battle')), after:a => {
    a.getSave().chapter2.battle = a.createC2BattleState();
  }},
  {id:'c2-battle-morven', label:'Глава 2 · бой Морвена', screen:'chapter2', build:() => fillChapter2Evidence(chapter2Save('battle')), after:a => {
    const battle = a.createC2BattleState();
    battle.tab = 'morven';
    battle.resonance = 4;
    a.getSave().chapter2.battle = battle;
  }},
  {id:'c2-choice', label:'Глава 2 · выбор', screen:'chapter2', build:() => chapter2Save('choice')},
  {id:'c2-return', label:'Глава 2 · возвращение', screen:'chapter2', build:() => {
    const save = chapter2Save('return');
    save.chapter2.ending = 'save';
    return save;
  }},
  {id:'c2-summon', label:'Глава 2 · договор', screen:'chapter2', build:() => {
    const save = chapter2Save('summon');
    save.chapter2.ending = 'save';
    return save;
  }},
  {id:'c2-summary', label:'Глава 2 · итог', screen:'chapter2', build:() => {
    const save = chapter2Save('summary');
    save.chapter2.ending = 'save';
    save.chapter2.alchemy.quality = 'excellent';
    save.progression.chapters.chapter_02_roots_of_memory = {status:'completed', progress:100};
    return save;
  }},

  {id:'incident-brief', label:'Дело района · вводная', screen:'incident', build:() => unlockChapter3(baseSave())},
  {id:'incident-investigation', label:'Дело района · расследование', screen:'incident', build:() => {
    const save = unlockChapter3(baseSave());
    save.incidents.bus_stop_flowers.stage = 'investigation';
    save.incidents.bus_stop_flowers.status = 'in_progress';
    return save;
  }},
  {id:'incident-preparation', label:'Дело района · подготовка', screen:'incident', build:() => {
    const save = unlockChapter3(baseSave());
    const incident = save.incidents.bus_stop_flowers;
    incident.stage = 'preparation';
    incident.status = 'in_progress';
    incident.clues = {roots:true, recording:true, witness:true, cache:false};
    incident.approach = 'cleanse';
    return save;
  }},
  {id:'incident-battle', label:'Дело района · бой', screen:'incident', build:() => {
    const save = unlockChapter3(baseSave());
    save.incidents.bus_stop_flowers.stage = 'battle';
    save.incidents.bus_stop_flowers.status = 'in_progress';
    save.incidents.bus_stop_flowers.approach = 'cleanse';
    return save;
  }, after:a => {
    a.getSave().incidents.bus_stop_flowers.battle = a.createIncidentBattle();
  }},
  {id:'incident-result', label:'Дело района · итог', screen:'incident', build:() => {
    const save = unlockChapter3(baseSave());
    const incident = save.incidents.bus_stop_flowers;
    incident.stage = 'result';
    incident.status = 'completed';
    incident.result = 'cleanse';
    incident.runs = 1;
    save.codex.creatures.memorial_ivy = {knowledge:2, max:3};
    save.meta.incidentHistory = [{id:'bus_stop_flowers', result:'cleanse', coins:30, xp:20, at:new Date().toISOString()}];
    return save;
  }},

  {id:'c3-intro', label:'Глава 3 · вступление', screen:'chapter3', build:() => chapter3Save('intro')},
  {id:'c3-meeting', label:'Глава 3 · разговор', screen:'chapter3', build:() => chapter3Save('meeting')},
  {id:'c3-investigation', label:'Глава 3 · расследование', screen:'chapter3', build:() => chapter3Save('investigation')},
  {id:'c3-investigation-help', label:'Глава 3 · подсказка', screen:'chapter3', build:() => chapter3Save('investigation'), action:'[data-action="ux6-help"]', expectModal:true},
  {id:'c3-deduction', label:'Глава 3 · доска выводов', screen:'chapter3', build:() => fillChapter3Evidence(chapter3Save('deduction'))},
  {id:'c3-training', label:'Глава 3 · обучение Щиту', screen:'chapter3', build:() => {
    const save = fillChapter3Evidence(chapter3Save('training'));
    save.chapter3.rework6.hypothesisConfirmed = true;
    save.chapter3.rework6.hypothesisCorrect = true;
    return save;
  }},
  {id:'c3-danger', label:'Глава 3 · опасная сцена', screen:'chapter3', build:() => {
    const save = fillChapter3Evidence(chapter3Save('danger'));
    save.chapter3.rework6.danger.selected = ['technician','beacon'];
    return save;
  }},
  {id:'c3-brief', label:'Глава 3 · подготовка', screen:'chapter3', build:() => {
    const save = fillChapter3Evidence(chapter3Save('brief'));
    save.chapter3.plan = 'technician';
    save.chapter3.rework6.bonuses = {sourceKnown:true, wardReduction:1, technicianShield:1, beaconMax:1};
    return save;
  }},
  {id:'c3-battle', label:'Глава 3 · бой', screen:'chapter3', build:() => {
    const save = fillChapter3Evidence(chapter3Save('battle'));
    save.chapter3.plan = 'technician';
    return save;
  }, after:a => {
    a.getSave().chapter3.battle = a.createChapter3Battle();
  }},
  {id:'c3-amulet', label:'Глава 3 · выбор после боя', screen:'chapter3', build:() => chapter3Save('amulet')},
  {id:'c3-registration', label:'Глава 3 · регистрация', screen:'chapter3', build:() => {
    const save = chapter3Save('registration');
    save.chapter3.amulet = 'save';
    return save;
  }},
  {id:'c3-final', label:'Глава 3 · итог', screen:'chapter3', build:() => {
    const save = chapter3Save('final');
    save.chapter3.amulet = 'save';
    save.chapter3.registration = 'conditional';
    save.relationships.liora = {trust:5, label:'Союзница'};
    return save;
  }},

  {id:'c4-intro', label:'Глава 4 · вступление', screen:'chapter4', build:() => chapter4Save('intro')},
  {id:'c4-meeting', label:'Глава 4 · разговор', screen:'chapter4', build:() => chapter4Save('meeting')},
  {id:'c4-investigation', label:'Глава 4 · расследование', screen:'chapter4', build:() => chapter4Save('investigation')},
  {id:'c4-deduction', label:'Глава 4 · диагноз', screen:'chapter4', build:() => fillChapter4Evidence(chapter4Save('deduction'))},
  {id:'c4-formula', label:'Глава 4 · формула', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('formula'));
    save.chapter4.diagnosis = 'tampering';
    return save;
  }},
  {id:'c4-alchemy', label:'Глава 4 · алхимия', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('alchemy'));
    save.chapter4.diagnosis = 'tampering';
    save.chapter4.recipeChoice = 'bitter';
    return save;
  }},
  {id:'c4-alchemy-result', label:'Глава 4 · результат алхимии', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('alchemy'));
    save.chapter4.diagnosis = 'tampering';
    save.chapter4.recipeChoice = 'bitter';
    save.chapter4.alchemy = {order:['moonwater','ash','mint'], temp:'mid', charge:65, quality:'excellent', score:6};
    return save;
  }},
  {id:'c4-brief', label:'Глава 4 · подготовка', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('brief'));
    save.chapter4.diagnosis = 'tampering';
    save.chapter4.recipeChoice = 'bitter';
    save.chapter4.alchemy = {order:['moonwater','ash','mint'], temp:'mid', charge:65, quality:'excellent', score:6};
    return save;
  }},
  ...['hero','celeste','liora'].map(tab => ({
    id:`c4-battle-${tab}`,
    label:`Глава 4 · бой · ${tab}`,
    screen:'chapter4',
    build:() => {
      const save = fillChapter4Evidence(chapter4Save('battle'));
      save.chapter4.diagnosis = 'tampering';
      save.chapter4.recipeChoice = 'bitter';
      save.chapter4.alchemy = {order:['moonwater','ash','mint'], temp:'mid', charge:65, quality:'excellent', score:6};
      return save;
    },
    after:a => {
      const battle = a.createChapter4Battle();
      battle.tab = tab;
      a.getSave().chapter4.battle = battle;
    }
  })),
  {id:'c4-battle-help', label:'Глава 4 · подсказка боя', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('battle'));
    save.chapter4.diagnosis = 'tampering';
    save.chapter4.recipeChoice = 'bitter';
    save.chapter4.alchemy = {order:['moonwater','ash','mint'], temp:'mid', charge:65, quality:'excellent', score:6};
    return save;
  }, after:a => {
    a.getSave().chapter4.battle = a.createChapter4Battle();
  }, action:'[data-action="c4-help"]', expectModal:true},
  {id:'c4-choice', label:'Глава 4 · финальный выбор', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('choice'));
    save.chapter4.diagnosis = 'tampering';
    save.chapter4.recipeChoice = 'bitter';
    save.chapter4.alchemy = {order:['moonwater','ash','mint'], temp:'mid', charge:65, quality:'excellent', score:6};
    return save;
  }},
  {id:'c4-final', label:'Глава 4 · итог', screen:'chapter4', build:() => {
    const save = fillChapter4Evidence(chapter4Save('final'));
    save.chapter4.status = 'completed';
    save.chapter4.diagnosis = 'tampering';
    save.chapter4.recipeChoice = 'bitter';
    save.chapter4.alchemy = {order:['moonwater','ash','mint'], temp:'mid', charge:65, quality:'excellent', score:6};
    save.chapter4.finalChoice = 'hide';
    save.chapter4.rewarded = true;
    save.relationships.celeste = {trust:6, label:'Прочное доверие'};
    save.progression.chapters.chapter_04_bitter_recipe = {status:'completed', progress:100};
    return save;
  }}
];

const scenarioMap = new Map(scenarios.map(scenario => [scenario.id, scenario]));
const collectedAssetUrls = new Set();

function visible(node) {
  if (!node?.isConnected) return false;
  if (node.closest('.battle-original-tabs-hidden,[aria-hidden="true"]')) return false;
  const style = getComputedStyle(node);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const rect = node.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function activeInteractionScope() {
  const modal = document.querySelector('#modal-root .modal-backdrop,#modal-root .modal');
  return modal && visible(modal) ? document.getElementById('modal-root') : document.getElementById('app');
}

function actionSignature(node) {
  const action = node.dataset.action;
  if (!action) return null;
  const data = Object.entries(node.dataset)
    .filter(([key]) => !['mobileDecoration','qaFallbackBound','artv2','vpDone'].includes(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('|');
  return data || `action=${action}`;
}

function collectAssets() {
  document.querySelectorAll('img').forEach(image => {
    if (image.currentSrc || image.src) collectedAssetUrls.add(image.currentSrc || image.src);
  });
  document.querySelectorAll('#app *,#modal-root *').forEach(node => {
    const background = getComputedStyle(node).backgroundImage;
    for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      if (!match[1].startsWith('data:')) collectedAssetUrls.add(new URL(match[1], location.href).href);
    }
  });
}

function visualAudit(scope) {
  const findings = [];
  const label = node => (node.innerText || node.getAttribute('aria-label') || node.className || node.tagName)
    .replace(/\s+/g, ' ').trim().slice(0, 72);
  const inViewport = node => {
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  };

  scope.querySelectorAll('h1,h2,h3,.primary-button,.secondary-button,.c2-action,.c3-action,.c4-action,.inc-action,.screen-header p,.c2-top small,.c3-top small,.c4-top small,.inc-top small').forEach(node => {
    if (!visible(node)) return;
    const style = getComputedStyle(node);
    const actionCard = node.matches('.c2-action,.c3-action,.c4-action,.inc-action');
    const rect = node.getBoundingClientRect();
    const textChildren = actionCard ? [...node.querySelectorAll('b,span,small')] : [];
    const childOutsideX = child => {
      const childRect = child.getBoundingClientRect();
      return childRect.left < rect.left - 1 || childRect.right > rect.right + 1;
    };
    const childOutsideY = child => {
      const childRect = child.getBoundingClientRect();
      return childRect.top < rect.top - 1 || childRect.bottom > rect.bottom + 1;
    };
    const clippedX = actionCard ? textChildren.some(childOutsideX) : node.scrollWidth > node.clientWidth + 2;
    const clippedY = actionCard ? textChildren.some(childOutsideY) : node.scrollHeight > node.clientHeight + 2;
    const clips = /(hidden|clip)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`) || style.textOverflow === 'ellipsis';
    if (clips && (clippedX || clippedY)) {
      findings.push(`Обрезан текст ${Math.round(node.clientWidth)}×${Math.round(node.clientHeight)}: ${label(node)}`);
    }
  });

  scope.querySelectorAll('button,small,.eyebrow,.tag,.progress-caption,.c2-chip,.c3-chip,.c4-chip').forEach(node => {
    if (!visible(node) || !inViewport(node)) return;
    const size = Number.parseFloat(getComputedStyle(node).fontSize);
    if (size > 0 && size < 9) findings.push(`Слишком мелкий текст ${size.toFixed(1)}px: ${label(node)}`);
  });

  const scrollRegions = [...scope.querySelectorAll('*')].filter(node => {
    if (!visible(node) || node.scrollHeight <= node.clientHeight + 8) return false;
    return /(auto|scroll)/.test(getComputedStyle(node).overflowY);
  });
  const allowedRoots = new Set(['screen','main-content','c2-main','c3-main','c4-main','inc-main','modal-body','screen-scroll']);
  const nested = scrollRegions.filter(node => ![...allowedRoots].some(name => node.classList.contains(name)));
  nested.forEach(node => findings.push(`Вложенная прокрутка ${node.clientHeight}/${node.scrollHeight}px: ${label(node)}`));

  scope.querySelectorAll('img').forEach(image => {
    if (!visible(image) || !image.complete || !image.naturalWidth) return;
    const rect = image.getBoundingClientRect();
    if (rect.width < 80 || rect.height < 60) return;
    const naturalRatio = image.naturalWidth / image.naturalHeight;
    const displayRatio = rect.width / rect.height;
    const distortion = Math.max(naturalRatio / displayRatio, displayRatio / naturalRatio);
    if (distortion > 1.45 && getComputedStyle(image).objectFit === 'fill') {
      findings.push(`Искажено изображение ×${distortion.toFixed(2)}: ${image.alt || image.currentSrc || image.src}`);
    }
  });

  scope.querySelectorAll('article,section,.card,.panel').forEach(node => {
    if (!visible(node) || !inViewport(node)) return;
    const rect = node.getBoundingClientRect();
    if (rect.height < 220 || rect.width < 180) return;
    const style = getComputedStyle(node);
    const hasArtwork = node.querySelector('img,svg,canvas,video') || /url\(/.test(style.backgroundImage);
    const textLength = (node.innerText || '').replace(/\s+/g, '').length;
    if (!hasArtwork && textLength < 45) findings.push(`Крупный почти пустой блок ${Math.round(rect.width)}×${Math.round(rect.height)}: ${label(node)}`);
  });

  return [...new Set(findings)].slice(0, 30);
}

function auditCurrentScenario(scenario) {
  const failures = [];
  const warnings = [];
  const scope = activeInteractionScope();
  const text = document.body.innerText;
  const forbidden = [
    /PWA Asset Build/i,
    /Visible Art Pass/i,
    /Project v\d/i,
    /мобильный fallback/i,
    /технический тест/i,
    /тестовый кристалл/i
  ];

  forbidden.forEach(pattern => {
    if (pattern.test(text)) failures.push(`Видимый технический текст: ${pattern.source}`);
  });

  const signatures = new Map();
  const intentionallyRepeatedActions = new Set([
    'close-modal','navigate','chapter2-pause','chapter3-pause','c4-pause'
  ]);
  scope.querySelectorAll('[data-action]').forEach(node => {
    if (!visible(node)) return;
    if (intentionallyRepeatedActions.has(node.dataset.action)) return;
    const signature = actionSignature(node);
    if (!signature) return;
    const list = signatures.get(signature) || [];
    list.push(node);
    signatures.set(signature, list);
  });
  signatures.forEach((nodes, signature) => {
    if (nodes.length > 1) {
      const labels = nodes.map(node => (node.innerText || node.getAttribute('aria-label') || '').trim()).join(' / ');
      failures.push(`Дублированное действие ${signature}: ${labels}`);
    }
  });

  const ids = new Map();
  document.querySelectorAll('[id]').forEach(node => {
    const list = ids.get(node.id) || [];
    list.push(node);
    ids.set(node.id, list);
  });
  ids.forEach((nodes, id) => {
    if (nodes.length > 1) failures.push(`Повторяющийся id="${id}" (${nodes.length})`);
  });

  document.querySelectorAll('img').forEach(image => {
    if (image.complete && image.naturalWidth === 0) {
      failures.push(`Не загрузилось изображение: ${image.currentSrc || image.src}`);
    }
  });

  if (document.documentElement.scrollWidth > innerWidth + 2) {
    failures.push(`Горизонтальный выход страницы: ${document.documentElement.scrollWidth}px при viewport ${innerWidth}px`);
  }

  document.querySelectorAll('.c2-main,.c3-main,.c4-main,.inc-main').forEach(main => {
    if (!visible(main)) return;
    if (main.scrollWidth > main.clientWidth + 2) {
      failures.push(`Горизонтальный выход ${main.className}: ${main.scrollWidth}px > ${main.clientWidth}px`);
    }
    const style = getComputedStyle(main);
    if (main.scrollHeight > main.clientHeight + 4 && !/(auto|scroll)/.test(style.overflowY)) {
      failures.push(`Недоступный вертикальный контент в ${main.className}: overflow-y=${style.overflowY}`);
    }
  });

  scope.querySelectorAll('button,[role="button"],a[href]').forEach(control => {
    if (!visible(control)) return;
    const label = (control.innerText || control.getAttribute('aria-label') || control.getAttribute('title') || '').trim();
    if (!label) failures.push(`Элемент без доступного названия: ${control.outerHTML.slice(0, 120)}`);

    const rect = control.getBoundingClientRect();
    const disabled = control.matches(':disabled,[aria-disabled="true"]');
    const inViewport = rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    if (!inViewport) return;

    const x = Math.min(innerWidth - 1, Math.max(0, rect.left + rect.width / 2));
    const y = Math.min(innerHeight - 1, Math.max(0, rect.top + rect.height / 2));
    let centerIsVisible = true;
    for (let parent = control.parentElement; parent && parent !== scope; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      if (!/(auto|scroll|hidden|clip)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`)) continue;
      const parentRect = parent.getBoundingClientRect();
      if (x < parentRect.left || x > parentRect.right || y < parentRect.top || y > parentRect.bottom) {
        centerIsVisible = false;
        break;
      }
    }
    if (!disabled && centerIsVisible) {
      const stack = document.elementsFromPoint(x, y);
      if (!stack.some(node => node === control || control.contains(node))) {
        failures.push(`Кнопка перекрыта: ${label.slice(0, 70)}`);
      }
    }

    if (!disabled && (rect.width < 40 || rect.height < 40)) {
      warnings.push(`Маленькая touch-цель ${Math.round(rect.width)}×${Math.round(rect.height)}: ${label.slice(0, 60)}`);
    }
  });

  if (scenario.expectModal) {
    const modal = document.querySelector('#modal-root .modal,#modal-root [role="dialog"]');
    if (!modal || !visible(modal)) {
      failures.push('Ожидаемая подсказка/модальное окно не открылось');
    } else {
      const rect = modal.getBoundingClientRect();
      if (rect.left < -1 || rect.right > innerWidth + 1 || rect.top < -1 || rect.bottom > innerHeight + 1) {
        failures.push(`Модальное окно выходит за viewport: ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      }
      if (!modal.querySelector('[data-action="close-modal"]')) failures.push('У модального окна нет доступной кнопки закрытия');
    }
  }

  if (scenario.expectCoach) {
    const coach = document.querySelector('.ux-coach-card-banner');
    if (!coach || !visible(coach)) {
      failures.push('Ожидаемая контекстная подсказка не показана');
    } else {
      const parent = coach.parentElement;
      if (!parent?.matches('.c2-main,.c3-main,.c4-main,.inc-main,.screen,.modal-body,.main-content')) {
        failures.push(`Подсказка вставлена в небезопасный контейнер: ${parent?.className || parent?.tagName}`);
      }
      const coachRect = coach.getBoundingClientRect();
      const footer = document.querySelector('.c2-footer,.c3-footer,.c4-footer,.inc-footer,.bottom-nav');
      if (footer && visible(footer)) {
        const footerRect = footer.getBoundingClientRect();
        const overlap = coachRect.left < footerRect.right && coachRect.right > footerRect.left
          && coachRect.top < footerRect.bottom && coachRect.bottom > footerRect.top;
        if (overlap) failures.push('Контекстная подсказка перекрывает постоянный футер');
      }
    }
  }

  if (scenario.expectMorwenInFlow) {
    const bubble = document.querySelector('.morwen-bubble');
    if (!bubble || !visible(bubble)) {
      failures.push('Реплика Морвена не показана');
    } else if (bubble.closest('.home-scene') || ['absolute','fixed'].includes(getComputedStyle(bubble).position)) {
      failures.push('Реплика Морвена остаётся поверх домашней сцены');
    }
  }

  collectAssets();
  const visualWarnings = visualAudit(scope);
  return {
    id:scenario.id,
    label:scenario.label,
    viewport:`${innerWidth}x${innerHeight}`,
    failures:[...new Set(failures)],
    warnings:[...new Set(warnings)].slice(0, 12),
    visualWarnings,
    actions:scope.querySelectorAll('[data-action]').length,
    images:document.querySelectorAll('img').length
  };
}

async function runScenario(id) {
  const scenario = scenarioMap.get(id);
  if (!scenario) throw new Error(`Unknown UI audit scenario: ${id}`);

  document.getElementById('modal-root').replaceChildren();
  const save = clone(scenario.build());
  if (scenario.start) {
    api.renderStart();
  } else {
    api.setSave(save, scenario.screen);
    scenario.after?.(api);
    api.render();
  }

  await waitFrames();

  if (scenario.action) {
    const action = document.querySelector(scenario.action);
    if (!action) {
      return {
        id:scenario.id,
        label:scenario.label,
        viewport:`${innerWidth}x${innerHeight}`,
        failures:[`Не найдена кнопка сценария: ${scenario.action}`],
        warnings:[],
        actions:0,
        images:0
      };
    }
    action.click();
    await waitFrames();
    await new Promise(resolve => setTimeout(resolve, 260));
  }

  return auditCurrentScenario(scenario);
}

function loadAsset(url) {
  return new Promise(resolve => {
    const image = new Image();
    const done = ok => resolve({url, ok});
    image.onload = () => done(image.naturalWidth > 0);
    image.onerror = () => done(false);
    image.src = url;
  });
}

async function runAll(options = {}) {
  const selected = options.ids?.length ? options.ids : scenarios.map(scenario => scenario.id);
  const results = [];
  for (const id of selected) results.push(await runScenario(id));

  const assetResults = await Promise.all([...collectedAssetUrls].map(loadAsset));
  const brokenAssets = assetResults.filter(result => !result.ok).map(result => result.url);
  const summary = {
    viewport:`${innerWidth}x${innerHeight}`,
    scenarios:results.length,
    passed:results.filter(result => result.failures.length === 0).length,
    failed:results.filter(result => result.failures.length > 0).length,
    warnings:results.reduce((sum, result) => sum + result.warnings.length, 0),
    visualWarnings:results.reduce((sum, result) => sum + (result.visualWarnings?.length || 0), 0),
    assetsChecked:assetResults.length,
    brokenAssets,
    results
  };
  globalThis.__uiAuditResult = summary;
  const resultNode = document.getElementById('ui-audit-result') || document.createElement('script');
  resultNode.id = 'ui-audit-result';
  resultNode.type = 'application/json';
  resultNode.textContent = JSON.stringify(summary);
  if (!resultNode.isConnected) document.body.appendChild(resultNode);
  document.documentElement.dataset.uiAuditStatus = 'done';
  return summary;
}

globalThis.__uiAudit = Object.freeze({
  scenarios:scenarios.map(({id, label, screen}) => ({id, label, screen})),
  auditCurrent(id) {
    const scenario = scenarioMap.get(id);
    if (!scenario) throw new Error(`Unknown UI audit scenario: ${id}`);
    return auditCurrentScenario(scenario);
  },
  runScenario,
  runAll
});

const autoAudit = new URLSearchParams(location.search).get('ui-audit');
if (autoAudit === 'all') {
  document.documentElement.dataset.uiAuditStatus = 'running';
  globalThis.__uiAuditReady = runAll().catch(error => {
    const resultNode = document.createElement('script');
    resultNode.id = 'ui-audit-result';
    resultNode.type = 'application/json';
    resultNode.textContent = JSON.stringify({fatal:String(error?.stack || error)});
    document.body.appendChild(resultNode);
    document.documentElement.dataset.uiAuditStatus = 'error';
    throw error;
  });
} else if (autoAudit && autoAudit !== '1') {
  document.documentElement.dataset.uiAuditStatus = 'running';
  globalThis.__uiAuditReady = runScenario(autoAudit).then(result => {
    const resultNode = document.createElement('script');
    resultNode.id = 'ui-audit-result';
    resultNode.type = 'application/json';
    resultNode.textContent = JSON.stringify(result);
    document.body.appendChild(resultNode);
    document.documentElement.dataset.uiAuditStatus = 'done';
    return result;
  });
}
