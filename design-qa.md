# Nocturne full-screen rebuild — design QA

## Comparison target

- Source visual truth: the five customer screenshots supplied on 2026-08-02.
- Browser-rendered implementation: the unified screen system in
  `css/nocturne-game.css` and `js/nocturne-ui.js`, with game state and rules in
  `js/app.js`.
- Direct comparison size: 778 × 892, matching the supplied investigation,
  deduction, alchemy and home captures.
- Responsive test widths: 320 × 568, 360 × 640, 390 × 844 and 430 × 932.
- Automated coverage: all 66 deterministic game and modal states.

## Rebuild findings

- Removed the legacy inline-SVG visual pass, embedded art pass and presentation
  hotfix layer. No old renderer can repaint the new interface after load.
- Replaced legacy scene SVGs, emoji art and text-glyph art with authored raster
  scenes and Tabler interface icons.
- Rebuilt the start, home, meta, investigation, deduction, preparation,
  alchemy, battle, result, settings and companion surfaces around one token set.
- Contextual hints are normal-flow content. They do not cover authored copy,
  hotspots, action cards, fixed footers or bottom navigation.
- Every chapter shell has one primary vertical scroller and a dedicated fixed
  action region. No nested or inaccessible scrolling remains.
- Investigation hotspots have accessible names, minimum touch sizes and stable
  positions over real scene art.
- Battle actors and shared companion actions retain their game logic while using
  the new visual system and real portraits/spell artwork.
- Modal headings, close controls, debug/settings cards and narrow-screen reward
  rows remain readable without clipping or overlap.
- The direct before/after review found no remaining P0, P1 or P2 visual defects.

## Automated result

- 66/66 states passed at 320 × 568.
- 66/66 states passed at 360 × 640.
- 66/66 states passed at 390 × 844.
- 66/66 states passed at 430 × 932.
- 0 structural failures.
- 0 touch-target or accessibility warnings.
- 0 visual warnings.
- 0 console errors.
- 0 broken asset responses.

## Primary interactions verified

- Hero creation, continue/new-game flow and autosave-compatible home states.
- Cases, inventory, companions, journal, codex, laboratory and hero progression.
- Every Chapter 2, district incident, Chapter 3 and Chapter 4 state.
- Investigation point selection, method selection, deduction and reset flows.
- Alchemy ordering, temperature, charge and result states.
- Battle actor switching, shared companion actions, help modals and round actions.
- In-flow coach states, settings, item/companion details and party selection.

final result: passed
