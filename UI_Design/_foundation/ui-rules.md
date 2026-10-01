# ui-rules.md
> Status: ACTIVE
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

Business rules and accessibility rules that constrain every screen: grams, verdicts, roles, states and formats.

> Design digest of PRD §3.3, §6.2, §6.3 and §6.5. The PRD wins on conflict. Tags: [CR-01] dough metrics, [CR-02] comparison, [ASSUMPTION] not yet confirmed by RAGI.

## Roles (BR-02, BR-03)
- **One experience for everyone (D-023, D-026; supersedes D-007).** Student or Chef is a label only: it shows as a read-only badge in the profile. Every account gets the same three tabs (Beranda, Resep, Profil) and every function: create and edit recipes and trials, verdict, Stable, copy, scale, compare, export PDF, change password, log out.
- **Everyone only ever sees their own data.** There is no search, no list of people and no read-only view of someone else's work. The Chef reviews a student's trial through the PDF the student sends (PDF-01), outside the app. The PDF therefore has to stand on its own: it needs no account and no link back to the app.
- Differs from Overview v2 and needs RAGI's written approval (PRD v0.4, CR-03): the Chef features (§4J, §4K) are removed, and the Chef gets Change password and can create recipes.

## Quantities and numbers (BR-05, BR-06)
- Every quantity is in grams. Show the "g" suffix next to every quantity. There is no unit field. Never show "kg".
- Up to 2 decimals, trailing zeros hidden (`250`, `12,5`, `0,33`). Indonesian format: decimal comma, thousands dot. Input accepts `,` and `.`; use a locale-aware numeric keypad.
- Percentages: 1 decimal, half-up, written as in the PRD examples (`93,8 %`) [ASSUMPTION: confirm the space before the % sign]. Differences use pp (`+1,9 pp`) and grams (`+10 g`).
- A scaled amount that rounds to 0 shows `< 0,01` with a warning.

## Field limits
Recipe name 1–100 characters, category required · trial date defaults to today and cannot be in the future · portions: whole number 1–9999 · at least 1 ingredient row · ingredient name 1–60, brand at most 60 (optional), type required, grams above 0 · result, notes and "Perubahan untuk trial berikutnya": at most 2000 characters each, three separate fields.

## Ingredient types (BR-09) and water content (ING-03) [CR-01]
Tepung, Cairan, Lemak, Gula, Garam, Ragi, Telur, Lainnya: a fixed list, to be confirmed by the Chef [ASSUMPTION]. A new row has no type until one is picked; Save is blocked until every row has one. Water content (kadar air, 0–100 %) defaults by type (Cairan 100 %, Telur 75 %, all others 0 %), sits behind an "Advanced" toggle, shows only when it differs from the default, and resets when the type changes.

## Categories (BR-07)
Roti, Cake, Pastry, Cookies, Dessert, Lainnya: a fixed list served by the API [ASSUMPTION].

## Verdict and Stable Trial (BR-10, TRL-04, STB-01)
- Three states, set only by the student: Berhasil (green), Gagal (red), Belum dinilai (grey, the default). Always a badge with icon, text and colour, never colour alone.
- Only a Berhasil trial can be the Stable Trial; at most one per recipe. The Stable Trial is pinned at the top of Recipe Detail and also appears in the history. The Stable badge shows in lists, detail, PDF and Chef views.
- Trial source label: "Salinan Trial #3" or "Skala dari Trial #2: 12 → 24 porsi" (the `source` field is an [ASSUMPTION] that needs a backend field).

## Dough metrics display (MET-01) [CR-01]
- Each ingredient row shows its baker's % next to its grams. A panel shows total dough weight, total flour, total water, hydration, fat %, sugar %, salt % and yeast %.
- Values recalculate instantly (under 100 ms) on every edit and are read-only.
- With no `Tepung` row every percentage shows "—" plus the hint "Tambahkan bahan bertipe Tepung untuk menghitung baker's %"; total dough weight stays; saving is not blocked.

## Scaling display (SCL-01, SCL-02)
The preview shows the factor (`× 2,5`) and every scaled row. Everything stays in grams; ratios and baker's % stay the same. Invalid target (0, negative, decimal, empty): "Gunakan" is disabled with an inline error. Nothing is saved until Save.

## Compare display (CMP-01) [CR-02]
Two trials of the same recipe side by side. Per column: trial number, date, verdict, Stable badge, portions and dough metrics, with differences. Ingredients are matched by name; changed rows are highlighted; a row in one trial only reads "Hanya di Trial #x". Actions: "Tukar" and "Hanya tampilkan perbedaan". A note appears when the portions differ.

## States every screen needs (PRD §6.5, S18)
- Every API-backed screen: loading, empty (first use), no results (search or filter), error with retry.
- Every write: saving (button disabled, no double submit) and failure (input kept on screen). Unsaved-changes guard in the editor.
- Global: offline banner, session expired (back to Login with a message), generic error, force logout.

## Accessibility and platform (PRD §6.5)
- Tap targets at least 44 pt. System font scaling up to 130 % must not break any layout. Sufficient colour contrast: use WCAG 2.2 AA as the measure [ASSUMPTION: the PRD names no standard].
- Phone, portrait only; tablets use the phone layout. Android 8.0+ and iOS 14+ [ASSUMPTION].
- Speed cues: lists and details render under 1 s after the API answers (use skeletons); the PDF takes under 3 s for 50 ingredients or fewer (show a generating state).
