# workflow.md
> Status: DRAFT — proposed, awaiting ratification
> Last-reviewed: 2026-09-30
> Owner: Alex
> Supersedes: none

The 4-stage design pipeline: inputs, outputs, gates, HTML-prototype rules and the review protocol.

> One stage = one folder. A stage reads the previous stage's `reference/` (finished, promoted work), never its `working/` (drafts). A stage is done when its output is promoted to its own `reference/`.

## Pipeline
| # | Stage (folder) | Reads | Produces (in reference/) | Done when |
|---|---|---|---|---|
| 1 | `01_Requirements_Flows` | `_foundation/*`, PRD stories | screen briefs, flows, navigation map, coverage matrix | every story ID in PRD §6.3 lands on at least one brief; S1–S19 and O1–O12 all have a brief |
| 2 | `02_Design_System` | stage 1 navigation map, brand, icons, UI rules | `tokens.json` (and generated `tokens.css`), icon map, component specs, `components.html` | the components sheet shows every component in every state; AA contrast passes; it survives 130 % text |
| 3 | `03_Screens` | stage 1 briefs, stage 2 system | HTML prototype (one file per screen or overlay, plus a clickable `index.html`), the A4 PDF layout | every screen on the board has all its states and passes the screen checklist |
| 4 | `04_Review_Handoff` | stage 3 prototype | review log, approved-screens list, handoff pack | RAGI accepts the designs, or a change request is raised |

## Tool: HTML prototype (decided by Alex, 2026-09-30)
Claude builds the design directly as HTML from the specs. Conventions below are proposed; see `DECISIONS.md`.
- Plain HTML, CSS and a little vanilla JS. No build step, no framework, no network calls at runtime. Needs a local server (`serve.py`) because fonts and scripts load by relative path.
- One shell (`index.html`, `app.js`) with a router and a screen registry; each screen or overlay registers itself from a module in `screens/` (FC-001). Screens are therefore modules, not separate HTML files.
- One `tokens.css` (generated from `tokens.json`) and one `components.css`. Screens use tokens only, never raw hex values.
- Icons: inline SVG from Lucide, copied into the prototype, never hot-linked.
- Reference viewport 390 × 844 in a phone frame, portrait; also check 360 × 640 [ASSUMPTION].
- Every screen has a state switcher (the control panel, or `?state=empty`, `loading`, `error`, and so on in the URL) so every state in `_foundation/screen-inventory.md` can be seen without editing code.
- A "Text 130 %" toggle applies the PRD's font-scaling requirement; tap targets are at least 44 px.
- All visible text is Bahasa Indonesia (`_foundation/content-language.md`).
- Sharing the prototype outside this machine (zip, hosted link) is outward-facing: ask Alex first.

## Screen checklist (definition of done for every screen)
1. Every state listed for it in `_foundation/screen-inventory.md` is designed and reachable through the state switcher.
2. One experience for everyone (D-023, D-026): no screen or menu depends on the role, and no screen shows another person's data. The role appears only as a badge in the profile.
3. Only tokens and components from stage 2: no hard-coded colours, no one-off icons.
4. Text is Bahasa Indonesia, uses the fixed strings, and formats numbers per `_foundation/content-language.md` (`1,5`, `1.000`, `250 g`).
5. Verdict is never colour alone: icon, text label and colour together.
6. AA contrast, tap targets ≥ 44 px, survives the 130 % text toggle.
7. CR-01 and CR-02 elements carry their tag, on the board and in the file.

## Review protocol
- Up to 2 revision rounds per design phase inside the agreed scope; a third round or any new behaviour is a change request (Overview §9 #6 and §13).
- Log each round in `04_Review_Handoff/working/`: finding, then accept, fix or change request. Promote the outcome to `reference/` when the round closes.
- RAGI answers inside the agreed window (PRD D6). If it lapses, note the delay in `DECISIONS.md`.

## Structured data (not prose)
- `02_Design_System/reference/tokens.json`: colours, type, spacing, radius, elevation. The source for `tokens.css`.
- `03_Screens/working/board.json`: one entry per screen or overlay: `{ id, name, role, stories[], states[], cr, status, round, file }`. `status` is one of todo, wip, review, approved. `cr` is null, "CR-01" or "CR-02".
- At handoff the approved entries are promoted to `04_Review_Handoff/reference/approved-screens.json`.

## Where client files go
Anything RAGI sends (brand guide, fonts, PDF-ready logo, app icon, confirmed lists) lands in `_inbox/` first. File the facts into `_foundation/brand-and-tokens.md` or `_foundation/ui-rules.md`, the assets into `02_Design_System/reference/`, then empty `_inbox/`.

## Starting a session
1. Name the stage. 2. Load `_foundation/*`, that stage's `context.md`, and the previous stage's `reference/`. 3. Work in `working/`. 4. Promote finished output to `reference/`, log decisions in `DECISIONS.md`, empty `_inbox/`.
Example openers: "Stage 1: write briefs for S4–S6 from REC-01…05 and HIS-01." · "Stage 3: build S7 Trial Editor with all four states."
