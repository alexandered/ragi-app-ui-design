# RAGI prototype (stage 3)

Clickable HTML prototype of the PRD v0.5 scope in Bahasa Indonesia: 13 screens (S1 to S4, S6 to S12, S18, S19; S5 was removed, students cannot create recipes) and 12 overlays (O13 added, O9 removed). One experience for everyone (D-023, D-026): three tabs, no Chef screens, no Cari. Student or Chef is only a badge in the profile; the Chef reviews the PDF a student sends. Status: round 1 plus the role merge and a spacing pass, in review (see `board.json`).

## Run it
```bash
python3 serve.py   # from the repo root
```
Open http://localhost:8765/03_Screens/working/index.html. A server is needed because the prototype loads fonts and scripts by relative path; `serve.py` sends no-cache headers so edits show on reload.

## Use it
- Left panel: sign in as a demo account (Sari is a Siswa, Rina is a Chef; everything is identical except the badge in the profile), jump to any screen or overlay, flip a screen into any state listed for it (empty, error, validation, saving and so on), and run the checks (Teks 130 %, 360 × 640, Offline).
- Or just click through. Demo accounts: `siswa@ragi.id` and `chef@ragi.id`, password `ragi1234` (prototype only).
- Everything writes to in-memory data (recipes come from the catalogue and cannot be created): create trials, give verdicts, set and move the Stable Trial, copy, scale, compare, export a PDF preview. Reload or "Reset data" to start over.
- URL parameters (shareable): `?screen=S8&state=stable&role=student`, plus `ts=1.3`, `size=small`, `panel=0` (hide the panel).
- Print layout: `report.html?r=r1&n=3` (A4, print to PDF from the browser).

## Files
| File | What |
|---|---|
| `index.html`, `proto.css`, `app.js`, `boot.js` | Shell: phone frame, router, overlays, control panel, shared UI kit |
| `data.js` | Invented sample data. The dough example is the PRD MET-01 and CMP-01 example |
| `screens/auth.js` | S1, S2, S11, S12 |
| `screens/student.js` | S3, S4, S6, S8 |
| `screens/editor.js` | S7 Trial Editor and the S9 scale sheet |
| `screens/compare.js` | S19 |
| `screens/report.js`, `report.css`, `report.html` | S10 and the A4 report layout (PDF-01) |
| `screens/global.js` | S18 |
| `screens/overlays.js` | O1 to O13, pickers and dialogs |
| `assets/photos/` | The 7 recipe food photos as local files (`r1-hero.jpg`, `r1-thumb.jpg` and so on), D-030 |
| `photo-credits.html` | Credits of the hotlinked food photos (Wikimedia Commons) |
| `board.json` | Status of each screen and overlay (`node tools/build_board.js` regenerates it) |
| `tools/check_actions.js` | Fails if a `data-act` or `data-in` has no handler |

Design system files are read from `../../02_Design_System/reference/` (tokens, components, fonts, icons, `logic.js`). Screens use tokens and components only.

## Checks run on 2026-09-30
- 176 combinations (2 users, every screen state and overlay variant) render without errors or `undefined`/`NaN` text.
- No horizontal overflow, and every tap target at least 44 px, at 390 × 844 and 360 × 640, at text scale 1 and 1.3.
- Both demo users get the same three tabs and the same functions. Nobody can see another person's data.
- Sheets and dialogs are modal (audit P1, fixed 2026-10-01): the screen behind is `inert`, focus moves in (the sheet itself, so its title is announced; the first, cancelling button for a dialog), Tab wraps inside, Esc closes, and focus returns to the control that opened it, or to its twin after a re-render, or to the screen title after navigation. Verified with real Tab presses and across all 25 overlay variants.
- Layout rhythm: every block sits on the 20 px gutter on both sides at 390 and 360 px, at text scale 1 and 1.3; no odd gaps between blocks.
- A scripted student flow passes end to end: login, search, copy a trial, edit grams, save, verdict, move Stable, compare, PDF.
- Dough numbers match the PRD example (93,8 % / 54,8 % / 9,4 % / 7,5 % / 1,7 % / 1,3 %); scaling keeps ratios.

## Checks run on 2026-10-01 (S8 and S19 polish, D-029)
- 32 combinations (S8 stable, gagal, belum and a non-Stable Berhasil trial; S19 default, no difference, different portions and one trial; each at 390 and 360 px, at text scale 1 and 1.3): no horizontal overflow, every tap target at least 44 px, every block on the 20 px gutter, no clipped text.
- S8: all six trials of the first recipe were clicked through (primary, tiles and every ⋮ row): no dead action; "Jadikan Stable Trial" on a non-Stable Berhasil trial opens the move-Stable dialog. The ingredient list starts at y=421 to 475 instead of y=599 (844 px screen).
- S19: the title bar sticks (offset 0 at every scroll position) and is released at the end of the table; the two column titles share one baseline; the cause (Butter, Susu bubuk) is in the summary at y=124 instead of 1,538 px down.
- Impeccable detector in the live DOM (S8, S19): only false positives or known exceptions remain (`nested-cards` from the phone bezel, the 16 px chip padding, the 10 px tag that belongs to this prototype's own control panel, the tight Operate type scale).
- S7 two-line rows (D-031), 24 combinations (six states at 390 and 360 px, text scale 1 and 1.3): no overflow, tap targets at least 44 px, gutter intact, no clipped grams. At 100 % every row is two lines at 390 and 360 px (128 px; 154 with a brand caption), including a stress row (one flour at 100,0 %, an 8-digit quantity, a 28-character name, "Lainnya"). 22 scripted interactions pass: add, suggestions, type picker, grams updating the metrics, Lanjutan, delete and undo, keyboard and pointer reorder, validation and aria wiring.
- Fixed on the way: `?ts=1.3` blanked the prototype because `boot.js` set the text scale before the first screen existed.

## Checks run on 2026-10-01 (S6 "Bahan resep" and the text floor, D-033)
- 236 combinations (every screen and overlay in every state, at 390 × 844 and 360 × 640, at text scale 1 and 1.3): no horizontal scroll, no element outside the phone, every tap target at least 44 px, no clipped text, no `undefined`/`NaN`, no script errors. The checker was itself tested against a planted 30 px button and a 600 px block.
- S6: "Riwayat trial" starts at y=775 below the app bar instead of y=1,385 with the card closed. The card opens and closes by click and by Enter, keeps focus on its button, and updates `aria-expanded` and the body's `hidden`.
- No text inside the phone is below 14 px except section titles (13 px uppercase) and the `CR` review tag.

## Photos (D-027, D-030)
Recipe photos are local copies of Wikimedia Commons files in `assets/photos/` (7 recipes, hero 960 px and thumb 250 px, 1.5 MB), so the prototype works offline. Licences and credits: `photo-credits.html`. The real photos come from the admin backend.

## Not done or not verified
- Real devices, real fonts rendering on Android, and a screen-reader pass.
- Keyboard: handles reorder with arrow keys; full focus-order review is pending.
- The date picker cannot show disabled future days because the prototype's "today" (30 Sep 2026) is the last day of the month; the next-month arrow is disabled instead.
- The A4 report is the visual spec. The app generates the real PDF on the device; page numbers use print margin boxes (Chrome 131 or newer).
- Every string the PRD does not give is ours and marked proposed (list them in the stage 4 handoff string sheet).
