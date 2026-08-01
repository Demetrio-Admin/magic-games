# Nocturne clean rebuild — design QA

## Comparison target

- Source visual truth: `tests/screenshots/nocturne/home-early-390x844.png`, `tests/screenshots/nocturne/c2-investigation-390x844.png`, `tests/screenshots/nocturne/c4-battle-hero-390x844.png`.
- Browser-rendered implementation: matching files in `tests/screenshots/clean-rebuild/`.
- Combined full-view evidence: `tests/screenshots/clean-rebuild/design-qa-comparison.jpg` (source on the left, rebuilt screen on the right).
- Responsive evidence: `/tmp/nocturne-320-battles-final.png` during the final local QA pass; the machine-readable audit is `tests/screenshots/clean-rebuild/verification.json`.
- Viewports: 390 × 844 for direct source comparison; 320 × 568, 390 × 844 and 430 × 932 for responsive audit.
- Pixel dimensions and normalization: every direct source and implementation capture is 390 × 844 px at a 390 × 844 CSS viewport with deviceScaleFactor 1. No density normalization or device-frame crop was needed. The combined comparison is 828 × 2604 px and adds only a 12 px inspection gutter.
- States: early home, Chapter 2 investigation and Chapter 4 hero battle; additional rendered checks cover all 61 deterministic UI states.

## Findings

- No actionable P0, P1 or P2 differences remain.
- Fonts and typography: display serif and compact sans-serif roles, hierarchy, wrapping, weights and legibility follow the Nocturne target. Battle titles wrap instead of truncating at 320 px.
- Spacing and layout rhythm: the rebuild keeps the same mobile frame, card rhythm, antique-gold dividers and persistent controls while reducing empty space in investigation and battle screens. No horizontal overflow or inaccessible nested scrolling remains.
- Colors and visual tokens: near-black canvas, obsidian panels, antique gold, ritual violet, muted silver, green success and rose danger states are centralized in `css/nocturne-game.css` and visibly match the source direction.
- Image quality and asset fidelity: authored WebP scene, character, spell and battle art is used at correct aspect ratios. No placeholder boxes, emoji art or CSS-drawn replacement imagery is visible in the rebuilt primary surfaces. All requested assets load without 404 responses.
- Copy and content: existing story, objective and mechanic text is preserved. Labels remain readable at the tested mobile widths.
- Icons and controls: icon family, borders and interaction states are visually consistent. All visible controls have accessible names and at least 44 px practical touch targets.

## Focused region comparison

- Battle headers and persistent footers were inspected separately at 320 × 568 and 390 × 844 because title wrapping and action availability are too small to judge reliably in the six-screen montage.
- Chapter 3 and Chapter 4 battle art was inspected at original resolution to confirm the Chapter 3 scene is not duplicated and the full `Алхимический голод` title is visible.

## Comparison history

1. Earlier P2: Chapter 3 rendered a second battle image below the authored scene. Fix: exclude `.battle-layout-v1`, `.ux6-battle-layout` and `.c3-battle` states from the generic scene-art decorator. Post-fix evidence: `tests/screenshots/clean-rebuild/c3-battle-390x844.png` shows one authored battle image.
2. Earlier P2: the Chapter 4 title was clipped at 390 px. Fix: reduce the mobile heading scale and HUD spacing. Post-fix evidence: `tests/screenshots/clean-rebuild/c4-battle-hero-390x844.png` shows the full title.
3. Earlier P2: the legacy raster fallback CSS variable resolved the Morven portrait relative to `/css/` and returned 404. Fix: resolve CSS-variable URLs against `document.baseURI`. Post-fix interaction smoke test recorded zero console errors and zero bad responses.
4. Earlier P2: Chapter 2–4 battle titles truncated at 320 px. Fix: enable compact two-line title wrapping below 340 px. Post-fix evidence: the final 320 px battle montage shows all three titles in full.

## Primary interactions tested

- Create hero, create and persist save.
- Navigate home → cases → home.
- Complete the three required Chapter 2 home discoveries and advance to investigation.
- Switch actor tabs and execute an enabled battle action in Chapters 2, 3 and 4.
- Open and close the Chapter 4 help modal.
- Console errors checked: 0.
- HTTP asset failures checked: 0.

## Implementation checklist

- [x] One canonical stylesheet and one UI decoration module.
- [x] Old design, demo and hotfix files removed.
- [x] Service worker cache updated to the 5.0.0 asset graph.
- [x] 61/61 states pass at all three release viewports.
- [x] Zero warnings, console errors and broken assets.

final result: passed
