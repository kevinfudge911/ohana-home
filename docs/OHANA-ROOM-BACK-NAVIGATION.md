# Room-history repair — verified live

Final release b64bcf06df9ffeb84f6343243d04b281c2c74575 deployed successfully. App blob 86f96002bf12c519810c08bed7159e46f7331452, 6296126 bytes. Worker unchanged. Normal public root URL at 390x844 loaded Home, Prayer > Back returned Home, Journey > Color opened Color, its automatic native guide was visibly observed, first Back closed that guide and kept Color, second Back returned Home. Zero open dialogs after guide Back, sampled error logs empty. Screenshot live-color-after-guide-back-390x844.png. Physical Android/iPhone/Safari still unverified. Home boundary is not trapped.

Final release contains no route debug instrumentation. All three clean-release lifecycle/source/shared-hydration suites and all 28 script blocks parse. Inverse proof restores prior canonical Bible app exactly; native overlay and worker/DO are preserved. Canonical local app and master checkpoints updated only after live verification.

The development notes below are superseded by this final result where indicated.

Baseline public responsive Chrome at 390x844 reproduced two failures on the Bible release 1edbce3: Home > Blessings > browser Back left the site (about:blank), and Home > Journey > Ohana Color also left the site. No game, drawing, invite or message changes were made.

Candidate replaces only the existing ohana-screen-history script. Native dialog overlay module, artwork, Bible columns, music, worker and all PuzzleRoom Durable Object code/storage/bindings/lifecycle are unchanged. Default-off query gate: ?ohana-route-preview=1. Exact inverse proof passes. Actual overlay module plus new route module pass mocked lifecycle checks for Prayer, asynchronous Color/Puzzle transitions, background-render entry preservation and coalesced Home.

Canary v1 commit 5b36827ef865abb02a11f4acaa6932098257f2cc deployed successfully. Public Prayer > Back returned to Home, but Journey > Color stayed on Home instead of opening Color. It was NOT promoted. Browser microtask checkpoints between category capture teardown and target click exposed a gap in the original lifecycle fixture.

Canary v2 cb68be99e3e7a7c188db6e0784413c4536f6591f adds a narrowly scoped Window capture handler for category Color and valid existing-game buttons. It records the destination, closes the existing category and invokes the existing destination handler exactly once. check-category-source.cjs uses the actual category close source, actual Color function plus late shared-table wrapper, actual existing-game click including room branch and live overlay module. Both lifecycle checks pass; all 28 scripts parse. Public v2 verification is pending. Do not call this finished or physical Android tested from model tests alone.

V2 public results: Journey > Color now opens the Color library, but first Back stays in Color and second Back returns Home. Existing Journey Tic-Tac-Toe game36 opened unchanged; first Back closed its automatic Before we play dialog and kept the board, second Back returned Home. Existing Duckville puzzle opened at 90 of 510 pieces; Back returned Home. No board/tile/piece/drawing changes were made. The duplicate Color route was shared-table hydration changing CB.page automatically.

V3 c7054125ea99b2dad58f315382e06ffbae5136d8 tracks explicit Color navigation arguments, not automatic CB.page hydration. check-shared-hydration.cjs uses the actual shared join function, reproduces the baseline failure and passes the correction. Only route-history script still changes. V3 public verification pending.

V4 diagnostics ac27aecd72ed18b113454b02a589cd5877ab575e clarified the apparent remaining duplicate: an automatic native room-tour dialog opened after the initial Color snapshot. First Back correctly closed that guide; second Back left Color. After the guide was closed, reentering Color and pressing Back once returned Home. Prayer > Back also passed again. Thus the earlier browser report of a remaining duplicate is superseded by actual captured dialog/route evidence. No extra route push was logged. The explicit Color-intent fix remains useful to avoid treating shared-table hydration as navigation in future active-page cases. Diagnostic logs are to be removed from the final release.

