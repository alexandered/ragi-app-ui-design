# glossary.md
> Status: ACTIVE
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

Shared vocabulary: English terms and the Indonesian words that appear in the UI.

> Add terms as they stabilise. UI words are in Bahasa Indonesia; everything else in this workspace is English.

| Term | Definition |
|---|---|
| Recipe (Resep) | Content from the admin backend, the same for every student: name, category, food photo, base portions and base ingredients. Students cannot create, edit or delete it (D-028). Each student's trials of a recipe belong to that student |
| Trial / batch | One baking attempt, numbered per recipe ("Trial #3"); the number is never reused |
| Verdict | The student's own judgement of a trial: Berhasil, Gagal or Belum dinilai (the default) |
| Stable Trial | The one Berhasil trial a recipe designates as its trusted version; at most one per recipe |
| Source label | How a trial was created: new, "Salinan Trial #x" (copy) or "Skala dari Trial #x: a → b porsi" (scaled) |
| Portions (porsi) | Whole number 1–9999 produced by the trial |
| Base ingredients (Bahan resep) | The recipe's ingredient list set by the admin, read-only for students; the starting point of a trial. A trial keeps its own copy |
| Ingredient row | Name, optional brand, type, quantity in grams, water content |
| Ingredient type | Tepung, Cairan, Lemak, Gula, Garam, Ragi, Telur or Lainnya [CR-01] |
| Water content (kadar air) | Percentage of an ingredient that is water; feeds hydration [CR-01] |
| Baker's % | An ingredient's grams divided by total flour, times 100 [CR-01] |
| Hydration | Total water divided by total flour, times 100 [CR-01] |
| pp | Percentage points, used for differences such as "+1,9 pp" |
| Tangzhong | A cooked flour-and-water paste; its flour counts as flour [CR-01] |
| Scale (skalakan) | Recalculate every quantity for a target number of portions; shown as a factor such as "× 2,5" |
| Compare (bandingkan) | Two trials of the same recipe side by side [CR-02] |
| Student, Chef | The two account roles. Only a read-only badge in the profile (D-023): both use the same menus and functions. The Chef reviews a student's trial through the PDF the student sends (D-026) |
| CR-01, CR-02 | Scope additions beyond Overview v2, pending client approval |
| S1–S19, O1–O12 | Screen IDs from PRD §5.4, and overlay IDs from `_foundation/screen-inventory.md` |
| Phase 1 | UI/UX design and application flow, the scope of this workspace |
