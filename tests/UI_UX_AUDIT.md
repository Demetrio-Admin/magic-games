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

## Current baseline

Validated on 2026-07-30:

- 61 deterministic UI states;
- 4 mobile viewports;
- 244 passed scenario/viewport combinations;
- 0 failures, 0 touch-target warnings and 0 broken image assets.
