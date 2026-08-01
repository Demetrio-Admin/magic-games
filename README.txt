MAGIC RPG — NOCTURNE CLEAN v5.0

Это чистая PWA-сборка с единым интерфейсом Nocturne. Визуальный слой находится в css/nocturne-game.css и js/nocturne-ui.js, игровая логика — в js/app.js.

Не открывайте index.html напрямую через content:// или file:// — CSS, JS и изображения могут не загрузиться.

ПК: запустите start_server.bat или выполните python -m http.server 8080, затем откройте http://localhost:8080.

Телефон: загрузите всю папку на GitHub Pages / Netlify / Cloudflare Pages, откройте HTTPS-ссылку и установите игру через меню браузера.

При переходе на новый домен сохранения localStorage не переносятся автоматически. Сначала экспортируйте JSON сохранения из старой версии, затем импортируйте его в новой.
