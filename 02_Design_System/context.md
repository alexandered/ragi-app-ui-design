# context.md — 02_Design_System (L1)
> ⚠️ Read `/_foundation/*` FIRST. It is the default truth; this domain must not silently contradict it (file a Foundation Challenge if it's wrong).

## Scope
Stage 2 of 4. Build the tokens, the icon map and the components every screen uses.
- **Input:** the stage 1 navigation map (`01_Requirements_Flows/reference/`); `_foundation/brand-and-tokens.md`, `_foundation/iconography.md`, `_foundation/ui-rules.md`.
- **Process:** define tokens once (JSON is the source, CSS is generated), lock the Lucide icon map, specify each component with all its states, and render them on one living HTML sheet.
- **Output (promote to `reference/`):** `tokens.json` and `tokens.css`, the icon map, component specs, `components.html`.
- **Done when:** the components sheet shows every component in every state; every text and background token pair passes AA; the sheet survives the 130 % text toggle; tap targets are at least 44 px.

## Current priorities
1. Write `tokens.json` from the official palette (D-012: Ragi Gold, Blackout Black, White Hall) and the type decision (D-014), in the playful direction of D-013, with the contrast table re-run and the verdict inks that pass AA.
2. Confirm the Lucide icon map (`reference/icon-map.md` already lists the names verified against the PRD).
3. Core components in dependency order: buttons, fields (including the gram input), badges, list rows, sheets and dialogs, ingredient row, metrics panel, compare table.
4. Typography is decided (D-014: IBM Plex Sans, Vollkorn). Define the type scale, spacing and radius scale; bundle the font files locally.

## Goes in `reference/` (Recipe / permanent)
The permanent design system: `tokens.json` (source) and `tokens.css` (generated), the icon map, component specs, `components.html`. Stage 3 screens may only use what is defined here.

## Goes in `working/` (Cake / ephemeral)
Component experiments, contrast test runs, alternative token sets.

## Key links
- Brand and colour rules -> /_foundation/brand-and-tokens.md
- Icon decision -> /_foundation/iconography.md
- UI rules -> /_foundation/ui-rules.md
