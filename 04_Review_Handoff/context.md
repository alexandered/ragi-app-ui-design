# context.md — 04_Review_Handoff (L1)
> ⚠️ Read `/_foundation/*` FIRST. It is the default truth; this domain must not silently contradict it (file a Foundation Challenge if it's wrong).

## Scope
Stage 4 of 4. Get RAGI's approval, then package the design for developers.
- **Input:** the stage 3 prototype (`03_Screens/reference/` once promoted, otherwise the current build).
- **Process:** review with RAGI (round 1, round 2, no more without a change request); log every finding; fix; then build the handoff pack.
- **Output:** review log, approved-screens list, handoff pack (tokens, icon list, component notes, states table, Indonesian string sheet, and the CR-01 and CR-02 screens as a separable package).
- **Done when:** RAGI accepts "approved screen designs and flows for the MVP scope" (Overview §10), or a change request is raised for anything beyond two rounds.

## Current priorities
1. Chase the client inputs still owed: brand colours, brand font, PDF-ready logo, app icon, Chef-confirmed lists (PRD D3, D4).
2. Prepare the review build and a one-page walkthrough per round.
3. Log round 1 and round 2 feedback as accept, fix or change request.
4. Build the handoff pack once RAGI accepts. The framework (Flutter or React Native) is still open, so keep tokens platform-neutral.

## Goes in `reference/` (Recipe / permanent)
The approved-screens list, the final review log and the handoff pack.

## Goes in `working/` (Cake / ephemeral)
Round feedback notes, handoff notes in progress, client Q&A.

## Key links
- Review protocol -> /_foundation/workflow.md
- Scope guard and owed inputs -> /_foundation/product-brief.md
