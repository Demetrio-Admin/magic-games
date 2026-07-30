(() => {
  'use strict';

  const VERSION = '1.0.0';
  const app = document.getElementById('app');
  if (!app) return;

  const ROOM_LABELS = {
    laboratory: ['Лаборатория', 'Алхимическая мастерская', 'Рецепты, материалы и готовые смеси собраны в одном более читаемом пространстве.', '⚗'],
    codex: ['Кабинет', 'Книга Теней', 'Записи о существах, наблюдения и слабые места оформлены как отдельное исследовательское пространство.', '✦'],
    hero: ['Ритуальный круг', 'Дар героя', 'Развитие способностей и синергия даров поданы как отдельная комната подготовки.', '◎'],
    inventory: ['Хранилище', 'Инвентарь и материалы', 'Расходники, ключевые предметы и награды собраны в понятную сетку.', '▣'],
    companions: ['Гостиная отряда', 'Спутники и команда', 'Выбор спутников и их роли теперь читаются как часть домашнего пространства.', '✧']
  };

  function text(node) {
    return (node?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function visible(node) {
    if (!node || !node.isConnected) return false;
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function currentRoot() {
    return document.querySelector('#screen-content > .screen,.game-shell > .screen,.c2-shell,.c3-shell,.c4-shell,.inc-shell');
  }

  function classifyScreen(root) {
    const h1 = text(root?.querySelector('h1,.screen-header h1'));
    const t = h1.toLowerCase();
    if (/дом родителей/.test(t)) return 'c2-home';
    if (/лаборатор/.test(t)) return 'laboratory';
    if (/книга|тени|кодекс/.test(t)) return 'codex';
    if (/дар героя|герой/.test(t)) return 'hero';
    if (/инвентар/.test(t)) return 'inventory';
    if (/спутник|отряд/.test(t)) return 'companions';
    if (root?.querySelector('.recipe-card')) return 'laboratory';
    if (root?.querySelector('.codex-card')) return 'codex';
    if (root?.querySelector('.hero-panel,.spell-grid')) return 'hero';
    if (root?.querySelector('.inventory-grid')) return 'inventory';
    if (root?.querySelector('.companion-list,.party-strip')) return 'companions';
    return 'other';
  }

  function hideMalformedFragments(root) {
    [...root.querySelectorAll('div,section,article,aside,p')].forEach(node => {
      if (node.classList.contains('qa-hide-malformed')) return;
      const tx = text(node);
      if (!tx) return;
      const noInteractive = !node.querySelector('button,input,a,[role="button"]');
      if (
        noInteractive &&
        (tx === 'поверх атмосферной сцены.' ||
         tx.endsWith('поверх атмосферной сцены.') ||
         tx.includes('Мобильный fallback: отмечает обязательные осмотры') ||
         (tx.length < 34 && /атмосферной сцены/.test(tx)))
      ) {
        node.classList.add('qa-hide-malformed');
      }
    });
  }

  function ensureSceneContainers(root) {
    root.querySelectorAll('.c2-scene,.c3-scene,.c4-scene,.scene,.home-scene').forEach(scene => {
      scene.classList.add('qa-scene');
      const style = getComputedStyle(scene);
      const hasBg = style.backgroundImage && style.backgroundImage !== 'none';
      const hasMedia = !!scene.querySelector('img,picture,canvas,video');
      if (!hasBg && !hasMedia && !scene.querySelector('.qa-scene-fallback')) {
        const fb = document.createElement('div');
        fb.className = 'qa-scene-fallback qa-scene-fallback--memory';
        scene.prepend(fb);
      }
    });
  }

  function normalizeFooters(root, kind) {
    root.querySelectorAll('.c2-footer,.c3-footer,.c4-footer,.inc-footer').forEach(footer => {
      const buttons = [...footer.querySelectorAll('button,.primary-button')];
      buttons.forEach(btn => {
        if ((text(btn).length > 22) || /отправиться|продолжить|завершить|очистить|перейти/i.test(text(btn))) {
          btn.classList.add('qa-normal-button');
        }
      });

      const hasHelper = !!footer.querySelector('.c2hf-helper-shell,.qa-helper-shell');
      if (hasHelper || kind === 'c2-home') {
        footer.classList.add('qa-footer-two-col');
      }
    });
  }

  function helperAction(root) {
    return [...root.querySelectorAll('button,[role="button"]')].find(btn =>
      /отметить обязательные/i.test(text(btn))
    ) || null;
  }

  function insertGenericHelper(root) {
    const footer = root.querySelector('.c2-footer,.c3-footer,.c4-footer,.inc-footer');
    if (!footer || footer.querySelector('.qa-helper-shell,.c2hf-helper-shell')) return;
    const action = helperAction(root);
    if (!action) return;

    const shell = document.createElement('div');
    shell.className = 'qa-helper-shell';
    const card = document.createElement('section');
    card.className = 'qa-helper-card';
    card.innerHTML = `
      <b>Если интерактивная точка неудобна</b>
      <p>Можно использовать крупную вспомогательную кнопку. Она запускает то же игровое действие, но без охоты за пикселями.</p>
    `;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Отметить обязательные точки';
    btn.addEventListener('click', () => { if (!action.disabled) action.click(); });
    card.appendChild(btn);
    shell.appendChild(card);
    footer.prepend(shell);
  }

  function ensureRoomHero(root, screen) {
    const label = ROOM_LABELS[screen];
    if (!label) return;
    if (root.querySelector('.rx-room-hero,.qa-room-hero,.home-scene')) return;

    const [kicker, title, subtitle, icon] = label;
    const hero = document.createElement('section');
    hero.className = 'qa-room-hero';
    hero.dataset.qaIcon = icon;
    hero.innerHTML = `
      <span class="qa-room-kicker">Комната · ${kicker}</span>
      <h2>${title}</h2>
      <p>${subtitle}</p>
    `;
    const header = root.querySelector('.screen-header');
    if (header) header.insertAdjacentElement('afterend', hero);
    else root.prepend(hero);
  }

  function makeChecklistButtons(root) {
    root.querySelectorAll('.c2-check,.c3-check').forEach((item) => {
      if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
      if (!item.hasAttribute('tabindex')) item.tabIndex = item.classList.contains('done') ? -1 : 0;
    });
  }

  function bindChecklistFallback(root) {
    const action = helperAction(root);
    if (!action) return;
    root.querySelectorAll('.c2-check[role="button"],.c3-check[role="button"]').forEach(item => {
      if (item.dataset.qaFallbackBound === 'true') return;
      item.dataset.qaFallbackBound = 'true';
      item.dataset.qaFallbackAction = 'true';
      const activate = (event) => {
        if (event.type === 'keydown' && !['Enter',' '].includes(event.key)) return;
        if (item.classList.contains('done')) return;
        event.preventDefault();
        if (!action.disabled) action.click();
      };
      item.addEventListener('click', activate);
      item.addEventListener('keydown', activate);
    });
  }

  function restoreImages(root) {
    root.querySelectorAll('img,picture source,canvas,video').forEach(node => {
      const el = node.tagName === 'SOURCE' ? node.parentElement : node;
      if (!el) return;
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
  }

  function normalizeModalControls() {
    document.querySelectorAll('.modal-close').forEach(button => {
      if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', 'Закрыть');
      button.type = 'button';
    });
  }

  function apply() {
    document.documentElement.dataset.rcQa = '1';
    document.body.classList.add('rc-qa-fixes-v1');
    normalizeModalControls();

    const root = currentRoot();
    if (!root) return;

    const kind = classifyScreen(root);
    document.body.dataset.rcQaScreen = kind;

    hideMalformedFragments(root);
    ensureSceneContainers(root);
    restoreImages(root);
    normalizeFooters(root, kind);
    if (kind === 'c2-home') insertGenericHelper(root);
    ensureRoomHero(root, kind);
    makeChecklistButtons(root);
    bindChecklistFallback(root);
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
  } else {
    schedule();
  }

  new MutationObserver(schedule).observe(app, {childList:true, subtree:true});
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) new MutationObserver(schedule).observe(modalRoot, {childList:true, subtree:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('orientationchange', schedule, {passive:true});

  window.__rcQaFixesV1 = Object.freeze({
    version: VERSION,
    refresh: schedule
  });
})();
