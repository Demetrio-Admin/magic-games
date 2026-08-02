/* Magic RPG — Nocturne Screen System v2
   One presentation runtime for every canonical engine state. Game rules and
   saves remain owned by app.js; this module owns layout, art and UI semantics. */
(() => {
  'use strict';

  const APP = document.getElementById('app');
  const SAVE_KEY = 'magicRpgVerticalSliceV1.save';
  const UI = 'assets/icons/ui/';
  const ART = Object.freeze({
    start: 'assets/art-v3/intro-hero.webp',
    home: 'assets/nocturne/main-house.webp',
    parents: 'assets/art-v3/parents-home.webp',
    apartment: 'assets/nocturne/memory-apartment.webp',
    shop: 'assets/art-v4/flower-shop.webp',
    yard: 'assets/art-v3/neighbor-yard.webp',
    alchemy: 'assets/art-v3/alchemy-lab.webp',
    busStop: 'assets/nocturne/bus-stop-flowers.webp',
    square: 'assets/nocturne/first-light-square.webp',
    archive: 'assets/nocturne/occult-study.webp',
    rooftop: 'assets/art-v4/first-light-rooftop.webp',
    warehouse: 'assets/nocturne/memory-warehouse.webp',
    greenhouse: 'assets/art-v4/occult-greenhouse.webp',
    c2Battle: 'assets/art-v3/ritual-battle.webp',
    c4Battle: 'assets/nocturne/mirror-sediment.webp',
    morven: 'assets/art-v3/morven.webp',
    liora: 'assets/art-v3/liora.webp',
    celeste: 'assets/art-v3/celeste.webp',
    nika: 'assets/art-v3/nika.webp',
    heroMale: 'assets/nocturne/hero-male.webp',
    heroFemale: 'assets/nocturne/hero-female.webp',
    telekinesis: 'assets/nocturne/spell-telekinesis.webp',
    shield: 'assets/nocturne/spell-shield.webp',
    search: 'assets/nocturne/spell-search.webp',
    banish: 'assets/nocturne/spell-banish.webp'
  });
  let queued = false;

  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clean = value => (value || '').replace(/\s+/g, ' ').trim();

  function profile() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null')?.profile || null; }
    catch { return null; }
  }

  function heroArt() {
    return profile()?.heroId === 'witch' ? ART.heroFemale : ART.heroMale;
  }

  function image(src, alt = '', className = '') {
    const node = document.createElement('img');
    node.src = src;
    node.alt = alt;
    node.decoding = 'async';
    if (className) node.className = className;
    if (!alt) node.setAttribute('aria-hidden', 'true');
    return node;
  }

  function removeLegacyDecoration() {
    all('.vp-art,.vp-art-v2,.vp-dust,.vp-morwen-mark,.vp-ivy-portrait,.vp-start-art,.vp-start-runes')
      .forEach(node => node.remove());
    document.body.classList.remove('visual-pass-v11', 'art-pass-v2', 'nocturne-ritual-v1');
    document.body.classList.add('nocturne-rebuild');
    document.documentElement.dataset.visualTheme = 'nocturne-rebuild-v2';
  }

  function artFrame(target, src, alt, position = 'center') {
    if (!target) return null;
    let frame = target.querySelector(':scope > .nr2-art');
    if (!frame) {
      frame = document.createElement('figure');
      frame.className = 'nr2-art';
      frame.append(image(src, alt));
      target.prepend(frame);
    } else {
      const img = frame.querySelector('img');
      if (img && !img.src.endsWith(src)) img.src = src;
    }
    frame.style.setProperty('--art-position', position);
    return frame;
  }

  function decorateStartAndHome() {
    const start = document.querySelector('.start-screen');
    if (start) {
      artFrame(start, ART.start, 'Герой на крыше ночного города', '52% 34%');
      const kicker = start.querySelector('.brand-kicker');
      const title = start.querySelector('.start-title');
      const subtitle = start.querySelector('.start-subtitle');
      const version = start.querySelector('.version-line');
      if (kicker) kicker.textContent = 'Magic RPG · Nocturne';
      if (title) title.innerHTML = 'Между светом<br>и тьмой';
      if (subtitle) subtitle.textContent = 'Город помнит каждую клятву. Расследуйте магические дела, готовьте ритуалы и сражайтесь вместе со спутниками.';
      if (version) version.textContent = 'Вертикальный срез · главы 2–4 · автосохранение';
      start.querySelector('.mobile-hardfix-banner')?.remove();
    }

    all('.home-scene').forEach(scene => {
      artFrame(scene, ART.home, 'Гостиная дома под защитным контуром', 'center');
      scene.querySelector('.cat')?.remove();
      const bubble = scene.querySelector(':scope > .morwen-bubble');
      if (bubble) {
        bubble.classList.add('morwen-bubble-flow');
        scene.after(bubble);
      }
    });
  }

  const SCENES = [
    ['.c2-visual.c2-room', ART.parents, 'Кабинет в доме родителей', 'center'],
    ['.ux-scene.apartment,.c2-location-scene.apartment', ART.apartment, 'Квартира свидетельницы', 'center'],
    ['.ux-scene.shop,.c2-location-scene.shop', ART.shop, 'Ночная цветочная лавка', 'center'],
    ['.ux-scene.yard,.c2-location-scene.yard,.c2-scene-yard', ART.yard, 'Двор с магическими корнями', 'center'],
    ['.c2-alchemy-hero', ART.alchemy, 'Алхимическая лаборатория', '62% center'],
    ['.ux-danger-scene', ART.yard, 'Опасная сцена во дворе', 'center'],
    ['.inc-hero', ART.busStop, 'Остановка с аномальными цветами', 'center'],
    ['.ux6-scene.square,.c3-scene', ART.square, 'Площадь Первого Света', 'center'],
    ['.ux6-scene.archive', ART.archive, 'Архив Ордена', 'center'],
    ['.ux6-scene.roof,.ux6-danger-scene,.ux6-training-scene', ART.rooftop, 'Ритуальный маяк на крыше', 'center'],
    ['.c4-hero', ART.alchemy, 'Подпольная лаборатория Селесты', '62% center'],
    ['.c4-invest-scene.warehouse', ART.warehouse, 'Склад поставщика', 'center'],
    ['.c4-invest-scene.lab', ART.alchemy, 'Алхимическая лаборатория', 'center'],
    ['.c4-invest-scene.greenhouse', ART.greenhouse, 'Оккультная теплица', 'center']
  ];

  function decorateScenes() {
    for (const [selector, src, alt, position] of SCENES) {
      all(selector).forEach(node => artFrame(node, src, alt, position));
    }
  }

  function portraitSource(node) {
    const text = clean(node.textContent).toLowerCase();
    if (text.includes('морвен') || text.includes('цели')) return ART.morven;
    if (text.includes('лиора')) return ART.liora;
    if (text.includes('селест')) return ART.celeste;
    if (text.includes('ника')) return ART.nika;
    return heroArt();
  }

  function putPortrait(node, src = portraitSource(node)) {
    if (!node) return;
    const existing = node.querySelector(':scope > img.nr2-portrait');
    if (existing) { if (!existing.src.endsWith(src)) existing.src = src; return; }
    node.querySelectorAll(':scope > svg,:scope > .artv2-portrait,:scope > .vp-art').forEach(x => x.remove());
    node.prepend(image(src, '', 'nr2-portrait'));
  }

  function decoratePortraits() {
    all('.companion-card').forEach(card => putPortrait(card.querySelector('.companion-portrait'), portraitSource(card)));
    all('.party-slot').forEach(slot => putPortrait(slot.querySelector('.party-avatar'), portraitSource(slot)));
    all('.hero-orb').forEach(node => putPortrait(node, heroArt()));
    all('.c2-morwen-portrait').forEach(node => putPortrait(node, ART.morven));
    all('.c3-liora').forEach(node => putPortrait(node, ART.liora));
    all('.c4-celeste').forEach(node => putPortrait(node, ART.celeste));
  }

  const NAV_ICONS = Object.freeze({
    'Дом': 'home', 'Дела': 'clipboard-list', 'Сумка': 'backpack',
    'Спутники': 'users-group', 'Журнал': 'notebook'
  });
  const POINT_LABELS = Object.freeze({
    wreath:'Изучить цветы из венка', photo:'Осмотреть фотографию', phone:'Прочитать сообщение', door:'Осмотреть дверь',
    witness:'Осмотреть свидетеля', dreamer:'Осмотреть свидетельницу', ledger:'Проверить журнал', soil:'Исследовать землю',
    dew:'Проверить лунную росу', hairpin:'Осмотреть заколку', roots:'Исследовать корни', technician:'Осмотреть техника',
    sigil:'Проверить печать', tear:'Исследовать разрыв', vantage:'Осмотреть точку наблюдения'
  });

  function iconForText(text) {
    const value = clean(text).toLowerCase();
    if (/настрой|сохран/.test(value)) return 'settings';
    if (/помощ|как побед|подсказ/.test(value)) return 'help-circle';
    if (/назад|вернуться|отложить/.test(value)) return 'arrow-left';
    if (/книга|кодекс|запис/.test(value)) return 'book-2';
    if (/лаборатор|алхими|смесь|рецепт/.test(value)) return 'flask';
    if (/отряд|спутник/.test(value)) return 'users-group';
    if (/поиск|исслед|раскры|анализ/.test(value)) return 'search';
    if (/щит|защит|эгид|контур/.test(value)) return 'shield';
    if (/бой|атака|удар|разорвать/.test(value)) return 'sword';
    if (/очищ|изгнан|печать|ритуал/.test(value)) return 'sparkles';
    if (/повтор|сброс|заново/.test(value)) return 'refresh';
    if (/герой|развит/.test(value)) return 'user-circle';
    if (/инвентар|сумк|предмет/.test(value)) return 'backpack';
    if (/цвет|растен|корн|семя/.test(value)) return 'leaf';
    return '';
  }

  function putIcon(node, name, className = 'nr2-ui-icon') {
    if (!node || !name) return;
    node.querySelectorAll(':scope > svg').forEach(svg => svg.remove());
    if (node.querySelector(`:scope > img.${className}`)) return;
    node.prepend(image(`${UI}${name}.svg`, '', className));
  }

  function replaceWithIcon(node, name, className = 'nr2-ui-icon') {
    if (!node) return;
    const existing = node.querySelector(`:scope > img.${className}`);
    if (existing && existing.src.endsWith(`${name}.svg`) && node.children.length === 1) return;
    node.replaceChildren();
    putIcon(node, name, className);
  }

  function decorateIcons() {
    all('.nav-button').forEach(button => putIcon(button, NAV_ICONS[clean(button.querySelector('span')?.textContent)] || 'home', 'nr2-nav-icon'));
    all('.icon-button').forEach(button => {
      if (!button.querySelector('img')) putIcon(button, iconForText(button.getAttribute('aria-label') || button.textContent) || 'help-circle');
    });
    all('.modal-close').forEach(button => {
      button.setAttribute('aria-label', 'Закрыть');
      replaceWithIcon(button, 'x');
    });
    all('.c2-back,.c3-back,.c4-back,.inc-back').forEach(button => replaceWithIcon(button, 'arrow-left'));
    all('.c3-top>button:first-child,.inc-top>button:first-child').forEach(button => {
      if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', 'Вернуться домой');
      replaceWithIcon(button, 'arrow-left');
    });
    all('.quick-card,.room-card,.debug-button').forEach(button => putIcon(button, iconForText(button.textContent)));
    all('.c2-hotspot,.ux-hotspot,.ux6-hotspot,.c4-point').forEach(button => {
      const name = button.classList.contains('done') ? 'check' : 'search';
      if (button.matches('.c4-point')) {
        button.querySelector(':scope > i')?.remove();
        putIcon(button, name, 'nr2-hotspot-icon');
      } else {
        const point = button.dataset.key || button.dataset.point || '';
        if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', POINT_LABELS[point] || 'Осмотреть объект');
        replaceWithIcon(button, name, 'nr2-hotspot-icon');
      }
    });
    all('.c2-invest-icon,.inc-clue-icon,.c3-invest-icon').forEach(node => {
      replaceWithIcon(node, node.closest('button')?.classList.contains('done') ? 'check' : iconForText(node.closest('button')?.textContent) || 'search');
    });
    all('.c2-moon').forEach(node => replaceWithIcon(node, 'sparkles'));
    all('.c2-potion-result>div,.c4-result-glyph,.c3-result-glyph,.inc-result-glyph').forEach(node => replaceWithIcon(node, 'flask'));
    all('.codex-glyph').forEach(node => replaceWithIcon(node, 'book-2'));
    all('.c4-recipe>div').forEach(node => replaceWithIcon(node, iconForText(node.parentElement?.textContent) || 'flask'));
    all('.spell-symbol').forEach(node => replaceWithIcon(node, /очищ/i.test(node.parentElement?.textContent || '') ? 'flask' : 'sword'));
  }

  function spellFor(node) {
    const text = clean(node.textContent).toLowerCase();
    if (/телекин|рассеч|оскол|разорвать/.test(text)) return ART.telekinesis;
    if (/щит|эгид|защит|контур|барьер/.test(text)) return ART.shield;
    if (/поиск|раскры|источник|анализ|намерение/.test(text)) return ART.search;
    if (/изгнан|очищ|печать|финал|смесь|подавить/.test(text)) return ART.banish;
    return '';
  }

  function decorateBattle(root, src, alt) {
    if (!root) return;
    root.classList.add('nr2-battle');
    let figure = root.querySelector(':scope > .nr2-battle-art');
    if (!figure) {
      figure = document.createElement('figure');
      figure.className = 'nr2-battle-art';
      figure.append(image(src, alt));
      const objective = root.querySelector(':scope > .c2-ritual,:scope > .inc-ritual,:scope > .c3-objective,:scope > .c4-objective');
      if (objective) objective.after(figure); else root.prepend(figure);
    }
  }

  function decorateBattles() {
    all('.c2-battle').forEach(node => decorateBattle(node, ART.c2Battle, 'Памятный плющ в ритуальном круге'));
    all('.inc-battle').forEach(node => decorateBattle(node, ART.busStop, 'Цветочная аномалия на остановке'));
    all('.ux6-battle-layout,.c3-invest').filter(node => node.querySelector('.c3-arena')).forEach(node => decorateBattle(node, ART.rooftop, 'Угроза у маяка Первого Света'));
    all('.c4-battle').forEach(node => decorateBattle(node, ART.c4Battle, 'Зеркальный осадок в лаборатории'));

    all('.c2-team > *, .inc-party > *, .c3-units > *, .c4-team > *').forEach(node => {
      node.classList.add('nr2-actor-tab');
      putPortrait(node, portraitSource(node));
    });
    all('.c2-action,.inc-action,.c3-action,.c4-action').forEach(button => {
      button.classList.add('nr2-action-card');
      const src = spellFor(button);
      if (src && !button.querySelector(':scope > .nr2-spell-art')) button.prepend(image(src, '', 'nr2-spell-art'));
    });
    document.querySelectorAll('.c2-ivy,.c3-enemy,.c3-tech,.c3-beacon,.c4-enemy-mark,.inc-flower').forEach(node => node.setAttribute('aria-hidden', 'true'));
  }

  function normalizeCoach() {
    const coach = document.querySelector('.ux-coach-card');
    if (!coach) return;
    const host = document.querySelector('.c2-main,.c3-main,.c4-main,.inc-main') || document.querySelector('.screen,#screen-content,.modal-body');
    if (host && coach.parentElement !== host) host.prepend(coach);
    coach.classList.add('nr2-coach');
    coach.setAttribute('role', 'status');
  }

  function normalizeShells() {
    all('.c2-shell,.c3-shell,.c4-shell,.inc-shell').forEach(node => node.classList.add('nr2-chapter-shell'));
    all('.c2-main,.c3-main,.c4-main,.inc-main,#screen-content').forEach(node => node.classList.add('nr2-scroll-region'));
    document.querySelector('#screen-content')?.classList.add('main-content');
    all('.c2-footer,.c3-footer,.c4-footer,.inc-footer').forEach(node => node.classList.add('nr2-action-bar'));
    all('.card,.c2-story,.c2-recipe,.c2-alchemy-body,.c2-ritual,.c2-action-panel,.inc-ritual,.inc-actions-wrap,.c3-objective,.c3-invest,.c4-panel,.c4-objective,.c4-action-panel')
      .forEach(node => node.classList.add('nr2-surface'));
    all('button').forEach(button => {
      if (!button.getAttribute('type')) button.type = 'button';
      if (button.disabled) button.setAttribute('aria-disabled', 'true');
    });
  }

  function apply() {
    queued = false;
    removeLegacyDecoration();
    normalizeShells();
    decorateStartAndHome();
    decorateScenes();
    decoratePortraits();
    decorateIcons();
    decorateBattles();
    normalizeCoach();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }

  addEventListener('DOMContentLoaded', () => {
    apply();
    if (APP) new MutationObserver(schedule).observe(APP, {childList: true, subtree: true});
    const modal = document.getElementById('modal-root');
    if (modal) new MutationObserver(schedule).observe(modal, {childList: true, subtree: true});
    addEventListener('resize', schedule, {passive: true});
    setTimeout(apply, 250);
  });
})();
