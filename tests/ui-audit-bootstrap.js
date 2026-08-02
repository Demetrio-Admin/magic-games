(() => {
  'use strict';
  if (!new URLSearchParams(location.search).has('ui-audit')) return;

  document.documentElement.dataset.uiAudit = '1';
  window.__MAGIC_RPG_TEST__ = true;
  addEventListener('DOMContentLoaded', () => {
    window.__uiAuditReady = import('./ui-ux-audit.js?v=3.1.4');
  }, {once:true});
})();
