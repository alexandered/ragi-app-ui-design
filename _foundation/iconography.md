# iconography.md
> Status: DRAFT — proposed, awaiting ratification
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

Icon pack decision (Lucide), verified facts, known gaps, and the rules for using icons.

> Proposed, not yet ratified. Package facts checked 2026-09-29.

## Decision (proposed)
Use **Lucide** (ISC licence, free for commercial apps). Reasons: the walkthrough deck already uses it (`react-icons/lu`: CircleCheck, CircleX and Hourglass for the verdicts, GitCompare, Percent, NotebookPen and more); it covers all 54 UI concepts derived from the PRD; both cross-platform stacks have an active package while the framework is undecided.

## Facts [VALID UNTIL 2026-12]
- React Native: `lucide-react-native` 1.48.0, published 2026-09-24; needs `react-native-svg`.
- Flutter: `lucide_icons_flutter` 3.1.20, published 2026-09-15; community-maintained; bundles Lucide 1.46.0, so `cupcake` is missing there. Do not use `lucide_icons` (stale since 2023).
- Every name in the icon map exists in both packages except `cupcake` (Flutter). `history` and `trash-2` are aliases in the RN package.
- The prototype uses Lucide SVGs directly, so package status only matters at development time.

## Gaps
Lucide has no plain bread, salt, sugar, yeast, butter or fat, whisk, oven, rolling pin or mixing bowl. Butter is missing from every pack checked (Lucide, Tabler, Phosphor, MDI, Material Symbols, Hugeicons). The PRD does not require icons for ingredient types, so default to text chips. If RAGI wants them: Tabler (MIT) has `bread`, `salt`, `whisk`; MDI (Apache-2.0) has `sugar`, `yeast`; draw the rest on Lucide's grid. Keep the licence notices.

## Alternatives not chosen
- Phosphor (MIT): more weights (fill, duotone), but its Flutter package was last released in May 2024.
- Hugeicons Free (MIT): has whisk, rolling pin, oven, bread and croissant, but looks different from the deck.
- MDI (Apache-2.0): best baking coverage (sugar, salt, yeast), but its solid style clashes with outline icons.

## Usage rules
1. One icon family per screen: no emoji, no mixed sets. Gap-fill icons only if drawn on Lucide's grid.
2. 24 px grid, 2 px stroke by default; sizes 20 or 24 px inside a tap target of at least 44 px.
3. Colour from tokens only. An icon that carries meaning needs at least 3:1 against its background.
4. Verdict icons: `circle-check` (Berhasil), `circle-x` (Gagal), `hourglass` (Belum dinilai), always with the text label.
5. Decorative icons are hidden from assistive tech; icon-only buttons need an accessible label.

Full mapping: `02_Design_System/reference/icon-map.md`.
