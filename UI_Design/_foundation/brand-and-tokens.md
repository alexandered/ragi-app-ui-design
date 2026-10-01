# brand-and-tokens.md
> Status: ACTIVE (official brand guide received 2026-09-30; direction ratified by Alex, see D-012 to D-014)
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: the navy `#1B2140` / sampled gold `#D8B068` working palette (D-005)

Official brand colours and fonts, the design direction ("brand-led, playful touches"), verified contrast pairs, and the rules for using colour.

> Source: *RAGI Academy_Brand Guidelines.pdf* by Pruv.Inc, 2023 (Google Drive folder `1mjqucwN5oeLfJ6EtiurZGg5CzW2bybHw`). Sub-folders `02_FONT` and `03_MOCKUPS` were not opened. The guide covers print, apparel and paper; it says nothing about apps, so everything marked [DERIVED] is our extension of it.

## Official brand (from the guide)
| Item | Value |
|---|---|
| Ragi Gold | `#D4B277` (RGB 212, 178, 119) |
| Blackout Black | `#1C1717` (RGB 28, 23, 23) |
| White Hall | `#F2F2F2` (RGB 242, 242, 242) |
| Primary font | IBM Plex Sans: headings, titles, prominent text. Headline Medium or Bold; sub-headline Regular or Medium |
| Secondary font | Vollkorn: body text and supporting content. Call to action: Vollkorn Bold |
| Logo | Full colour, monochrome black, monochrome white. Full colour on white or light; monochrome white on dark. Minimum 60 px wide on screen. No stretching, recolouring or busy backgrounds. Use the supplied files only |
| Voice | Sophisticated, friendly, passionate. Conversational, inviting, knowledgeable, warm |
| Imagery | Luxury, indulgence, rich vibrant tones (out of scope for this project: D-010) |

## Design direction (D-013): brand-led, with playful touches
The guide sets the colours, fonts and voice. Playfulness comes from **how** we use them, not from new colours [DERIVED]:
- **Shape:** large radii (cards 20, controls 14, pills full), chunky verdict and stable badges, a gold "blob" or swoosh echoing the logo's swoosh behind hero areas.
- **Type:** big, confident IBM Plex Sans headings with generous scale contrast; Vollkorn for reading text and notes.
- **Colour:** gold as a large friendly surface (hero cards, selected chips, the Stable Trial card), black for text and primary buttons, White Hall as the page background. Gold tints for soft fills.
- **Motion:** short springy transitions (150 to 250 ms), a small celebration when a trial is marked Berhasil or Stable. Always respect reduced motion.
- **Copy:** warm, "kamu" voice, encouraging empty states.
- **Guard rails:** stay away from neon, gradients and cartoon illustration. The guide's promise is "sophisticated", so playful means warm and rounded, not childish.

## Colour roles [DERIVED]
| Role | Token | Value | Use |
|---|---|---|---|
| Brand gold | `gold` | `#D4B277` | fills, hero cards, selected states, decoration, the Stable Trial card. Never text or small icons on white or White Hall |
| Gold tint | `gold-tint` | `#F6EEDD` | soft fills, hover, selected rows |
| Gold deep | `gold-deep` | `#755819` | text and icons in the gold family on light surfaces |
| Blackout | `ink` | `#1C1717` | primary text, icons, primary button fill (white text), app bar text |
| Body | `body` | `#453F3F` | secondary text |
| Muted | `muted` | `#6E6767` | captions, hints |
| White Hall | `page` | `#F2F2F2` | page background |
| White | `surface` | `#FFFFFF` | cards, sheets, inputs |
| Line | `line` | `#E2DEDE` | dividers, input borders (check 3:1 for input borders before use) |
| Verdict Berhasil | fill / ink | `#DCEFE3` / `#2C764A` | badge, with check icon and label |
| Verdict Gagal | fill / ink | `#F6DCDC` / `#B03939` | badge, with x icon and label |
| Verdict Belum dinilai | fill / ink | `#ECE8E8` / `#5F5959` | badge, with dashed-circle icon and label |
| Error / warning | | reuse Gagal ink; warning uses gold-deep on gold-tint | |

Body, muted, line and gold-tint are our own warm-neutral extensions [DERIVED]. Verdict colours are functional and not in the guide.

## Verified contrast (WCAG ratio, computed 2026-09-30)
| Pair | Ratio | Result |
|---|---|---|
| Ink on white | 17.73:1 | AA |
| Ink on White Hall | 15.84:1 | AA |
| Ink on gold | 8.81:1 | AA: the rule for text on gold |
| Gold on ink | 8.81:1 | AA: gold wordmark on a black splash or header |
| Gold on white | 2.01:1 | fails: never text or small icons |
| Body on white / on White Hall | 10.32 / 9.21:1 | AA |
| Muted on white / on White Hall | 5.53 / 4.94:1 | AA |
| Gold deep on white / gold tint / White Hall | 6.63 / 5.75 / 5.92:1 | AA |
| Berhasil ink on fill | 4.61:1 | AA |
| Gagal ink on fill | 4.64:1 | AA |
| Belum dinilai ink `#5F5959` on `#ECE8E8` | 5.65:1 | AA |

## Rules
1. No raw hex in screens: reference tokens (`tokens.json`, stage 2).
2. Text at least 4.5:1 on its background; meaningful icons, borders and controls at least 3:1 [ASSUMPTION: WCAG 2.2 AA].
3. Never gold on white for text or small icons. Put ink on gold, or gold on ink.
4. Verdict is never by colour alone: icon, label and colour together.
5. Logo: only the supplied files, never recoloured. Full colour on White Hall, white monochrome on ink.
6. Re-run the contrast table whenever a token changes.

## Typography
- **Headings, titles, labels, numbers:** IBM Plex Sans (Medium 500, Semibold 600, Bold 700).
- **Body, notes, journal text:** Vollkorn (Regular 400, Semibold 600). **Buttons and calls to action:** Vollkorn Bold per the guide [ASSUMPTION: confirm this on small buttons; if legibility suffers at 14 to 16 px, use Plex Sans Semibold and file a Foundation Challenge].
- Numbers in tables and the dough metrics panel use IBM Plex Sans with tabular figures so grams line up.
- The guide asks for uppercase headlines with wide tracking in print. On a phone, use sentence case for screen titles and reserve uppercase tracking for small overlines only [DERIVED].
- Both are Google Fonts (SIL OFL). The prototype bundles the font files locally (no runtime network calls); the app bundles them too.

## Open
- The logo files for the app: the full-colour, black and white variants and a PDF-ready version are still to come from RAGI (PRD D4). `../_source/pptx/ragi-logo.png` is the stand-in. The `02_FONT` and `03_MOCKUPS` Drive folders may hold them.
- App icon: RAGI to supply. Fallback: gold logogram on ink.
- Dark mode: not in the PRD. Light only for the MVP [ASSUMPTION].
- The brand guide is dated 2023 and was made for the Jakarta branch: confirm with RAGI that it still applies to the Academy app.
