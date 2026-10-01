# components.md

Load when building a stage 3 screen: every component, its states, the tokens it uses and the stories it serves. Live version: `components.html`.

> Stage 2 output (D-019). Direction D-013: brand-led, playful touches. All colours, type and spacing come from `tokens.json` (via `tokens.css`); `components.css` holds no raw colours. Small internal dimensions (badge height, spinner size) are component-local. Tags: [CR-01] dough metrics, [CR-02] compare.

## How screens use this
```html
<link rel="stylesheet" href="../02_Design_System/reference/tokens.css">
<link rel="stylesheet" href="../02_Design_System/reference/components.css">
... <i data-i="star"></i> ...
<script src=".../icons.js"></script><script src=".../logic.js"></script><script src=".../ui.js"></script>
```
Icons: `<i data-i="name"></i>` (Lucide, names in `icon-map.md`). Logic: `RAGI.metrics`, `RAGI.scale`, `RAGI.compare`, `RAGI.fmtNum` and friends (`logic.js`, tested by `logic.test.js`). `RAGI.setTextScale(1.3)` is the 130 % check.

## Component list
| Component | Classes | States shown | Used by | Notes |
|---|---|---|---|---|
| Button | `.btn` + `--primary --gold --tonal --secondary --text --danger`, `--sm`, `--block` | default, pressed (spring), disabled, loading, on ink | all | Label in Vollkorn Bold (brand guide). 52 px high, 44 px small. Loading and disabled block double submit. Primary = ink; gold for the single most friendly action per screen `--block` keeps 16 px side padding so long labels such as "Gunakan untuk batch berikutnya" stay on one line at 390 px. |
| Icon button, FAB | `.btn-icon`, `.fab` | default, pressed, tonal | app bars, "Trial baru" | 44 px minimum. Always needs an `aria-label` |
| Action tiles | `.act-row` + `.act-tile` | default, pressed (spring), label wraps | S8 | D-029. Quiet secondary actions under one primary button: icon over label, 64 px high, gold tint. Three across; the grid reflows to two + one when the text is large (130 %) or the screen is narrow. Labels stay in Vollkorn Bold like buttons |
| Text field | `.field` `.input` | empty, focus, filled, error, disabled, warning | S2, S5, S7, S11, S12 | 2 px border at 3:1. Error uses icon + text, not colour alone |
| Search field | `.input-wrap.search` | default | S4 | Pill shape |
| Password field | `.input-wrap--right` + eye button | hidden | S2, S12 | |
| Select / picker | `.select` | empty, filled | O2, O3 | Opens a sheet, never a native dropdown |
| Gram input | `.gram` | filled, decimal, error | S7, O2 | Always shows the g suffix (BR-06); right-aligned tabular figures; accepts `,` and `.` (BR-05); `inputmode="decimal"` |
| Text area | `.textarea` + `.textarea__count` | filled, counter | S7, O1 | 2.000 character limit |
| Chip | `.chip[aria-pressed]` | default, selected | S4, O2, O3, O6 | Selected = gold fill, ink text |
| Segmented | `.segmented` | default, selected | O6 | Selected = ink fill |
| Verdict picker | `.verdict-picker [data-v]` | 3 states | O1, S7 | Icon + label + colour (TRL-04) |
| Badge | `.badge--berhasil --gagal --belum --stable --source --category --cr`, `.pct` | all | S3 to S8, S19 | Verdict never by colour alone. `--cr` marks CR-01 and CR-02 elements on the board |
| Avatar | `.avatar`, `--lg` | initials | S3, S11 | No photos (AUTH-04) |
| Card | `.card`, `--hero`, `--stable`, `--empty-stable` | default | S3, S6 | Stable card is the largest friendly element on Recipe Detail |
| Food photo | `.thumb` (64 px, rows), `.photo` (16:10 hero) | photo, fallback icon (no photo or load error) | S3, S4, S6 | D-027. `h.thumb(recipe)` and `h.photo(recipe)`; the fallback is the category icon on gold tint. List photos decorative (`alt=""`), hero has an `alt` |
| Row | `.row` (+ `__main __title __meta __excerpt __tags`) | recipe, trial | S3, S4, S6 | One tappable card per item, whole row is the target |
| App bar | `.appbar`, `--large` | standard, large | all | 56 px. Large = the three tab roots: title left, optional action right, one 72 px row. Icon glyphs line up with the 20 px gutter |
| Tab bar | `.tabbar` `.tab` | 3 tabs (Beranda, Resep, Profil), active | D-023, D-026 | Same for every account. Active tab: gold pill behind the icon |
| Sheet | `.sheet` + `.scrim` | verdict sheet | O1, O2, O3, O4, O5, S9 | Springy rise; respects reduced motion |
| Dialog | `.dialog` | confirm, destructive | O7 (six uses) | Cancel left, action right; destructive uses `.btn--danger` |
| Snackbar | `.snackbar` | undo, success | O8 | |
| Banner | `.banner--offline --error --warn --info` | 4 | S18 | Offline banner is full width, ink |
| Skeleton / spinner | `.skeleton`, `.spinner` | loading | every list and detail | |
| Empty state | `.empty` | first use, no results, error | S3, S4, S6 | Warm copy, one clear next action |
| Ingredient row | `.ing` (`__handle __top __main __name __grams __del __meta __type __toggle __notes __brand __adv`) | normal, brand caption, advanced (merek, kadar air), invalid (with messages), dragging, suggestions open | S7 | [CR-01] for type, water content, baker's %. **Two lines (D-031):** name + grams, then type chip + baker's % + Lanjutan; about 128 px per row (was 236). The left rail holds the drag handle (line 1) and delete (line 2), a non-gesture alternative to swipe. No per-row labels: the section title says "Bahan (gram)" and every control has an aria-label; each row is a `role=group` named "Bahan n". The lines wrap by themselves (flex-wrap on `em` thresholds) at 130 % text, so the row becomes three or four lines instead of clipping. A long name ends in an ellipsis. Brand shows as a caption when set; brand and water content sit under "Lanjutan". Errors are listed under the row and tied to the controls with `aria-describedby` |
| Name suggestions | `.suggest` | hover | O10 | Shows last type and water content as a hint |
| Metrics panel | `.metrics` | with flour, without flour, changing | S7, S8 | [CR-01]. Live demo matches the PRD example exactly |
| Ingredient table (read-only) | `.itable` `.irow` | populated | S8 | |
| Compare | `.cmp` (`__titles __meta __col-meta __when __row __cell __diff __only`, row modifiers `.is-changed .is-same`) | changed row, only-in-one, unchanged | S19 | [CR-02]. Name spans the row, two values beneath. `__titles` (Trial #3 | Trial #5) is sticky, so the columns stay named while the table scrolls; `.cmp` uses `overflow: clip` (not `hidden`) so the bar can stick. `__meta` (verdict, Stable, date) scrolls away. `.is-same` rows are tight, with grams and baker's % on one line (D-029) |
| Compare summary | `.cmp-sum` (`__title __list __item`) | with changes, many changes (+n lainnya) | S19 | [CR-02]. D-029. "N bahan berubah" and one pill per changed ingredient ("Butter +10 g", "Susu bubuk hanya di Trial #5"), shown before the table. Uses baker's % instead of grams when the portions differ; hidden when nothing changed |
| Scale preview | `.scale-factor`, `.scale-row` | valid, invalid, tiny value | S9 | Invalid disables "Gunakan" |
| Stable celebration | `.celebrate .spark` | one-shot | S6, S8 | The playful moment; hidden under reduced motion |

## Layout rhythm (D-024)
Page gutter 20. Between blocks 16, between sections 24, between list cards 12. Card padding 16; feature cards (hero, Stable, metrics) 20. Bottom safe area 30 for sheets and action bars. `--gutter` is an alias of `--s-gutter` in `components.css`.

## Motion (D-013)
Press: scale 0.94 to 0.97 with the spring curve, 150 ms. Sheets and dialogs: 220 to 360 ms with the spring. Metrics numbers roll up 6 px on change. Under `prefers-reduced-motion` all durations drop to 1 ms, springs become linear and the celebration is hidden.

## Verification (2026-09-30)
- Contrast: 21 of 21 pairs pass (`contrast-report.md`, regenerate with `python3 build_assets.py`).
- Logic: `node logic.test.js` passes the PRD scenarios for MET-01, SCL-01, CMP-01 and the number format.
- Layout: no horizontal overflow at 390 px, at text scale 1 and 1.3.
- Tap targets: all buttons, chips, tabs, selects and inputs at least 44 px.
- Not yet covered: 360 x 640 check, real-device font rendering, screen-reader pass. These belong to stage 3.

## Open
- The metric labels in Indonesian (`Berat adonan`, `Total tepung`, `Total air`, `Hidrasi`, `Lemak`, `Gula`, `Garam`, `Ragi`) and `Lanjutan` for the water-content toggle are ours: list them in the handoff string sheet and mark them proposed.
- Vollkorn Bold on the 44 px small buttons reads fine at 14 px in the sheet; confirm on a real phone.
- The ingredient row leaves a narrow gutter for the delete button; consider moving delete to a swipe plus the row menu in stage 3 if the row feels tall.
