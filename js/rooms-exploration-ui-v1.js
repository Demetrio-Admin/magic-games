(() => {
  'use strict';

  const VERSION = '1.0.0';
  const app = document.getElementById('app');
  if (!app) return;

  const SCREEN_CONFIG = {
    home: {
      kind: 'home',
      eyebrow: 'Дом',
      title: 'Комнаты и подготовка',
      text: 'Дом снова ощущается как живое место: комнаты имеют свою роль, а действия внутри читаются как отдельные пространства.',
      metrics: ['Сюжет', 'Комнаты', 'Отряд'],
      rail: [
        ['Гостиная', 'Сюжет, советы Морвена и текущая цель'],
        ['Кабинет', 'Книга Теней и знания о существах'],
        ['Лаборатория', 'Рецепты, смеси и материалы']
      ]
    },
    laboratory: {
      kind: 'lab',
      eyebrow: 'Комната · Лаборатория',
      title: 'Алхимическая мастерская',
      text: 'Рецепты, материалы и готовые смеси собраны в одном более читаемом пространстве.',
      metrics: ['Рецепты', 'Материалы', 'Качество'],
      rail: [
        ['Подготовка', 'Проверить рецепт и материалы'],
        ['Смешивание', 'Собрать порядок ингредиентов'],
        ['Результат', 'Получить смесь и сохранить её']
      ]
    },
    codex: {
      kind: 'codex',
      eyebrow: 'Комната · Кабинет',
      title: 'Книга Теней',
      text: 'Сведения о существах, наблюдения и слабые места теперь выглядят как настоящая исследовательская комната.',
      metrics: ['Знания', 'Существа', 'Слабости'],
      rail: [
        ['Записи', 'Открытые существа и факты'],
        ['Подсказки', 'Что помогает в бою и расследовании'],
        ['Прогресс', 'Рост уровня знания']
      ]
    },
    hero: {
      kind: 'hero',
      eyebrow: 'Комната · Ритуальный круг',
      title: 'Дар героя',
      text: 'Развитие способностей оформлено как отдельное пространство практики, а не как сухой технический список.',
      metrics: ['Телекинез', 'Поиск', 'Щит'],
      rail: [
        ['Основа', 'Текущий набор активных даров'],
        ['Рост', 'Понимание, что будет сильнее дальше'],
        ['Синергия', 'Связь с алхимией и союзниками']
      ]
    },
    inventory: {
      kind: 'inventory',
      eyebrow: 'Комната · Хранилище',
      title: 'Инвентарь и материалы',
      text: 'Расходники, знания и ключевые предметы показаны как аккуратное хранилище с более понятной сеткой.',
      metrics: ['Материалы', 'Ключи', 'Награды'],
      rail: [
        ['Материалы', 'Ресурсы для смесей и ритуалов'],
        ['Предметы', 'То, что влияет на сюжет'],
        ['Учёт', 'Сколько и чего осталось']
      ]
    },
    companions: {
      kind: 'companions',
      eyebrow: 'Комната · Гостиная отряда',
      title: 'Спутники и команда',
      text: 'Сбор отряда и роли спутников поданы как часть домашнего пространства, а не просто как список карточек.',
      metrics: ['Отряд', 'Роли', 'Синергия'],
      rail: [
        ['Слот 1', 'Морвен всегда с героем'],
        ['Слот 2', 'Выбираемый спутник под задачу'],
        ['Бонус', 'Что даёт спутник в сцене']
      ]
    }
  };

  function getScreen() {
    return document.body.dataset.coreScreen || 'other';
  }

  function findRoot() {
    return document.querySelector('#screen-content > .screen,.game-shell > .screen');
  }

  function titleText(root) {
    return root?.querySelector('.screen-header h1,h1')?.textContent?.replace(/\s+/g,' ').trim() || '';
  }

  function screenConfig(screen, root) {
    const cfg = SCREEN_CONFIG[screen];
    if (cfg) return cfg;
    const title = titleText(root).toLocaleLowerCase('ru');
    if (title.includes('лаборатор')) return SCREEN_CONFIG.laboratory;
    if (title.includes('книга') || title.includes('тени')) return SCREEN_CONFIG.codex;
    if (title.includes('дар') || title.includes('героя')) return SCREEN_CONFIG.hero;
    if (title.includes('инвентар')) return SCREEN_CONFIG.inventory;
    if (title.includes('спутник') || title.includes('отряд')) return SCREEN_CONFIG.companions;
    return null;
  }

  function roomCardIcon(title) {
    const t = (title || '').toLocaleLowerCase('ru');
    if (t.includes('гости')) return '⌂';
    if (t.includes('кабин')) return '✦';
    if (t.includes('лабо')) return '⚗';
    if (t.includes('тепл')) return '❋';
    if (t.includes('риту')) return '◎';
    if (t.includes('артеф')) return '◈';
    return '◇';
  }

  function decorateRoomCards(root) {
    root.querySelectorAll('.room-card').forEach(card => {
      if (!card.dataset.rxIcon) {
        const title = card.querySelector('strong,b,h3')?.textContent || card.textContent || '';
        card.dataset.rxIcon = roomCardIcon(title);
      }
    });
  }

  function createHero(cfg) {
    const section = document.createElement('section');
    section.className = `rx-room-hero rx-room-hero--${cfg.kind}`;
    section.innerHTML = `
      <div class="rx-room-hero-copy">
        <span class="rx-room-kicker">${cfg.eyebrow}</span>
        <h2>${cfg.title}</h2>
        <p>${cfg.text}</p>
        <div class="rx-room-metrics">
          ${cfg.metrics.map(label => `<span class="rx-room-metric">• ${label}</span>`).join('')}
        </div>
      </div>`;
    return section;
  }

  function createRail(cfg) {
    const rail = document.createElement('section');
    rail.className = 'rx-room-rail';
    rail.innerHTML = cfg.rail.map(([title, text]) => `
      <div class="rx-room-pill">
        <b>${title}</b>
        <span>${text}</span>
      </div>`).join('');
    return rail;
  }

  function injectRoomHero(root, cfg) {
    root.querySelector('.rx-room-hero,.home-scene')?.classList.contains('home-scene');  // noop, keeps parser sane
    if (root.querySelector('.rx-room-hero')) return;

    const header = root.querySelector('.screen-header');
    const firstSectionTitle = root.querySelector('.section-title');
    const anchor = header || root.firstElementChild;

    if (!cfg) return;
    const hero = createHero(cfg);
    const rail = createRail(cfg);

    if (header) {
      header.insertAdjacentElement('afterend', hero);
      hero.insertAdjacentElement('afterend', rail);
    } else if (anchor) {
      anchor.insertAdjacentElement('beforebegin', hero);
      hero.insertAdjacentElement('afterend', rail);
    } else {
      root.prepend(rail);
      root.prepend(hero);
    }

    // If the header repeats the same title too loudly, soften it by converting it into a section intro.
    if (header) {
      header.classList.add('rx-soft-header');
    }
  }

  function enhanceExplorationCards(root, screen) {
    if (screen === 'laboratory') {
      root.querySelectorAll('.recipe-card').forEach(card => card.classList.add('rx-room-focus'));
    }
    if (screen === 'codex') {
      root.querySelectorAll('.codex-card').forEach(card => card.classList.add('rx-room-focus'));
    }
    if (screen === 'hero') {
      root.querySelectorAll('.hero-panel').forEach(card => card.classList.add('rx-room-focus'));
    }
  }

  let queued = false;
  function apply() {
    queued = false;
    const root = findRoot();
    if (!root) return;

    const screen = getScreen();
    const cfg = screenConfig(screen, root);
    document.body.dataset.rxScreen = cfg ? (screen || cfg.kind) : 'other';

    decorateRoomCards(root);
    if (cfg && screen !== 'home') injectRoomHero(root, cfg);
    enhanceExplorationCards(root, screen);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
  } else {
    schedule();
  }

  new MutationObserver(schedule).observe(app, {childList:true, subtree:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('orientationchange', schedule, {passive:true});

  window.__roomsExplorationUIV1 = Object.freeze({
    version: VERSION,
    refresh: schedule
  });
})();
