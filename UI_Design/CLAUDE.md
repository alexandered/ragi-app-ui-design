# CLAUDE.md — RAGI Baking Academy Apps — UI Design (ICM Workspace)

> Global orientation (L0). Read FIRST every session. Its job is to **point** to domains — not to store domain context. Use `INDEX.md` to find the right file fast.

## 1. Project Overview
**RAGI Baking Academy Apps — UI Design** — Phase 1 UI/UX design workflow for the RAGI Baking Academy mobile app (Android and iOS, Bahasa Indonesia): from the PRD to an approved, clickable HTML prototype and a developer handoff.

Requirements come from the PRD (`../_source/prd.md`, v0.5, project root, outside this workspace). This workspace turns them into a design in four stages: `01_Requirements_Flows` → `02_Design_System` → `03_Screens` → `04_Review_Handoff`. A stage reads only the previous stage's `reference/`. Pipeline contract: `_foundation/workflow.md`.

- **Type:** software (mobile app UI design workflow)
- **Operating under:** Client: RAGI Academy. Phase 1 of 7 (Overview v2 §10).
- **Value prop:** Everyone journals, scales, compares and shares recipe trials in one app. Student or Chef is only a label in the profile (D-023).
- **Method:** ICM (Interpretable Context Methodology) — *Folders Over Agents*. Legible, auditable, model-agnostic. This repo dogfoods ICM onto itself.
- **Design tool:** HTML prototype built by Claude from the specs (no build step). **Brand:** official guide (D-012): Ragi Gold `#D4B277`, Blackout Black `#1C1717`, White Hall `#F2F2F2`; IBM Plex Sans + Vollkorn. **Direction:** brand-led with playful touches (D-013).

## 2. Folder Structure
```
UI_Design/
├── CLAUDE.md
├── DECISIONS.md
├── INDEX.md
├── _foundation/
│   ├── product-brief.md
│   ├── workflow.md
│   ├── screen-inventory.md
│   ├── ui-rules.md
│   ├── content-language.md
│   ├── brand-and-tokens.md
│   ├── iconography.md
│   ├── glossary.md
├── _inbox/
├── 01_Requirements_Flows/
│   ├── context.md
│   ├── reference/
│   └── working/
├── 02_Design_System/
│   ├── context.md
│   ├── reference/
│   └── working/
├── 03_Screens/
│   ├── context.md
│   ├── reference/
│   └── working/
├── 04_Review_Handoff/
│   ├── context.md
│   ├── reference/
│   └── working/
```

## 3. How to Run (Grooming Session Ritual)
1. **Name the domain** — e.g., Requirements & Flows / Design System / Screens / Review & Handoff.
2. **Find files:** open `INDEX.md`, then load `_foundation/*` + `<domain>/context.md` + the `reference/` files it names. Do NOT load other domains, except the previous stage's `reference/`: that is the pipeline input (see `_foundation/workflow.md`).
3. **Work** in `<domain>/working/` (ephemeral = Cake).
4. **Close the loop:** decisions -> `DECISIONS.md` (with an ID); new permanent rules/assets -> promote into `reference/` (or `_foundation/` if cross-domain); empty `_inbox/`.

## 4. Key Conventions
- **Recipe vs Cake:** `reference/` + `_foundation/` = permanent (rarely changes). `working/` = ephemeral (single-use). Never mix them.
- **Foundation is default truth, not infallible:** no domain silently contradicts `_foundation/`. To change a truth, file a Foundation Challenge in `DECISIONS.md`, then edit `_foundation/` first.
- **One authoritative home:** each truth lives in exactly one canonical file. Inlining a copy into a live session is fine; a second *authoritative* copy is not. Link to the home.
- **Grow on-demand:** create sub-folders/files only when a real session needs them. Do not over-build.
- **PRD wins:** requirements live in `../_source/prd.md`. The foundation files are design digests; on conflict the PRD is authoritative (file a Foundation Challenge).
- **Tokens only:** screens use design tokens and stage 2 components. No hard-coded colours, sizes or one-off icons.
- **Bahasa Indonesia UI, English workspace:** every visible string is Indonesian (`_foundation/content-language.md`); documents in this workspace are English.
- **Tag scope additions:** anything from CR-01 or CR-02 carries its tag in briefs, screens and the handoff pack.
- **DESIGN.md is a digest:** `../DESIGN.md` (project root, outside this workspace, with `../.impeccable/design.json`) is generated from `02_Design_System/reference/`. Tokens stay authoritative in `tokens.json`; regenerate DESIGN.md after changes, never edit its values by hand (D-032).

## 5. What to Avoid
- ❌ Re-opening decisions marked **Locked** in `DECISIONS.md` without explicit instruction.
- ❌ Silently obeying *or* silently diverging from a `_foundation/` file you believe is wrong — file a Foundation Challenge instead.
- ❌ Putting cross-domain truth inside a single domain (it belongs in `_foundation/`).
- ❌ Cramming ephemeral work (Cake) into `reference/` or `_foundation/`.
- ❌ Letting `_foundation/` go stale: unreviewed law rots silently and poisons every session that trusts it.
- ❌ Designing anything under "Out of scope" in `_foundation/product-brief.md`.
- ❌ Building different menus or functions per role, or any screen that shows another person's data (D-023, D-026). The role is only a badge in the profile; the Chef reviews the PDF a student sends.
- ❌ Conveying a verdict by colour alone, or using brand gold for text or small icons on white or White Hall.
- ❌ Reading another stage's `working/` files as input: only `reference/` is input.
- ❌ Publishing the prototype to a public URL without Alex's approval.

## 6. Context Governance (keep context true over time)
- **Review `_foundation/` on a cadence** (default: quarterly). Update each file's `Last-reviewed` date. Stale law is the #1 cause of silent quality decay.
- **Found a foundation file wrong or stale?** File a Foundation Challenge in `DECISIONS.md` — don't silently contradict it, don't silently comply.
- **Tag uncertain or time-bound claims inline:** `[ASSUMPTION]`, `[VALID UNTIL YYYY-MM]`, `[CONTESTED: D-xxx]`. Binary 'law' hides the rot.
- **Prose for judgment, structured data for execution:** anything a machine runs (test cases, configs, pipelines) belongs in JSON/YAML/CSV, not prose markdown.
- **Audit drift:** `python scaffold_icm.py lint --path .` (the script ships with the create-icm skill, `scripts/scaffold_icm.py`) — run it before trusting an old workspace.
