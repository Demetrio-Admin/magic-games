# Contextual hints and responsive game screens — design QA

## Comparison target

- Source visual truth: the five customer screenshots supplied on 2026-08-02.
- Browser-rendered implementation: current hint-placement remediation in
  `js/app.js`, `js/nocturne-ui.js` and `css/nocturne-game.css`.
- Combined evidence: `tests/screenshots/design-qa/before-after.jpg`, with the
  baseline on the left and the corrected screen on the right.
- Customer screenshot comparison:
  `tests/screenshots/design-qa/hint-overlay-before-after.jpg`, with each supplied
  screenshot on the left and the corrected 738 × 886 render on the right.
- Viewports: 320 × 568, 360 × 640, 390 × 844 and 430 × 932.
- Reported viewport replay: 738 × 886.
- States compared directly: investigation coach, alchemy coach and home coach.
  The automated pass covers all 66 states.

## Findings

- No actionable P0, P1 or P2 visual differences remain.
- Contextual hints use a single predictable banner position at the beginning of
  the screen content; none overlap the footer, navigation, target controls or
  authored text.
- Showing a hint no longer scrolls the page or elevates its target above other
  interface layers.
- The home dialogue card is in normal flow below the scene artwork and remains
  readable without covering the introduction.
- Typography: complete titles, readable metadata and stable line wrapping are
  preserved across all tested widths.
- Spacing and layout: panels grow with content, the investigation empty state is
  compact and fixed action bars retain safe content clearance.
- Scrolling: each chapter flow has one primary vertical scrolling region; no
  trapped nested scrolling was detected.
- Battle cards: labels and descriptions remain readable, disabled actions stay
  recognizable and narrow screens use a single-column action layout.
- Chapter 4 party tabs: names and statuses wrap in dedicated rows without
  ellipsis or mid-word breaks.
- Colors, authored scene art, character assets and existing story copy are
  unchanged.

## Comparison history

1. Baseline: 365 visual warnings across 244 scenario/viewport combinations.
2. Pass one: responsive headers, compact type, growing cards and single-scroll
   flows reduced the result to 59 warnings.
3. Pass two: removed remaining Chapter 2 nested scrolling and corrected action
   card clipping detection.
4. Pass three: repaired Chapter 3 actor navigation, Chapter 4 party tabs and the
   390px header wrap.
5. Contextual-hint pass: replaced target-relative insertion and automatic
   scrolling with one in-flow banner pattern; moved home dialogue below artwork.
6. Final pass: 264/264 combinations passed with 0 structural failures, 0 visual
   warnings, 0 console errors and 0 broken HTTP responses.

## Primary interactions tested

- Create a hero and render the initial home states.
- Open cases, codex, inventory, journal, laboratory and companion views.
- Navigate every Chapter 2, district incident, Chapter 3 and Chapter 4 state.
- Switch battle actors, inspect help states and render scroll-bottom states.
- Render five coach states, verify safe parent placement and check that no coach
  intersects a fixed footer.
- Verify visible controls, touch targets, asset responses and console output.

## Remaining manual checks

- Screen-reader announcements and focus order.
- Keyboard-only navigation on desktop.
- Formal WCAG contrast measurement and player usability sessions.

final result: passed
