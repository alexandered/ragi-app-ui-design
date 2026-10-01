# screen-inventory.md
> Status: ACTIVE
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

S1–S19 with roles, stories and states, plus the overlays the stories imply (O1–O13) and the PDF layout.

> S1–S12, S18 and S19 come from PRD §5.4 (v0.4; S13 to S17 were removed). O1–O12 and the PDF layout are derived from the stories and are not in §5.4 [ASSUMPTION: confirm they belong in the Phase 1 list]. Tags: CR-01 dough metrics, CR-02 comparison.

## Screens (PRD §5.4)
| ID | Screen | Role | Stories | States to design | Tag |
|---|---|---|---|---|---|
| S1 | Splash / session check | Both | AUTH-01 | loading, token expired | |
| S2 | Login | Both | AUTH-01, AUTH-02 | validation error, wrong credentials, network error | |
| S3 | Dashboard | Both | PRD §5.2 [ASSUMPTION: recent recipes and a quick "New trial"] | empty (first use), populated | |
| S4 | Recipes (list with photos, search, filter) | Student | REC-02 | empty, no results, loading, error | CR-04 |
| S5 | ~~Create / Edit Recipe~~ removed (D-028): recipes come from the admin | n/a | REC-01, REC-03, REC-04 retired | n/a | CR-04 |
| S6 | Recipe Detail (photo, base ingredients, Stable Trial + history) | Student | REC-05, HIS-01, STB-01, CPY-01, CMP-01 | no trials, no stable trial, populated, verdict filter with no results | CR-02 (Compare entry) |
| S7 | Trial Editor (new / copy / scaled / edit) | Student | TRL-01, TRL-02, ING-01 to ING-03, SCL-02, CPY-01, MET-01 | unsaved-changes guard, validation, saving, metrics without flour | CR-01 (types, water content, metrics) |
| S8 | Trial Detail | Student | TRL-04, STB-01, HIS-01, CPY-01, SCL-01, PDF-01, MET-01, CMP-01 | stable badge, verdict badge, source label, dough metrics | CR-01 (metrics), CR-02 (Compare entry) |
| S9 | Scale Recipe sheet (from trial and from editor) | Student | SCL-01, SCL-02 | invalid portions, preview | |
| S10 | PDF Preview / Share | Student | PDF-01 | generating, error | |
| S11 | Profile / Edit Profile (role shown as a read-only badge) | Both | AUTH-04, AUTH-05 | none listed | |
| S12 | Change Password | Student | AUTH-03 | validation, wrong current password | |
| S18 | Global states (offline banner, session expired, generic error, force logout) | Both | BR-04, AUTH-01 | as named | |
| S19 | Compare Trials (pick a trial + side-by-side) | Both | CMP-01 | only one trial in the recipe, no differences, ingredient only in one trial | CR-02 |

**S13 to S17 are removed** (PRD v0.4, CR-03, D-026): Chef dashboard and search, person detail, read-only recipe and trial views, recipe search. The numbers are not reused. There are no role versions: every screen is the same for every account, and the role only shows as a badge in S11.

## Overlays and components the stories imply (not in PRD §5.4)
| ID | Overlay | Stories | Note |
|---|---|---|---|
| O1 | Verdict sheet (verdict + Result text) | TRL-04 | opens from Trial Detail ("Beri verdict") |
| O2 | Ingredient type picker and the "Advanced" water-content toggle | ING-03 | CR-01 |
| O3 | Category filter (chips on S4) | REC-02 | fixed list from the API (BR-07) |
| O4 | Date picker (no future dates) | TRL-01 | |
| O5 | Trial picker for Compare, with verdict badges and filter | CMP-01 | CR-02 |
| O6 | Verdict filter: Semua / Berhasil / Gagal / Belum dinilai | HIS-01 | Recipe Detail history and the Compare picker |
| O7 | Confirm dialogs: log out, delete trial (Stable warning), discard changes, move Stable Trial, change the Stable Trial's verdict | AUTH-05, TRL-03, TRL-01, STB-01, TRL-04 | six dialogs, one component |
| O8 | Snackbar with undo (ingredient row removed); success toast after a password change | ING-01, AUTH-03 | toast is [ASSUMPTION] |
| O10 | Ingredient name suggestions (2+ characters, max 8, most-used first) | ING-02 | |
| O11 | Ingredient row gestures: drag handle to reorder, swipe or icon to delete | ING-01 | |
| O12 | App icon and splash artwork | S1, PRD D4 | RAGI should supply the icon; design a fallback if not |
| O13 | Start a trial: from the recipe's base ingredients, from a previous trial, or empty | TRL-05, TRL-01, CPY-01 | [ASSUMPTION, D-027] sheet opened by "Trial baru" on S3 and S6 when the recipe has base ingredients or trials |

The native share sheet (PDF-01) is OS UI: design the trigger and the S10 states only.

## PDF report layout (PDF-01), a design deliverable
A4 portrait, generated on the device. Order: 1 header with the RAGI logo and the title "Laporan Trial Resep"; 2 student (name, email); 3 recipe (name, category); 4 trial (number, date, portions, verdict, Stable status, source label); 5 ingredients table (No, Bahan, Merek, Tipe, Jumlah (g), Baker's %); 6 dough metrics block [CR-01]; 7 results; 8 journal notes; 9 "Perubahan untuk trial berikutnya"; 10 footer with the generated date and time and page X of Y. Long tables and notes continue on extra pages without cutting rows. Build it in stage 3 as an HTML print layout.

## States every list or form needs
Loading, empty (first use), no results (search or filter), error with retry; saving and failure for every write (input kept). Global states are S18.
