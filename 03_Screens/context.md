# context.md — 03_Screens (L1)
> ⚠️ Read `/_foundation/*` FIRST. It is the default truth; this domain must not silently contradict it (file a Foundation Challenge if it's wrong).

## Scope
Stage 3 of 4. Design every screen and state as a clickable HTML prototype.
- **Input:** stage 1 briefs and flows (`01_Requirements_Flows/reference/`); stage 2 tokens, icons and components (`02_Design_System/reference/`).
- **Process:** one HTML file per screen or overlay, with a state switcher for every state listed in `_foundation/screen-inventory.md`; wire them into one clickable flow (`index.html`); track status in `working/board.json`.
- **Output:** the prototype folder, the A4 PDF report layout (print stylesheet), and the approved-screens list.
- **Done when:** every screen on the board has all its states, passes the screen checklist in `_foundation/workflow.md`, and CR-01 and CR-02 screens are tagged and separable.

## Status (2026-09-30)
Round 1 built: all 19 screens and 12 overlays, every state reachable, in `working/` and marked `review` in `board.json`. Nothing is promoted to `reference/` until RAGI accepts it (stage 4). See `working/README.md` for how to run it and what was checked.
2026-10-01: S8, S19 and the S7 ingredient rows polished after the critique (D-029, D-031) and photos made local (D-030). Next: S6 "Bahan resep", the text floor.
2026-10-01: S6 "Bahan resep" is a closed summary card and the text floor is 14 px (13 px for uppercase section titles) (D-033). Every critique item is closed. Next: the RAGI review (stage 4).

## Current priorities (round 1 done; next is review)
1. Student core loop first: S3, S4, S6, S7 (with empty, validation and saving states), S8, S9.
2. (Removed, D-026: there are no Chef screens.) Next: review round with RAGI.
3. Global states (S18), Splash and Login (S1, S2), profile (S11, S12).
4. CR-02 Compare (S19) and the CR-01 dough metrics panel, tagged and separable.
5. The A4 PDF report layout.

## Goes in `reference/` (Recipe / permanent)
Finished screens (HTML), the clickable flow and the approved-screens list. A screen is promoted here once the client has accepted it (stage 4).

## Goes in `working/` (Cake / ephemeral)
In-progress screens, the `board.json` status tracker, variants, review notes.

## Key links
- Screen list and states -> /_foundation/screen-inventory.md
- Screen checklist and prototype rules -> /_foundation/workflow.md
- Fixed strings and formats -> /_foundation/content-language.md
