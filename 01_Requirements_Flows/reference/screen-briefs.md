# Screen briefs 
> Stage 1 output, approved by Alex 2026-09-30 (D-018). One brief per screen (S1 to S19) and overlay (O1 to O12). Each says: what is shown, what the user can do, states, stories. No screen shows another person's data. Tags: [CR-01] dough metrics, [CR-02] compare, [ASSUMPTION] unconfirmed.
> **Updated 2026-10-01 (D-023, D-026):** one experience for everyone, three tabs (Beranda, Resep, Profil). There are no Chef screens and no screen that shows another person's data: S13 to S17 were removed. The role shows only as a read-only badge in S11. The Chef reviews the PDF from S10.
> Design direction (D-013): brand-led with playful touches. Notes below marked "Feel" say where the playfulness goes.

---
## Screens (the same for every account)

### S1 Splash / session check · Both · AUTH-01
- **Shows:** logo on `ink`, small loader. **Does:** nothing; routes by session and role.
- **States:** loading; token expired (goes to S2 with the expiry message).
- **Feel:** gold logo eases in, one soft swoosh sweep.

### S2 Login · Both · AUTH-01, AUTH-02
- **Shows:** logo, email field, password field (show/hide), "Masuk" button, static hint "Lupa password? Hubungi admin RAGI Academy". No register link.
- **Does:** submit; button disabled while in flight.
- **States:** default; validation error (empty or malformed email, empty password); wrong credentials ("Email atau password salah", generic); network error with retry; session-expired banner ("Sesi berakhir, silakan login kembali").
- **Feel:** `ink` top area with gold logo, white rounded sheet rising with the form.

### S3 Dashboard · All · PRD §5.2 [ASSUMPTION]
- **Shows:** large title with the date; hero card with the student's first name and "Trial baru"; two counters (recipes tried, trials, Stable count); "Terakhir dicoba": up to 5 recipes the student has trials of, as rows with food photo, name, category, trial count, Stable indicator.
- **Does:** open a recipe (S6); "Trial baru" opens a recipe picker sheet with photos (all recipes from the admin), then O13; "Lihat semua" goes to the Recipes tab.
- **States:** empty first use (no trial yet: "Belum ada trial" with "Lihat resep"); populated; loading skeleton; error with retry.
- **Feel:** gold hero card behind the greeting; the most recent recipe's row leads.

### S4 Recipes · All · REC-02 [CR-04]
- **Shows:** search field, category filter chips, list rows for **every recipe from the admin**: 64 px food photo (category icon on gold tile when there is none or it fails to load), name, category, the student's trial count and last trial date ("Belum ada trial" when none), Stable indicator. Tried recipes first, then the rest in the admin's order. There is no "+" and no way to add a recipe.
- **Does:** search (case-insensitive, name), filter by category (chips), infinite scroll if the API paginates, open S6.
- **States:** empty (the admin has published none: "Resep disiapkan oleh admin RAGI"); no results (search or filter); loading skeleton; error with retry.

### S5 Create / Edit Recipe: removed (PRD v0.5, CR-04, D-028)
Students do not create, edit or delete recipes; the admin backend does. REC-01, REC-03 and REC-04 are retired. The number S5 is not reused.

### S6 Recipe Detail · All · REC-05, TRL-05, HIS-01, STB-01, CPY-01, CMP-01
- **Shows:** recipe name and category; **Stable Trial card** pinned on top (gold card with trial number, date, portions, dough metrics summary [CR-01]) or "Belum ada Stable Trial"; actions "Trial baru", "Gunakan untuk batch berikutnya" (hidden if no Berhasil trial), "Bandingkan" [CR-02] (needs 2+ trials); overflow menu: Edit resep, Hapus resep; verdict filter O6; trial history newest first, each row: Trial #n, date, portions, verdict badge, Stable badge, source label, first line of Result.
- **Does:** open S8; "Salin" and "Skalakan" from a row's menu; compare via O5.
- **States:** no trials ("Buat trial pertama"); no Stable Trial; populated; filter with no results ("Belum ada trial dengan verdict ini"); loading; error.
- **Feel:** Stable card is the friendliest, largest element on the screen; a soft confetti-like burst when a Stable Trial is set.

- **Update (D-027, D-028):** S6 has no menu (no edit or delete of the recipe). It opens with a large food photo, then the "Bahan resep" section (read-only, from the admin: portions, ingredients, baker's %, and "Mulai trial dari bahan ini") before the trial history. "Trial baru" opens O13. The section is a closed summary card that opens in place (D-033).

### S7 Trial Editor · All · TRL-01, TRL-02, TRL-05, CPY-02, ING-01, ING-02, ING-03, SCL-02, CPY-01, MET-01
- **Shows:** date (O4, no future), portions (whole number 1 to 9999), ingredient list (see below), "Skalakan" action, **Dough metrics panel** [CR-01], verdict control (Berhasil / Gagal / Belum dinilai), Result, Notes, "Perubahan untuk trial berikutnya" (three separate text areas, 2.000 characters max), "Simpan".
- **Ingredient row:** name (with O10 suggestions), brand (optional), type (O2, required), grams with a "g" suffix and a decimal-comma keypad, baker's % beside the grams [CR-01], "Advanced" toggle for water content [CR-01], drag handle and delete (O11, undo via O8).
- **Modes:** new; copy (prefilled, verdict Belum dinilai, date today, text fields empty); scaled (prefilled from S9); edit (TRL-02).
- **Does:** add row, edit, reorder, remove; Skalakan (S9 sheet, applies in place); save.
- **States:** unsaved-changes guard (`Buang perubahan?`); validation (at least 1 row, every row has a type, grams above 0, portions valid); saving (button disabled); failure (input kept); metrics without flour ("—" and the hint); duplicate names allowed.
- **Feel:** metrics panel is a sticky gold-tint card that updates live with a small number roll.

### S8 Trial Detail · All · TRL-03, TRL-04, STB-01, HIS-01, CPY-01, SCL-01, PDF-01, MET-01, CMP-01
- **Shows:** Trial #n, date, portions, verdict badge, Stable badge, source label; ingredient table (name, brand, type, grams, baker's %); dough metrics [CR-01]; Result, Notes, "Perubahan untuk trial berikutnya".
- **Actions:** "Beri verdict" (O1), "Jadikan Stable Trial" (disabled unless Berhasil, hint "Beri verdict Berhasil terlebih dahulu"), "Gunakan untuk batch berikutnya" (Berhasil only), Salin, Skalakan (S9), Bandingkan [CR-02] (2+ trials), Export PDF (S10), Edit, Hapus (O7).
- **States:** Stable badge; verdict badge (three); source label variants (none, Salinan, Skala); dough metrics with and without flour; loading; error.

### S9 Scale sheet · All · SCL-01, SCL-02
- **Shows:** source portions, a target portions field, the factor ("× 2,5"), a preview list of every scaled row in grams, baker's % unchanged note [CR-01].
- **Does:** from S8: "Gunakan sebagai trial baru" (opens S7, nothing saved yet). From S7: "Gunakan" (replaces quantities and portions in the editor).
- **States:** invalid target (0, negative, decimal, empty): button disabled with an inline error; preview; row that rounds to 0 shows "< 0,01" with a warning.

### S10 PDF Preview / Share · All · PDF-01
- **Shows:** a preview of the A4 report (layout in `_foundation/screen-inventory.md`), file name, "Bagikan" button that opens the native share sheet.
- **Also shows:** a short hint that the Chef reads the PDF directly, with no account or app: "Kirim PDF ini ke Chef lewat WhatsApp, email, atau Files. Chef membacanya langsung dari PDF, tanpa akun atau aplikasi." This is how the Chef reviews a trial (D-026).
- **States:** generating (under 3 s for up to 50 ingredients); error with "Coba lagi"; ready.

### S11 Profile / Edit Profile · Both · AUTH-04, AUTH-05
- **Shows:** large title "Profil"; initials avatar, full name and a **role badge** (Siswa or Chef); full name and phone (editable), email (read-only, set by the admin), "Simpan"; an "Akun" group with "Ubah password" (S12) and "Keluar" (O7 confirm). Same for every user.
- **States:** default; saving; validation; failure.

### S12 Change Password · All · AUTH-03
- **Shows:** current password, new password (minimum 8 characters), confirmation, "Simpan".
- **States:** validation (length, mismatch); wrong current password (inline error); success toast (O8) and the student stays logged in.

---
## Shared

### S18 Global states · Both · BR-04, AUTH-01
- Offline banner; session expired (to S2 with the message); generic error (inline and full screen); force logout. See `navigation-map.md`.

### S19 Compare Trials · All · CMP-01 [CR-02]
- **Shows:** two columns (trial number, date, verdict badge, Stable badge, portions); dough metrics with differences (`+1,9 pp`, `+10 g`); ingredient rows matched by name, changed rows highlighted, brand, type and water-content differences highlighted; "Hanya di Trial #x" rows; Result, Notes and "Perubahan untuk trial berikutnya" for both, below the table; portions note ("Porsi berbeda (12 vs 18): bandingkan baker's %, bukan gram").
- **Does:** "Tukar", "Hanya tampilkan perbedaan".
- **States:** only one trial in the recipe (Compare not offered; explain if reached); no differences; ingredient in only one trial; portions differ.
- **Layout note:** two columns of grams and percentages on a 390 px phone is tight: the ingredient name spans the full row, with the two values beneath it. Decide in stage 2.

---
- **Update (D-027):** a new mode "base" prefills the editor from the recipe's base ingredients and portions (source label "Dari bahan resep"). Below the ingredients header, "Pakai takaran dari trial sebelumnya" lets the student pick one of their trials of the same recipe and copies its grams, brand and water content onto rows with the same name (extra rows of that trial are added; portions follow it).

## Overlays

| ID | Overlay | Stories | Brief |
|---|---|---|---|
| O1 | Verdict sheet | TRL-04 | Bottom sheet: three verdict options (badge style), Result text area, "Simpan". Changing the Stable Trial's verdict to Gagal or Belum dinilai shows the O7 dialog first. |
| O2 | Type picker + Advanced toggle | ING-03 [CR-01] | Sheet with 8 chips (Tepung, Cairan, Lemak, Gula, Garam, Ragi, Telur, Lainnya). "Advanced" row toggle reveals water content 0 to 100 %; shown when it differs from the default; resets when the type changes. |
| O3 | Category filter | REC-02 | Chip row on S4 (the category picker sheet went with recipe creation); fixed list from the API (Roti, Cake, Pastry, Cookies, Dessert, Lainnya). |
| O4 | Date picker | TRL-01 | Native-style picker; future dates disabled. |
| O5 | Compare trial picker | CMP-01 [CR-02] | List of the recipe's trials with verdict badges and the O6 filter; from S8 the current trial is A and the user picks B; from S6 the user picks both. |
| O6 | Verdict filter | HIS-01 | Segmented chips: Semua, Berhasil, Gagal, Belum dinilai. |
| O7 | Confirm dialogs (one component, five uses) | AUTH-05, TRL-03, TRL-01, STB-01, TRL-04 | Log out; delete recipe (states trial count); delete trial (Stable warning); discard changes ("Buang perubahan?"); move Stable ("Pindahkan Stable Trial dari Trial #x ke Trial #y?"); change the Stable Trial's verdict. |
| O8 | Snackbar with undo, success toast | ING-01, AUTH-03 | Undo after removing an ingredient row; toast after a password change [ASSUMPTION]. |
| O10 | Ingredient name suggestions | ING-02 | Dropdown under the name field from 2 characters, up to 8, most-used first; choosing one fills name, type and water content, not brand. |
| O11 | Ingredient row gestures | ING-01 | Drag handle to reorder; swipe or delete icon to remove (undo O8). Provide a non-gesture alternative for accessibility (icon button). |
| O12 | App icon and splash artwork | PRD D4 | RAGI should supply; fallback: gold logogram on `ink`. |
| O13 | Start a trial from where? | TRL-05, TRL-01, CPY-01 | Sheet "Mulai trial dari mana?": Bahan resep (portions, count, "dari admin"; hidden when the recipe has none), Trial sebelumnya (opens the trial picker, disabled with no trials), Mulai kosong. With neither base ingredients nor trials the sheet is skipped. [ASSUMPTION] |
