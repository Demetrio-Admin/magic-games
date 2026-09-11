const status = document.getElementById('boot-status');

function setStatus(text: string, error = false) {
  if (!status) return;
  status.textContent = text;
  status.className = error ? 'error' : '';
}

function hideWhenCanvasExists() {
  const app = document.getElementById('app');
  if (app?.querySelector('canvas')) {
    status?.remove();
    return true;
  }
  return false;
}

window.addEventListener('error', (event) => {
  setStatus('Ошибка запуска Phaser:\n' + (event.message || 'неизвестная ошибка'), true);
});

window.addEventListener('unhandledrejection', (event) => {
  setStatus('Ошибка запуска Phaser:\n' + String(event.reason || 'неизвестная ошибка'), true);
});

async function clearLegacyPwa() {
  const hadController = Boolean(navigator.serviceWorker?.controller);

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  return hadController;
}

async function boot() {
  try {
    setStatus('Проверяю старый кэш…');
    const hadController = await clearLegacyPwa();

    if (hadController && sessionStorage.getItem('pt-sw-reset') !== '1') {
      sessionStorage.setItem('pt-sw-reset', '1');
      setStatus('Удаляю старую версию игры…');
      location.replace('./?fresh=' + Date.now());
      return;
    }

    sessionStorage.removeItem('pt-sw-reset');
    setStatus('Запускаю Phaser 4…');

    const observer = new MutationObserver(() => {
      if (hideWhenCanvasExists()) observer.disconnect();
    });

    const app = document.getElementById('app');
    if (app) observer.observe(app, { childList: true, subtree: true });

    await import('./main');

    if (!hideWhenCanvasExists()) {
      setTimeout(() => {
        if (!hideWhenCanvasExists()) {
          setStatus('Phaser загрузился, но canvas не появился.', true);
        }
      }, 2500);
    }
  } catch (error) {
    setStatus(
      'Ошибка загрузки игры:\n' +
        String(error instanceof Error ? error.message : error),
      true,
    );
  }
}

void boot();
