# Design QA — Nocturne Ritual

**Findings**

- No actionable P0, P1, or P2 differences remain in the verified implementation.
- The remaining narrative and meta surfaces now use the same authored Nocturne visual language as the selected battle concept. Eight new raster scenes cover the main house, archive, memory apartment, pact, bus stop, First Light square, clandestine warehouse, and Mirror Sediment boss.
- [P3] The production battle is longer than the selected concept.
  Location: Chapter 2 battle, `.battle-main-v1`.
  Evidence: the concept presents the objective, actors, four spells, and end-round action in one tall composition; the production game keeps its additional witness health, investigation bonuses, targetable roots, and explanatory state, so the same hierarchy continues through an internal vertical scroll.
  Impact: this is a small fidelity difference, but it preserves existing combat rules and keeps tap targets and explanatory text readable.
  Fix: none required for acceptance. A future compact-combat preference could collapse enemy diagnostics after the first round.

**Open Questions**

- None blocking. The longer battle surface is treated as an intentional product constraint rather than design drift.

**Implementation Checklist**

- [x] Replace symbolic/emoji battle art with authored raster artwork.
- [x] Apply obsidian, antique-gold, and ritual-violet tokens across the app.
- [x] Add real hero, companion, and spell imagery.
- [x] Match the selected 2×2 spell layout and prominent end-round action.
- [x] Preserve existing save data, battle rules, navigation, and action states.
- [x] Verify representative screens and the complete deterministic UI state suite.
- [x] Replace remaining abstract room, investigation, outcome, and Chapter 3–4 scene art with authored raster images.
- [x] Map the complete 61-state screen atlas without changing navigation, save data, quest logic, alchemy, or combat rules.
- [x] Add responsive crops for compact, standard, and wide mobile viewports.

**Follow-up Polish**

- Optional: add a user preference for a more condensed battle objective after onboarding.

## Evidence

- Source visual truth: `assets/design-reference/obsidian-ritual-selected.png`
- Browser-rendered implementation: `tests/screenshots/nocturne/c2-battle-hero-390x844.png`
- Focused action-state capture: `tests/screenshots/nocturne/c2-battle-hero-lower-390x844.png`
- Combined comparison: `tests/screenshots/nocturne/comparison-final.png`
- Remaining-screen art pack: `tests/screenshots/nocturne/scenes-v2-art-pack.jpg`
- Selected-direction comparison for the new Chapter 4 boss: `tests/screenshots/nocturne/scenes-v2-comparison.png`
- Automated verification: `tests/screenshots/nocturne/verification.json`
- State: Chapter 2, Памятный плющ, round 1, hero actor selected.
- CSS viewport: `390 × 844`.
- Browser capture: `390 × 844` pixels at deviceScaleFactor `1`.
- Source pixels: `852 × 1846`; normalized to `390 × 844` for comparison. The ratios differ by less than 0.2%, so normalization used an explicit same-size resize without a device frame.
- Full-view comparison evidence: the combined comparison confirms the same dark-fantasy palette, cinematic enemy art, gold serif hierarchy, violet objective treatment, portrait selector, spell icon language, card borders, and primary end-round emphasis.
- Focused region evidence: the lower battle capture confirms the 2×2 spell grid, generated spell assets, selected actor state, disabled/action-cost states, readable copy, and persistent end-round action. A separate crop was not needed because the action capture renders these details at their native 390 px width in the combined comparison.

## Required Fidelity Surfaces

- Fonts and typography: local Georgia display serif plus system sans-serif body text preserve the source hierarchy without a network font dependency. Display weights, compact uppercase labels, line heights, wrapping, and mobile truncation were checked in rendered captures.
- Spacing and layout rhythm: 10–20 px mobile spacing, thin gold dividers, compact radii, objective rhythm, actor tabs, 2×2 action grid, and footer proportions match the selected direction. The longer production battle is the accepted constraint described above.
- Colors and visual tokens: near-black canvas, obsidian panels, antique-gold borders/type, ritual violet interaction states, muted silver copy, green success, and rose danger states are centralized in `css/nocturne-ritual-v1.css`.
- Image quality and asset fidelity: battle, laboratory, portrait, and spell visuals are raster assets with correct object-fit crops. No selected-design imagery is represented by emoji, div art, inline SVG, or placeholder glyphs in the themed presentation layer.
- Scene coverage: home and meta rooms, Chapter 2 memory scenes and pact outcomes, the district incident, Chapter 3 investigation/training/outcomes, and Chapter 4 warehouse/boss/outcomes all resolve to real authored images through `js/nocturne-scenes-v2.js` and `css/nocturne-scenes-v2.css`.
- Copy and content: Russian game-specific names, objectives, intent, action descriptions, costs, and consequences remain tied to the existing mechanics. The start screen copy was rewritten as player-facing narrative rather than release/debug text.

## Comparison History

1. Initial comparison — blocked.
   - [P1] Chapter 3 and 4 battles used large symbolic SVG/glyph illustrations instead of cinematic authored art.
   - [P2] The home-scene headline collided with the Morven dialogue card.
   - [P2] Battle actions fell back to a one-column mobile layout, drifting from the selected 2×2 spell grid.
   - [P2] Three-actor labels wrapped letter-by-letter and the Chapter 2 investigation title truncated.
2. Fixes applied.
   - Replaced Chapter 3 battle art with `assets/art-v3/ritual-battle.webp` and Chapter 4 battle art with `assets/art-v3/alchemy-lab.webp`.
   - Rebalanced the home-scene copy width, headline size, and overlay.
   - Added a high-specificity 2×2 action grid, compact 46 px spell icons, and centered three-actor portrait tabs.
   - Reduced the mobile Chapter 2 title to a fixed 20 px rendered size and preserved normal word breaking.
3. Post-fix visual evidence.
   - `tests/screenshots/nocturne/home-early-390x844.png`
   - `tests/screenshots/nocturne/c2-investigation-390x844.png`
   - `tests/screenshots/nocturne/c3-battle-390x844.png`
   - `tests/screenshots/nocturne/c4-battle-hero-390x844.png`
   - `tests/screenshots/nocturne/comparison-final.png`
4. Final browser verification.
   - 61/61 deterministic states passed at `320 × 568`, `390 × 844`, and `430 × 932`.
   - Representative start, home, investigation, alchemy, and Chapter 2–4 battle captures returned no failures or warnings.
   - Hero-to-Morven actor switching succeeded and enabled battle actions remained available.
   - Broken assets: none.
   - Console errors: none.
5. Remaining-screen pass.
   - Captured and visually reviewed all 61 deterministic states at `390 × 844` as a four-sheet atlas.
   - Re-ran all 61 states at `320 × 568`, `390 × 844`, and `430 × 932`: 183/183 state/viewport combinations passed with zero warnings, zero broken assets, and zero console errors.
   - Confirmed the generated assets contain no embedded UI text and retain useful dark negative space for headings, hotspots, dialogue, and battle objectives.

final result: passed
