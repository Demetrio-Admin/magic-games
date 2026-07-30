(() => {
  'use strict';

  const VERSION = '1.0.0';
  const app = document.getElementById('app');
  if (!app) return;

  document.documentElement.classList.add('narrative-choice-ui-v1');
  document.body.classList.add('narrative-choice-ui-v1');

  const SINGLE_CHOICE_ACTIONS = new Set([
    'chapter2-ending',
    'c3-approach',
    'c3-plan',
    'c3-amulet',
    'c3-registration',
    'c4-approach',
    'c4-diagnosis',
    'c4-recipe',
    'c4-final-choice',
    'incident-approach',
    'ux-select-hypothesis',
    'ux6-hypothesis'
  ]);

  const MAJOR_ACTIONS = new Set([
    'chapter2-ending',
    'c3-amulet',
    'c3-registration',
    'c4-final-choice',
    'incident-approach'
  ]);

  const CHOICE_SELECTORS = [
    '.c2-choice-list',
    '.c3-choice-grid',
    '.c3-plan-grid',
    '.c4-grid',
    '.c4-recipe-grid',
    '.inc-route-grid',
    '.ux-hypotheses',
    '.ux6-deduction',
    '.ux-danger-actions',
    '.ux6-danger-grid'
  ];

  const CHOICE_BUTTON_SELECTOR = [
    '.c2-choice-list button',
    '.c3-choice',
    '.c3-plan',
    '.c4-choice',
    '.c4-recipe',
    '.inc-route',
    '.ux-hypothesis',
    '.ux6-hypothesis',
    '.ux-danger-action',
    '.ux6-danger-choice'
  ].join(',');

  function textOf(node, selector) {
    return node.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim() || '';
  }

  function actionOf(button) {
    return button.dataset.action || '';
  }

  function isSelected(button) {
    return button.classList.contains('selected')
      || button.classList.contains('active')
      || button.getAttribute('aria-pressed') === 'true';
  }

  function choiceKind(button) {
    const text = button.textContent.toLocaleLowerCase('ru');
    const action = actionOf(button);
    if (/уничтож|разруш|сорвать|отказ|обман|подмен/.test(text)) return 'danger';
    if (/спас|очист|сохран|довер|помог/.test(text)) return 'mercy';
    if (/орден|регистрац|приказ|протокол/.test(text) || action === 'c3-registration') return 'order';
    return 'neutral';
  }

  function choiceLabel(action) {
    if (['ux-select-hypothesis', 'ux6-hypothesis', 'c4-diagnosis'].includes(action)) return 'Гипотеза';
    if (['c4-recipe', 'c3-plan'].includes(action)) return 'Подготовка';
    if (MAJOR_ACTIONS.has(action)) return 'Сюжетное решение';
    if (['c3-approach', 'c4-approach'].includes(action)) return 'Ответ';
    return 'Выбор';
  }

  function decorateDialogue(card) {
    if (card.dataset.nuiDialogue === 'true') return;
    const speaker = card.querySelector('.speaker,.c3-speaker');
    const quote = card.querySelector('blockquote,.c3-quote');
    if (!speaker && !quote) return;

    card.dataset.nuiDialogue = 'true';
    card.classList.add('nui-dialogue');

    if (!speaker) return;
    const name = speaker.textContent.replace(/\s+/g, ' ').trim();
    const initial = name ? name[0].toLocaleUpperCase('ru') : '✦';
    const tone = /лиора|орден|оператив/.test(name.toLocaleLowerCase('ru'))
      ? 'order'
      : /селеста|алхим/.test(name.toLocaleLowerCase('ru'))
        ? 'alchemy'
        : 'magic';

    const bar = document.createElement('div');
    bar.className = 'nui-speaker-bar';
    bar.dataset.tone = tone;
    bar.innerHTML = `<span class="nui-speaker-avatar" aria-hidden="true">${initial}</span>
      <span class="nui-speaker-copy"><b>${name}</b><span>${tone === 'order' ? 'Орден Первого Света' : tone === 'alchemy' ? 'Алхимическая сцена' : 'Диалог'}</span></span>`;
    speaker.replaceWith(bar);
  }

  function decorateChoiceGroup(group) {
    group.classList.add('nui-choice-group');
    group.setAttribute('role', 'radiogroup');
    const buttons = [...group.querySelectorAll(':scope > button, :scope > .nui-choice')];
    buttons.forEach((button, index) => {
      if (!(button instanceof HTMLElement)) return;
      button.classList.add('nui-choice');
      const action = actionOf(button);
      const selected = isSelected(button);

      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', selected ? 'true' : 'false');
      button.setAttribute('aria-disabled', button.disabled ? 'true' : 'false');
      button.dataset.nuiKind = choiceKind(button);

      if (MAJOR_ACTIONS.has(action)) button.classList.add('nui-major-choice');

      if (!button.querySelector('.nui-choice-index')) {
        const badge = document.createElement('span');
        badge.className = 'nui-choice-index';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = selected ? '✓' : String(index + 1);
        button.appendChild(badge);
      } else {
        button.querySelector('.nui-choice-index').textContent = selected ? '✓' : String(index + 1);
      }

      if (!button.querySelector('.nui-choice-type')) {
        const type = document.createElement('span');
        type.className = 'nui-choice-type';
        type.textContent = choiceLabel(action);
        button.appendChild(type);
      }
    });
  }

  function addDecisionHeader(group) {
    if (group.previousElementSibling?.classList.contains('nui-decision-header')) return;
    const hasMajor = [...group.querySelectorAll('[data-action]')].some(button => MAJOR_ACTIONS.has(actionOf(button)));
    if (!hasMajor) return;

    const header = document.createElement('section');
    header.className = 'nui-decision-header';
    header.innerHTML = `<span aria-hidden="true">◇</span><div><b>Решение будет сохранено</b><small>Выберите вариант, посмотрите отмеченное решение и подтвердите переход кнопкой внизу.</small></div>`;
    group.before(header);
  }

  function effectText(button) {
    const primary = textOf(button, 'em');
    if (primary) return primary;
    const small = textOf(button, 'small');
    if (small) return small;
    const spans = [...button.querySelectorAll(':scope > span:not(.nui-choice-index):not(.nui-choice-type):not(.tag)')]
      .map(node => node.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    return spans[0] || 'Последствие сохранится в истории героя.';
  }

  function titleText(button) {
    return textOf(button, 'b,strong,h3') || button.textContent.replace(/\s+/g, ' ').trim();
  }

  function addSelectedSummary(shell) {
    shell.querySelectorAll('.nui-choice-confirm').forEach(node => node.remove());
    const candidates = [...shell.querySelectorAll(CHOICE_BUTTON_SELECTOR)]
      .filter(button => SINGLE_CHOICE_ACTIONS.has(actionOf(button)) && isSelected(button));

    if (candidates.length !== 1) return;
    const selected = candidates[0];
    const main = shell.querySelector('.c2-main,.c3-main,.c4-main,.inc-main');
    if (!main) return;

    const summary = document.createElement('section');
    summary.className = 'nui-choice-confirm';
    summary.setAttribute('role', 'status');
    summary.innerHTML = `<small>Выбрано</small><b>${titleText(selected)}</b><p>${effectText(selected)}</p>`;
    main.appendChild(summary);
  }

  function decorateRewards() {
    const resultRoot = document.querySelector('.c2-rewards,.c3-result,.inc-result,.c4-quality');
    document.body.classList.toggle('nui-result-active', !!resultRoot);
    if (!resultRoot) return;

    if (!resultRoot.querySelector('.nui-result-head')) {
      const title = textOf(resultRoot, 'h2') || 'Этап завершён';
      const paragraph = textOf(resultRoot, 'p') || 'Последствия и награды сохранены.';
      const head = document.createElement('section');
      head.className = 'nui-result-head';
      head.innerHTML = `<span>Результат</span><b>${title}</b><p>${paragraph}</p>`;
      resultRoot.prepend(head);
    }

    document.querySelectorAll('.reward-grid > div,.c3-reward-grid > div,.c2-rewards > div')
      .forEach(node => node.classList.add('nui-reward'));
  }

  function decorateNarrativeScreen() {
    document.querySelectorAll('.c2-story,.c3-story').forEach(decorateDialogue);
    document.querySelectorAll(CHOICE_SELECTORS.join(',')).forEach(group => {
      decorateChoiceGroup(group);
      addDecisionHeader(group);
    });

    const shell = document.querySelector('.c2-shell,.c3-shell,.c4-shell,.inc-shell');
    const active = !!shell && (
      !!shell.querySelector('.nui-dialogue,.nui-choice-group,.c2-rewards,.c3-result,.inc-result,.c4-quality')
    );
    document.body.classList.toggle('narrative-screen-active', active);
    if (shell) addSelectedSummary(shell);
    decorateRewards();
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      decorateNarrativeScreen();
    });
  }

  const observer = new MutationObserver(schedule);
  observer.observe(app, {childList:true, subtree:true});

  document.addEventListener('click', event => {
    if (event.target.closest(CHOICE_BUTTON_SELECTOR)) schedule();
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
  } else {
    schedule();
  }

  window.__narrativeChoiceUIV1 = Object.freeze({
    version: VERSION,
    refresh: schedule
  });
})();
