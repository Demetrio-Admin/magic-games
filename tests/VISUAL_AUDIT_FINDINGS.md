# Visual audit remediation

Audit date: 2026-08-02

## Coverage

The visual regression runner exercised 61 deterministic game states at four
mobile viewports: 320×568, 360×640, 390×844 and 430×932. It captured the top of
every state and a separate bottom image for scrollable chapter screens.

| Area | States | Health |
| --- | ---: | --- |
| Start and hero creation | 2 | Good |
| Home and meta screens | 14 | Good |
| Chapter 2 | 14 | Good |
| District incident | 5 | Good |
| Chapter 3 | 12 | Good |
| Chapter 4 | 14 | Good |

## Result

- 244/244 scenario and viewport combinations passed structural checks.
- 0 console errors and 0 failed HTTP responses.
- 0 visual warnings in the final pass.
- The pre-fix baseline contained 365 visual warnings: 190 instances of text
  below 9px, 113 clipped-text instances and 62 nested-scroll instances.

## Resolved findings

1. Compact chapter and battle headers now preserve full titles and move the HUD
   to a separate row on narrow phones.
2. Secondary labels, objectives, status text and action descriptions use a
   readable compact scale instead of 6–8px text.
3. Action cards grow with their content and switch to a single column at the
   narrowest viewport.
4. Chapter 2's empty investigation state is compact, keeping the next action in
   the primary viewport.
5. Chapter and battle flows use one primary vertical scroller; inner panels
   expand naturally and keep fixed-footer clearance.
6. Disabled progression actions retain enough contrast to be recognizable while
   remaining visibly inactive.

## Evidence

- Machine-readable report: `tests/screenshots/visual-audit/report.json`.
- Browser gallery: `tests/screenshots/visual-audit/gallery.html`.
- Before/after comparison: `tests/screenshots/design-qa/before-after.jpg`.

## Evidence limits

This pass validates rendered layout, assets, viewport containment, basic
control labelling, touch target size and runtime errors. It does not replace
screen-reader testing, keyboard-only testing on desktop, colour-contrast
measurement against WCAG formulas or usability testing with players.
