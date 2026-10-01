# content-language.md
> Status: ACTIVE
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

Bahasa Indonesia rules, number formats, and the fixed UI strings taken verbatim from the PRD.

> Design digest of PRD BR-05, BR-08 and the quoted strings in §6.3. Strings are the PRD's proposals, not client-approved copy, until RAGI confirms them.

## Rules
- UI language: Bahasa Indonesia only, no switcher (BR-05) [ASSUMPTION: the Overview lists language as TBC]. Workspace documents stay in English.
- Voice: friendly and informal, "kamu", as in "Kamu sudah punya resep dengan nama ini" [ASSUMPTION].
- Numbers: decimal comma, thousands dot (`1,5`, `1.000`); grams always as `250 g`. Details in `_foundation/ui-rules.md`.
- Timestamps are stored in UTC and shown in the device timezone (BR-08). Date display format: not specified [OPEN].
- Fixed labels: verdicts `Berhasil`, `Gagal`, `Belum dinilai`; trials `Trial #n`; ingredient types and categories as listed in `_foundation/ui-rules.md`.

## Fixed strings (verbatim from the PRD)
| String | Where | Story |
|---|---|---|
| `Email atau password salah` | Login, wrong credentials | AUTH-01 |
| `Sesi berakhir, silakan login kembali` | Login after token expiry | AUTH-01 |
| `Lupa password? Hubungi admin RAGI Academy` | Login hint | AUTH-02 |
| `Kamu sudah punya resep dengan nama ini` | Duplicate recipe-name warning | REC-01 |
| `Buat trial pertama` | Button in an empty Recipe Detail | REC-01 |
| `Belum ada Stable Trial` | Recipe Detail without a Stable Trial | REC-05 |
| `Buang perubahan?` | Unsaved-changes prompt | TRL-01 |
| `Ini adalah Stable Trial. Resep tidak akan punya Stable Trial setelah dihapus.` | Delete-trial warning | TRL-03 |
| `Beri verdict` | Quick action on Trial Detail | TRL-04 |
| `Trial ini adalah Stable Trial. Ubah verdict dan hapus status Stable?` | Changing the Stable Trial's verdict | TRL-04 |
| `Jadikan Stable Trial` | Action | STB-01 |
| `Beri verdict Berhasil terlebih dahulu` | Hint on the disabled action | STB-01 |
| `Pindahkan Stable Trial dari Trial #x ke Trial #y?` | Move confirmation | STB-01 |
| `Belum ada trial dengan verdict ini` | Empty verdict filter | HIS-01 |
| `Salinan Trial #3`, `Skala dari Trial #2: 12 → 24 porsi` | Source labels | HIS-01 |
| `Gunakan untuk batch berikutnya` | Action on Berhasil trials | CPY-01 |
| `Skalakan` | Action in the Trial Editor | SCL-02 |
| `Gunakan`, `Gunakan sebagai trial baru` | Scale sheet buttons | SCL-01 |
| `Perubahan untuk trial berikutnya` | Field label | TRL-01 |
| `Laporan Trial Resep` | PDF title | PDF-01 |
| `Tambahkan bahan bertipe Tepung untuk menghitung baker's %` | Metrics hint | MET-01 |
| `Bandingkan`, `Tukar`, `Hanya tampilkan perbedaan` | Compare actions | CMP-01 |
| `Hanya di Trial #x` | Ingredient in one trial only | CMP-01 |
| `Porsi berbeda (12 vs 18): bandingkan baker's %, bukan gram` | Compare note | CMP-01 |
| `Semua`, `Berhasil`, `Gagal`, `Belum dinilai` | Verdict filter | HIS-01 |

## Strings the PRD does not give
Dough-metric labels (hydration, total flour, and so on), the "Advanced" toggle label, empty-state text, button labels for login, save and cancel, and dialog buttons are written by the designer in stage 3, listed in the handoff string sheet, and marked proposed until RAGI approves them.
