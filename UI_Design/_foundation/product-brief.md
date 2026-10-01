# product-brief.md
> Status: ACTIVE
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

What the app is, who uses it, Phase 1 scope, the out-of-scope guard, and the client inputs still owed.

> Design digest of PRD v0.5 §1–4 and §7 plus MVP Overview v2. The PRD is the authoritative source: on conflict the PRD wins (file a Foundation Challenge in `DECISIONS.md`). Tags: [CR-01] dough metrics, [CR-02] comparison, [ASSUMPTION] not yet confirmed by RAGI.

## Sources (authoritative, outside this workspace)
- PRD v0.5: `../_source/prd.md` (built into `../RAGI Baking Academy Apps - PRD v0.5 (Draft).docx`; earlier versions are in `../_archive/`)
- MVP Overview v2: `../_source/mvp-overview.html`
- User stories: `../RAGI Baking Academy Apps - User Stories v0.5.xlsx`
- Logo: `../_source/pptx/ragi-logo.png` (with tagline), `../_source/pptx/ragi-wordmark.png` (wordmark only)
- Walkthrough deck (PRD v0.3, outdated since v0.4 and v0.5; archived), visual reference only and not brand-confirmed: `../_archive/RAGI Baking Academy Apps - Walkthrough (ID) v0.3.pptx`

## What it is
A mobile app (Android and iOS) for RAGI Baking Academy students to journal their trials of the recipes RAGI prepares (each with a photo and base ingredients, set in the admin backend), scale recipes automatically, and share a structured PDF with their Chef. The Chef reviews a student's trial through that PDF; the app has no Chef screens (PRD v0.4, CR-03). The goal is a digital workspace where students experiment, document, improve and share their baking, not a recipe calculator (Overview §15).

## Users
- **Student** ("Practising Student"): beginner to intermediate [ASSUMPTION]; repeats a recipe 3–10 times; at ease with phones and chat apps, not with spreadsheets. Needs a fast first trial (target: 10 ingredients in ≤ 2 minutes), copy and scale without arithmetic mistakes, and a clean PDF for the Chef.
- **Chef** ("Consulting Chef"): reads the PDF a student sends, in WhatsApp, email or Files, and gives feedback outside the app. The Chef has no special screens. A Chef who has an account uses the same app as everyone for their own recipes (D-023, D-026). No comments or feedback inside the app.

## Core loops
- Everyone: Login → Dashboard → My Recipes → Recipe Detail (Stable Trial, trial history) → Trial Editor (ingredients in grams, portions, dough metrics, verdict, notes) → Save → Trial Detail → Export PDF / Copy / Scale / Compare / Mark Stable.
- Chef review (outside the app): the student exports the PDF from Trial Detail and shares it; the Chef reads it.

## Objectives (PRD §4.1)
O1 record recipes and trials · O2 easier scaling · O3 keep the recipe history · O4 save the Stable Trial · O5 review and continue experiments · O6 structured PDF for the Chef · O7 the Chef reviews through that PDF, with no Chef screens.

## Scope of this workspace
Phase 1 of 7: UI/UX design and application flow. Key output: approved screen designs and flows for the MVP scope (Overview §10). Both role experiences, Android and iOS, one design.

## Hard constraints
- Phone, portrait only; tablets run the phone layout (Overview §6). One cross-platform codebase; React Native (Expo) is intended (D-015), to confirm at Phase 2.
- Online only: a write while offline shows an error and keeps the input (BR-04).
- Bahasa Indonesia only, no language switcher (BR-05) [ASSUMPTION: the Overview lists language as TBC]. Minimum OS Android 8.0+ and iOS 14+ [ASSUMPTION].
- Accounts are created by the academy: no registration screen. No self-service password reset: Login shows a static hint (AUTH-02) [ASSUMPTION].
- No photos or videos on trials; no profile photo, an initials avatar instead [ASSUMPTION].

## Out of scope: do not design (PRD §7)
Chat, push notifications, social or community features, recipe sharing between students, ingredient inventory, prices and HPP, nutrition, shopping list, AI features, payments, web dashboard, analytics, offline-first sync, admin or CMS, language switcher, tablet layouts, photo or video on trials, self-registration, self-service password reset, units other than grams, ingredient sections or groups, scaling by weight or pan size, editing baker's % directly, sourdough and pre-ferment maths, Chef feedback inside the app, Chef PDF export, profile photo, ratings beyond the verdict, comparing 3+ trials or across recipes, recipe archive or trash.

## Scope additions pending client approval
- **CR-01** dough metrics: ingredient types, water content, baker's %, automatic totals (ING-03, MET-01).
- **CR-02** trial comparison: two trials of one recipe side by side (CMP-01, S19).
- **CR-04** recipes from the admin backend: photo and base ingredients per recipe, students cannot create recipes, new start options for a trial (TRL-05, CPY-02). Reworks Overview §4B. Needs RAGI's written approval.
- **CR-03** one experience for every account: Chef screens and stories (CHF-01 to CHF-04, S13 to S17) removed, Change password for everyone. This one removes scope. Needs RAGI's written approval.
Design CR-01 and CR-02 in Phase 1, tag them, keep them separable: they stay out of Phase 3–4 acceptance until the change request is approved (PRD §8.2, §11).

## Client inputs still owed (PRD D3, D4, D6)
- Confirmed lists from the Chef: ingredient types, default water content, categories.
- App-ready and PDF-ready logo files, app name, app icon, privacy policy URL. Brand colours and fonts arrived in the brand guide (D-012, D-014).
- Review feedback inside the agreed window; up to 2 revision rounds per design phase.
