# context.md — 01_Requirements_Flows (L1)
> ⚠️ Read `/_foundation/*` FIRST. It is the default truth; this domain must not silently contradict it (file a Foundation Challenge if it's wrong).

## Scope
Stage 1 of 4. Turn the PRD into design-ready briefs and flows.
- **Input:** `_foundation/*`; the PRD stories (`../_source/prd.md` §6.3, outside this workspace).
- **Process:** write one brief per screen and overlay (data shown, actions, states, story IDs, role, CR tag); draw the user flow and the global-state flow; decide the navigation structure.
- **Output (promote to `reference/`):** screen briefs, flows, the navigation map, a coverage matrix (every PRD story ID lands on at least one screen).
- **Done when:** every story ID in PRD §6.3 appears in at least one brief; S1–S12, S18, S19 and O1–O12 all have a brief (S13 to S17 were removed, D-026); the open questions on navigation are decided and logged in `DECISIONS.md`.

## Current priorities
1. Navigation is decided (D-023, D-026): three tabs for everyone.
2. Write briefs for the Student core loop first: S3 to S9 (dashboard, recipes, trial editor, trial detail, scale sheet).
3. Then the global states (S18). There is no Chef loop any more (D-026).
4. Tag CR-01 and CR-02 items (dough metrics, compare) in every brief they touch.

## Goes in `reference/` (Recipe / permanent)
Approved screen briefs, user flows, the navigation map and the story-to-screen coverage matrix. Stages 2 to 4 read these. Register each file with a 'load when…' note.

## Goes in `working/` (Cake / ephemeral)
Draft briefs, flow sketches, question lists for RAGI or the Chef.

## Key links
- Screen list -> /_foundation/screen-inventory.md
- UI rules -> /_foundation/ui-rules.md
- Pipeline contract -> /_foundation/workflow.md
- Requirements source -> `../_source/prd.md` (project root, outside this workspace)
