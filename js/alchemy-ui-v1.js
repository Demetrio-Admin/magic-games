(() => {
  'use strict';

  const VERSION = '1.0.0';
  const app = document.getElementById('app');
  if (!app) return;

  document.documentElement.classList.add('alchemy-ui-v1');
  document.body.classList.add('alchemy-ui-v1');

  const normalizeName = (value) => String(value || '')
    .replace(/^\s*\d+\.\s*/, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('ru');

  function orderNames(order) {
    if (!order) return [];
    return [...order.querySelectorAll(':scope > span')]
      .map(node => normalizeName(node.textContent))
      .filter(Boolean);
  }

  function ingredientName(button) {
    return normalizeName(button.querySelector('strong,b')?.textContent || button.textContent);
  }

  function decorateIngredients(buttons, selectedNames) {
    buttons.forEach(button => {
      const used = button.classList.contains('used') || button.disabled;
      button.setAttribute('aria-pressed', used ? 'true' : 'false');
      button.setAttribute('aria-label', `${button.textContent.trim()}${used ? '. Уже добавлено.' : '. Добавить компонент.'}`);

      const name = ingredientName(button);
      const index = selectedNames.findIndex(selected => name.includes(selected) || selected.includes(name));
      if (index >= 0 && !button.querySelector('.aui-choice-index')) {
        const badge = document.createElement('span');
        badge.className = 'aui-choice-index';
        badge.textContent = String(index + 1);
        badge.setAttribute('aria-hidden', 'true');
        button.appendChild(badge);
      }
    });
  }

  function decorateTemperature(container) {
    if (!container) return null;
    const buttons = [...container.querySelectorAll('button')];
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    });
    return buttons.find(button => button.classList.contains('active'))?.textContent.trim() || null;
  }

  function makeChargeTrack(track, actionSelector, fixed, optimalLabel) {
    if (!track || track.dataset.auiEnhanced === 'true') return;
    track.dataset.auiEnhanced = 'true';
    track.setAttribute('role', 'button');
    track.setAttribute('aria-label', fixed
      ? 'Магическое наполнение уже зафиксировано.'
      : 'Шкала магического наполнения. Нажмите, чтобы зафиксировать Искру.');
    track.setAttribute('aria-disabled', fixed ? 'true' : 'false');

    const rangeLabel = document.createElement('span');
    rangeLabel.className = 'aui-track-label';
    rangeLabel.textContent = optimalLabel;
    track.appendChild(rangeLabel);

    const hint = document.createElement('span');
    hint.className = 'aui-track-hint';
    hint.textContent = fixed ? 'Наполнение сохранено' : 'Можно нажать прямо по шкале';
    track.appendChild(hint);

    if (fixed) return;

    track.tabIndex = 0;
    const activate = event => {
      if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      const button = document.querySelector(actionSelector);
      if (button && !button.disabled) button.click();
    };
    track.addEventListener('click', activate);
    track.addEventListener('keydown', activate);
  }

  function stageMarkup(states) {
    const firstIncomplete = states.findIndex(state => !state.done);
    return `<section class="aui-stage-strip" aria-label="Этапы приготовления">
      ${states.map((state, index) => {
        const current = firstIncomplete === index;
        return `<div class="aui-stage ${state.done ? 'done' : ''} ${current ? 'current' : ''}" ${current ? 'aria-current="step"' : ''}>
          <div class="aui-stage-head">
            <span class="aui-stage-index">${state.done ? '✓' : index + 1}</span>
            <b>${state.title}</b>
          </div>
          <small>${state.caption}</small>
        </div>`;
      }).join('')}
    </section>`;
  }

  function readinessMarkup({ready, orderCount, total, temp, fixed}) {
    const missing = [];
    if (orderCount !== total) missing.push(`компоненты ${orderCount}/${total}`);
    if (!temp) missing.push('температура');
    if (!fixed) missing.push('наполнение');

    return `<section class="aui-readiness ${ready ? 'ready' : ''}" aria-live="polite">
      <div class="aui-readiness-head">
        <b>${ready ? 'Смесь готова к завершению' : 'Подготовка ещё не завершена'}</b>
        <span>${ready ? 'Можно варить' : 'Нужны действия'}</span>
      </div>
      <div class="aui-checks">
        <div class="aui-check ${orderCount === total ? 'done' : ''}">${orderCount === total ? '✓' : '○'} Компоненты ${orderCount}/${total}</div>
        <div class="aui-check ${temp ? 'done' : ''}">${temp ? '✓' : '○'} ${temp ? `Температура: ${temp}` : 'Выбрать температуру'}</div>
        <div class="aui-check ${fixed ? 'done' : ''}">${fixed ? '✓' : '○'} ${fixed ? 'Искра зафиксирована' : 'Зафиксировать Искру'}</div>
      </div>
      <p>${ready ? 'Кнопка завершения активна в нижней панели.' : `Осталось: ${missing.join(', ')}.`}</p>
    </section>`;
  }

  function decorateC2Alchemy() {
    const root = document.querySelector('.c2-alchemy');
    if (!root) return false;

    const ingredientButtons = [...root.querySelectorAll('.c2-ingredient')];
    const selected = orderNames(root.querySelector('.c2-order'));
    const total = ingredientButtons.length;
    const count = selected.length;
    const temp = decorateTemperature(root.querySelector('.c2-temp'));
    const track = root.querySelector('.c2-charge');
    const fixed = !!track?.classList.contains('stopped');
    const ready = total > 0 && count === total && !!temp && fixed;

    decorateIngredients(ingredientButtons, selected);
    makeChargeTrack(track, '[data-action="chapter2-stop-charge"]', fixed, 'Оптимум 55–74%');

    if (!root.querySelector('.aui-stage-strip')) {
      root.insertAdjacentHTML('afterbegin', stageMarkup([
        {title:'Компоненты', caption:`${count}/${total} добавлено`, done:count === total},
        {title:'Температура', caption:temp || 'Не выбрана', done:!!temp},
        {title:'Искра', caption:fixed ? 'Зафиксирована' : 'Движется', done:fixed}
      ]));
    }

    const body = root.querySelector('.c2-alchemy-body');
    if (body && !body.querySelector('.aui-readiness')) {
      body.insertAdjacentHTML('beforeend', readinessMarkup({ready, orderCount:count, total, temp, fixed}));
    }

    const brew = document.querySelector('[data-action="chapter2-brew"]');
    if (brew) {
      brew.setAttribute('aria-disabled', brew.disabled ? 'true' : 'false');
      brew.title = ready ? 'Завершить приготовление смеси' : 'Сначала завершите все три этапа';
    }
    return true;
  }

  function decorateC4Alchemy() {
    const root = document.querySelector('.c4-alchemy');
    if (!root) return false;

    const ingredientButtons = [...root.querySelectorAll('.c4-ingredient')];
    const selected = orderNames(root.querySelector('.c4-order'));
    const total = ingredientButtons.length;
    const count = selected.length;
    const temp = decorateTemperature(root.querySelector('.c4-temp'));
    const track = root.querySelector('.c4-charge');
    const fixed = !!track?.classList.contains('stopped');
    const ready = total > 0 && count === total && !!temp && fixed;

    decorateIngredients(ingredientButtons, selected);
    makeChargeTrack(track, '[data-action="c4-charge"]', fixed, 'Оптимум 55–75%');

    if (!root.querySelector('.aui-stage-strip')) {
      root.insertAdjacentHTML('afterbegin', stageMarkup([
        {title:'Компоненты', caption:`${count}/${total} добавлено`, done:count === total},
        {title:'Температура', caption:temp || 'Не выбрана', done:!!temp},
        {title:'Искра', caption:fixed ? 'Зафиксирована' : 'Движется', done:fixed}
      ]));
    }

    const body = root.querySelector('.c4-alchemy-body');
    if (body && !body.querySelector('.aui-readiness')) {
      body.insertAdjacentHTML('beforeend', readinessMarkup({ready, orderCount:count, total, temp, fixed}));
    }

    const brew = document.querySelector('[data-action="c4-brew"]');
    if (brew) {
      brew.setAttribute('aria-disabled', brew.disabled ? 'true' : 'false');
      brew.title = ready ? 'Завершить приготовление противоядия' : 'Сначала завершите все три этапа';
    }
    return true;
  }

  function decorateFormula() {
    document.querySelectorAll('.c4-recipe').forEach(button => {
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    });
  }

  function decorateResults() {
    const c2 = document.querySelector('.c2-potion-result');
    const c4 = document.querySelector('.c4-quality');
    const result = c2 || c4;
    document.body.classList.toggle('alchemy-result-active', !!result);
    if (!result || result.querySelector('.aui-result-badge')) return;

    result.setAttribute('role', 'status');
    let quality = 'basic';
    if (result.classList.contains('excellent')) quality = 'excellent';
    else if (result.classList.contains('stable')) quality = 'stable';
    else if (result.classList.contains('unstable')) quality = 'unstable';

    const labels = {
      excellent:'Превосходное качество',
      stable:'Стабильное качество',
      basic:'Рабочее качество',
      unstable:'Нестабильное качество'
    };
    const badge = document.createElement('span');
    badge.className = `aui-result-badge ${quality}`;
    badge.textContent = labels[quality];
    result.insertBefore(badge, result.firstChild);
  }

  let scheduled = false;
  function decorate() {
    scheduled = false;
    const active = decorateC2Alchemy() || decorateC4Alchemy();
    document.body.classList.toggle('alchemy-screen-active', active);
    decorateFormula();
    decorateResults();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(decorate);
  }

  const observer = new MutationObserver(schedule);
  observer.observe(app, {childList:true, subtree:true});

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
  } else {
    schedule();
  }

  window.__alchemyUIV1 = Object.freeze({
    version: VERSION,
    refresh: schedule
  });
})();
