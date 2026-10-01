# Navigation map and flows 
> Stage 1 output. Approved by Alex 2026-09-30 (D-016 to D-018).
> Updated 2026-10-01 (D-023, D-026). The first version had 3 tabs for the Student and 2 for the Chef, then 4 tabs for everyone with a Cari tab. Both are replaced: **three tabs for everyone, no Cari, no Chef screens.**

## Structure
One app, one experience. The role (Student or Chef) only shows as a read-only badge in the profile. Everyone only ever opens their own data. Global states (S18) sit above everything.

```
S1 Splash ── session valid? ──► Beranda (S3)
                          └───► no / expired ──► S2 Login (with "Sesi berakhir..." if expired)
```

### Bottom tab bar, 3 tabs, same for every account
| Tab | Root screen | Stack pushed on top |
|---|---|---|
| Beranda | S3 Dashboard | S6 Recipe Detail, S7 (via "Trial baru") |
| Resep | S4 My Recipes | S5, S6, S7, S8, S9, S10, S19, and overlays |
| Profil | S11 Profile (role badge) | S12 Change Password, S18 |

- "Trial baru" is a prominent button on S3 and on S6, not a tab: creating a trial always needs a recipe first (S6 or a recipe picker sheet from S3).
- The tab bar hides inside S7 (Trial Editor) and the S10 full-screen flow so the Save area and sheets are never crowded.
- Detail screens use a back arrow at the top left; the tab root keeps its tab highlighted. The three tab roots share one large title row (title left, optional action right).

### Decision D-026: no Cari tab, no Chef functionality
Why: the Chef reviews a student's trial through the PDF the student sends (PDF-01), so the app needs no search, no list of people and no read-only views. This removes S13 to S17 and CHF-01 to CHF-04, and it means nobody ever sees another person's data in the app. Supersedes D-016 and D-017. The requirement documents were updated to match (PRD v0.4, CR-03).

## Student flow (PRD §5.2)
```
S3 Dashboard ──► S4 My Recipes ──► S6 Recipe Detail ──► S7 Trial Editor ──► Save ──► S8 Trial Detail ──► S10 PDF ──► share sheet
     │                 │                 │  ├─ Salin ─────► S7 (prefilled) ┘             ├─ Skalakan ──► S9 sheet ──► S7 (scaled)
     │                 └─ + ► S5 Recipe  │  ├─ Gunakan untuk batch berikutnya ► S7        ├─ Beri verdict ► O1 sheet
     └─ Trial baru ──► recipe picker ────┘  └─ Bandingkan ─► O5 picker ► S19              ├─ Jadikan Stable Trial ► O7 dialog
                                                                                          └─ Bandingkan ► O5 ► S19
S7 also has: Skalakan (S9 sheet, applies in place), O2 type picker, O4 date picker, O10 suggestions, O11 gestures, O7 discard guard.
```

## Chef review (outside the app)
Trial Detail (S8) → Export PDF (S10) → the device's native share sheet → the Chef reads the PDF in WhatsApp, email or Files. Nothing else happens in the app. S10 says so: "Kirim PDF ini ke Chef lewat WhatsApp, email, atau Files. Chef membacanya langsung dari PDF, tanpa akun atau aplikasi."

## Global-state flow (S18, BR-04, AUTH-01)
- **Offline:** a banner at the top of every screen ("Kamu sedang offline"); reads show cached-nothing error with retry; writes fail with an error and keep the input on screen.
- **Session expired:** any 401 sends the user to S2 with "Sesi berakhir, silakan login kembali". Input in an open editor does not survive the forced re-login, because there is no local queueing (BR-04) [ASSUMPTION: confirm with RAGI].
- **Generic error:** inline card with "Coba lagi" on the affected region; a full-screen version for a failed first load.
- **Force logout:** same exit as session expired, with a different message for a disabled account [ASSUMPTION: text to write in stage 3].

## Things this map adds beyond the PRD (flag to RAGI)
- The recipe picker sheet reached from "Trial baru" on S3 (needed because a trial belongs to a recipe).
