#!/usr/bin/env node
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const {spawn} = require('node:child_process');
let chromium;
try {
  ({chromium} = require('playwright'));
} catch {
  try {
    ({chromium} = require('playwright-core'));
  } catch {
    throw new Error('Install Playwright first: npm install');
  }
}

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.resolve(ROOT, process.env.VISUAL_AUDIT_OUTPUT || 'tests/screenshots/visual-audit');
const DEFAULT_VIEWPORTS = [
  {width:320, height:568},
  {width:360, height:640},
  {width:390, height:844},
  {width:430, height:932}
];
const VIEWPORTS = (process.env.VISUAL_AUDIT_VIEWPORTS || '')
  .split(',')
  .map(value => value.trim().match(/^(\d+)x(\d+)$/))
  .filter(Boolean)
  .map(([, width, height]) => ({width:Number(width), height:Number(height)}));
if (!VIEWPORTS.length) VIEWPORTS.push(...DEFAULT_VIEWPORTS);

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function startServer() {
  if (process.env.VISUAL_AUDIT_URL) return {url:process.env.VISUAL_AUDIT_URL, stop() {}};
  const port = Number(process.env.VISUAL_AUDIT_PORT || 4179);
  const child = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
    cwd:ROOT,
    stdio:'ignore'
  });
  await wait(450);
  return {url:`http://127.0.0.1:${port}/`, stop() { child.kill('SIGTERM'); }};
}

function auditUrl(base) {
  const url = new URL(base);
  url.searchParams.set('ui-audit', '1');
  return url.href;
}

function safeName(value) {
  return value.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

async function settleVisuals(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await Promise.all([...document.images].map(image => {
      if (image.complete) return image.decode?.().catch(() => {});
      return new Promise(resolve => {
        const timeout = setTimeout(resolve, 1500);
        image.onload = image.onerror = () => {
          clearTimeout(timeout);
          resolve();
        };
      });
    }));
    const urls = new Set();
    document.querySelectorAll('#app *,#modal-root *').forEach(node => {
      const background = getComputedStyle(node).backgroundImage;
      for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (!match[1].startsWith('data:')) urls.add(new URL(match[1], location.href).href);
      }
    });
    await Promise.all([...urls].map(url => new Promise(resolve => {
      const image = new Image();
      const timeout = setTimeout(resolve, 1500);
      image.onload = image.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };
      image.src = url;
    })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function captureViewport(browser, target, viewport) {
  const name = `${viewport.width}x${viewport.height}`;
  const outputDir = path.join(OUTPUT, name);
  await fs.mkdir(outputDir, {recursive:true});
  const page = await browser.newPage({viewport, deviceScaleFactor:1});
  const consoleErrors = [];
  const badResponses = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => consoleErrors.push(String(error)));
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(auditUrl(target), {waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => globalThis.__uiAudit && globalThis.__magicTest);
  const allScenarios = await page.evaluate(() => globalThis.__uiAudit.scenarios);
  const requestedIds = new Set((process.env.VISUAL_AUDIT_IDS || '').split(',').map(value => value.trim()).filter(Boolean));
  const scenarios = requestedIds.size ? allScenarios.filter(scenario => requestedIds.has(scenario.id)) : allScenarios;
  const results = [];

  for (const scenario of scenarios) {
    await page.evaluate(id => globalThis.__uiAudit.runScenario(id), scenario.id);
    await page.evaluate(() => {
      scrollTo(0, 0);
      document.querySelectorAll('.c2-main,.c3-main,.c4-main,.inc-main,.screen-scroll,.modal-body')
        .forEach(node => { node.scrollTop = 0; });
    });
    await settleVisuals(page);
    const result = await page.evaluate(id => globalThis.__uiAudit.auditCurrent(id), scenario.id);
    const file = `${safeName(scenario.id)}.png`;
    await page.screenshot({path:path.join(outputDir, file), fullPage:false});
    const scroll = await page.evaluate(() => {
      const node = document.querySelector('.c2-main,.c3-main,.c4-main,.inc-main,.screen-scroll');
      if (!node || node.scrollHeight <= node.clientHeight + 24) return null;
      return {selector:`.${[...node.classList].join('.')}`, top:node.scrollTop, height:node.clientHeight, total:node.scrollHeight};
    });
    let bottomFile = null;
    if (scroll) {
      await page.evaluate(selector => {
        const node = document.querySelector(selector);
        if (node) node.scrollTop = node.scrollHeight;
      }, scroll.selector);
      await page.waitForTimeout(80);
      bottomFile = `${safeName(scenario.id)}--bottom.png`;
      await page.screenshot({path:path.join(outputDir, bottomFile), fullPage:false});
    }
    results.push({...result, screenshot:file, bottomScreenshot:bottomFile, scroll});
  }

  await page.close();
  return {viewport:name, results, consoleErrors:[...new Set(consoleErrors)], badResponses:[...new Set(badResponses)]};
}

function galleryHtml(report) {
  const groups = report.viewports.map(viewport => `
    <section><h2>${viewport.viewport}</h2><div class="grid">
      ${viewport.results.map(result => `
        <article class="${result.failures.length ? 'fail' : result.visualWarnings?.length ? 'warn' : ''}">
          <h3>${result.id}</h3><img loading="lazy" src="${viewport.viewport}/${result.screenshot}" alt="${result.label}">
          ${result.bottomScreenshot ? `<img loading="lazy" src="${viewport.viewport}/${result.bottomScreenshot}" alt="${result.label}, нижняя часть">` : ''}
          <p>${result.label}</p>
          <ul>${[...result.failures, ...result.warnings, ...(result.visualWarnings || [])].map(item => `<li>${item.replaceAll('&','&amp;').replaceAll('<','&lt;')}</li>`).join('')}</ul>
        </article>`).join('')}
    </div></section>`).join('');
  return `<!doctype html><meta charset="utf-8"><title>Magic RPG visual audit</title><style>
    body{margin:0;padding:24px;background:#08070d;color:#eee;font:14px system-ui}h1,h2{font-family:Georgia,serif}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}article{padding:12px;border:1px solid #332a3e;border-radius:12px;background:#111018}article.warn{border-color:#8b6a35}article.fail{border-color:#a84b63}img{width:100%;height:auto;display:block;margin-top:8px;border-radius:8px;background:#000}li{margin:.35em 0;color:#d5c8da}p{color:#aaa}</style><h1>Magic RPG — visual audit</h1>${groups}`;
}

(async () => {
  const server = await startServer();
  let browser;
  try {
    const launchOptions = {headless:true};
    if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
    }
    browser = await chromium.launch(launchOptions);
    await fs.rm(OUTPUT, {recursive:true, force:true});
    await fs.mkdir(OUTPUT, {recursive:true});
    const viewports = [];
    for (const viewport of VIEWPORTS) viewports.push(await captureViewport(browser, server.url, viewport));
    const report = {
      generatedAt:new Date().toISOString(),
      target:server.url,
      scenarios:viewports[0]?.results.length || 0,
      viewportCount:viewports.length,
      totals:{
        failures:viewports.reduce((sum, item) => sum + item.results.reduce((n, result) => n + result.failures.length, 0), 0),
        warnings:viewports.reduce((sum, item) => sum + item.results.reduce((n, result) => n + result.warnings.length, 0), 0),
        visualWarnings:viewports.reduce((sum, item) => sum + item.results.reduce((n, result) => n + (result.visualWarnings?.length || 0), 0), 0),
        consoleErrors:viewports.reduce((sum, item) => sum + item.consoleErrors.length, 0),
        badResponses:viewports.reduce((sum, item) => sum + item.badResponses.length, 0)
      },
      viewports
    };
    await fs.writeFile(path.join(OUTPUT, 'report.json'), JSON.stringify(report, null, 2));
    await fs.writeFile(path.join(OUTPUT, 'gallery.html'), galleryHtml(report));
    process.stdout.write(`${JSON.stringify(report.totals)}\n${path.join(OUTPUT, 'gallery.html')}\n`);
    if (report.totals.failures || report.totals.consoleErrors || report.totals.badResponses) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.stop();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
