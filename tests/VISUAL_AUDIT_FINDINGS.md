# Visual audit remediation

Audit date: 2026-08-02

## Coverage

The visual regression runner exercised 66 deterministic game states at four
mobile viewports: 320×568, 360×640, 390×844 and 430×932. It captured the top of
every state and a separate bottom image for scrollable chapter screens.

| Area | States | Health |
| --- | ---: | --- |
| Start and hero creation | 2 | Good |
| Home and meta screens | 15 | Good |
| Chapter 2 | 18 | Good |
| District incident | 5 | Good |
| Chapter 3 | 12 | Good |
| Chapter 4 | 14 | Good |

## Result

- 264/264 scenario and viewport combinations passed structural checks.
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
7. Contextual coach cards render at the top of the primary content flow rather
   than beside arbitrary targets, fixed actions or navigation. They no longer
   trigger automatic scrolling and cannot cover authored copy.
8. The home-scene Morven dialogue now follows the artwork in normal document
   flow instead of floating over the story introduction.

## Evidence

- Machine-readable report: `tests/screenshots/visual-audit/report.json`.
- Browser gallery: `tests/screenshots/visual-audit/gallery.html`.
- Before/after comparison: `tests/screenshots/design-qa/before-after.jpg`.
- Coach, alchemy and home comparison:
  `tests/screenshots/design-qa/hint-overlay-before-after.jpg`.

## Evidence limits

This pass validates rendered layout, assets, viewport containment, basic
control labelling, touch target size and runtime errors. It does not replace
screen-reader testing, keyboard-only testing on desktop, colour-contrast
measurement against WCAG formulas or usability testing with players.
