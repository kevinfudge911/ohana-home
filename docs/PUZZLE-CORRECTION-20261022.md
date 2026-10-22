# Puzzle correction — ready for exact-patch review

Base: production `2ed19412add335aee6f195259105431f241ee8e2`. No production or family-state writes were performed while preparing this correction.

## Scope

- Puzzle workstation alone receives a centered green **Play** word and human-only attention count. One tap opens the next eligible human game directly. It preserves the puzzle return anchor and cancels navigation after context changes or a new piece pickup, including while awaiting a room transition. Home retains its existing waiting-list action.
- Preview remains a distinct timed action, green and right-aligned above the bottom scores/cardinal. Other tools retain their left positions. Short landscape gains only the clearance needed between the action row and the bottom cardinal.
- Other games regain their original aqua top-right manual Next shortcut and original automatic advancement behavior. The restored functions are compared byte-for-byte against the pre-global-restyle baseline; actual Words rendering was checked at phone, tablet, desktop and landscape widths.
- Valid tray pulls use a shared client/server in-board placement planner, near the current work area and permitting temporary interior overlap. They no longer require empty viewport space or panning. Complete joined tray groups retain offsets; valid other-user holds and placed pieces remain protected. Expired holds use the authoritative 15-second lease rule. Deployment does not snap, join, lock, or score pieces.
- The tray is one horizontal row. Its painted alpha bounds determine entry size, including complete joined groups, with two CSS pixels of top/bottom padding. Horizontal hit testing follows variable-width entries; there are no hidden vertical rows. Short landscape caps the piece height to retain usable board space.
- Tidy eligibility is strictly unconnected loose singles. Joined unlocked groups, locked/placed groups, sorting-tray pieces, and valid held groups stay stationary. Close complete rectangular rings include corners before advancing outward. Protected groups are obstacles. The client ignores joined coordinates even if an obsolete server sends them in a canonical Tidy message. Recall/Shuffle remain separate operations.

## Verification

- `tests/puzzle-workstation.cjs`: 212 checks; actual Durable Object handlers, storage restart, tray-out/return/recall, no exterior collision, identity/scoring preservation, delayed hold delivery, local drag protection, 28 inline scripts parsed. Obsolete assertions expecting Tidy to translate joined groups were updated to require absolute preservation; the lease test now uses an unconnected single.
- `tests/tidy-singles-rings.cjs`: 546 checks; complete-ring ordering and four corners for tall/wide/normal boards, repeated actual-server/client Tidy, exact joined/placed/held/trayed state, collisions.
- `tests/tray-auto-deployment.cjs`: 124 checks; actual server/client deployment, crowded/offscreen/invalid viewport, joined pulls, tap/drag origin, valid and expired holds, bounds and no automatic scoring/locking.
- `tests/puzzle-next-direct.cjs`: 24 checks; actual human game ID 20 opened, bot-only game 21 excluded, zero waiting-hub calls, double click, cross-room success, Home/room change during pending transition, drag/carry/lift pickup during pending reads, pickup during room transition, direct-action accessibility semantics, restored unrelated navigation functions.
- `tests/snug-tray-renderer.cjs`: 24 viewport/DPR/zoom configurations, 121 entries containing 122 unique IDs (one joined pair); every ID reachable through horizontal scrolling, all painted bounds fit with two CSS pixels padding. 8,784 assertions.
- `tests/green-play.cjs`: 34 existing human/bot/count/preservation checks.
- `tests/next-game.cjs`: 18 actual-candidate navigation checks, preserving the original unrelated manual/automatic routes.
- `tests/workstation-menu-controls.cjs`: 12 states, 20 toggles, 24 cardinal actions; current Menu correction preserved.
- Wrangler deploy **dry run only** succeeded: 482 modules, existing DB/PUZZLE/MUSIC_FILES bindings, no deployment.

Browser: local fictional fixture only, four responsive viewport captures. Phone/tablet/desktop max-zoom painted pieces are snug; landscape retains a smaller snug row to keep the board usable. Actual pointer tap deployed fictional ID20; drag deployed ID21, with the placed count unchanged and joined IDs1/2 remaining at (-200,100)/(-150,100). Actual Play opened the Regular Rummy table directly without a waiting-list dialog. Actual fictional Tidy left the joined pair at those exact coordinates. The browser fixture adapts the production planner in memory; actual Durable Object protocol/storage coverage is in the separate tests. This is not physical-device or production-gameplay acceptance.

Phone and tablet previews are saved privately. Library identifiers and local user paths are intentionally excluded from these publication notes. The navigation test uses Git from PATH, or the OHANA_TEST_GIT executable override.

No Roadhouse, TEN, Rummy/Decks, Bridge redesign, Home reorder, announcement, schema, credential, music, memory, or invitation changes are included. Publication waits for exact-patch re-review and the coordinated guarded release step.
