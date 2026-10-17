# Bridge guide reachable exits — bounded urgent repair

Live reproduction in actual Chrome390×600: guide rect y12–588 but footer/Okay y1333–1377; only Okay existed, no Home. Screenshot live-before-390x600.png. Viewport override reset.

Patch changes only Bridge guide: canonical Home top-left, title top-right, fixed reachable footer Okay/optout; image and all guide instructions remain in one scrolling body. Image stays centered at full available width up to390px. No image shrink, content removal, artwork alteration, worker or game-state change. Other room guides retain existing layout.

Apply fresh via `node work/bridge-guide-exit-repair/transplant.cjs <latest-app.html>`; output latest-app.html. Exact inverse scope proof passes. check-semantics.cjs executes actual modified guide framework with mocked DOM and verifies Home closes guide+Bridge/goes porch without saving optout; Okay returns to same Bridge. All source scripts parse.

Fixed browser rendering unverified due prior local listener boundary. Parent plans urgent release with immediate actual public390-short-screen verification. No broad Android history draft included. Physical Android not tested.

## Follow-up critical visual finding
Root screenshot review and actual live DOM confirmed initial fixed-footer version caused instruction/image overlap: scroll-body grid rows became0px and661.5px; figure y86.7–670.2, list y98.7–760.2. `flow-fix.html` is the minimal append-only correction: scroll body display:block, figure margin-bottom16px, list static/clear. Header/footer and full-width image unchanged. Do not call initial footer-only version visually complete. Awaiting corrected public verification.
