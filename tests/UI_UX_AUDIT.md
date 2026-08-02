# UI/UX audit

The audit uses the real application shell, styles and scripts. It renders every
important navigation screen, story stage, battle tab and contextual help modal
with deterministic in-memory saves.

## Run

1. Start the repository with any static HTTP server.
2. Open `/?ui-audit=1`.
3. In the browser console run:

   ```js
   await __uiAudit.runAll()
   ```

The returned report checks:

- duplicate visible actions and duplicate DOM ids;
- broken `<img>` and CSS background assets encountered by scenarios;
- horizontal overflow and vertically clipped game content;
- controls covered by another layer;
- accessible control labels and undersized touch targets;
- contextual help/modal visibility, viewport containment and close action;
- release UI accidentally showing technical build or test copy.

Use at least these mobile viewports before release:

- 320 × 568
- 360 × 640
- 390 × 844
- 430 × 932

The machine-readable report is also stored in `window.__uiAuditResult`.

## Visual regression capture

Install the test runtime once, then run the screenshot audit:

```bash
npm install
npm run test:visual
```

The runner captures all 61 deterministic states at 320×568, 360×640,
390×844 and 430×932. Scrollable chapter screens also receive a bottom-state
capture. Results are written to `tests/screenshots/visual-audit/` as a JSON
report and an HTML gallery. In addition to the structural checks above, this
pass flags clipped headings, unreadably small text, nested scrolling, distorted
images and suspiciously empty large panels.

For a faster focused rerun, pass comma-separated scenario ids, for example:

```bash
VISUAL_AUDIT_IDS=c2-home,c4-battle-hero npm run test:visual
```

## Current baseline

Validated on 2026-08-02:

- 61 deterministic UI states;
- 4 mobile viewports: 320 × 568, 360 × 640, 390 × 844 and 430 × 932;
- 244 of 244 structural scenario/viewport combinations passed;
- 0 structural failures, console errors or broken HTTP responses;
- 0 visual warnings after responsive remediation.
