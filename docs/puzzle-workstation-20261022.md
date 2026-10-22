# Puzzle workstation candidate — October 22, 2026

Local candidate based on production f2c34d3. Not published. Independent parent review and exact publication approval are required.

- One green Play control/count shares Home's human-only waiting-turn list. Bot-only opponent tables remain in My games.
- One Preview above bottom player/score row; cardinal and single Menu toggle remain clear. Existing ten-second Preview behavior is retained.
- Tray sprites fit available height. Tested short landscape retains a 44/51px open tray and 89/96px puzzle canvas at 667×375 / 844×390; double-tap board zoom responds.
- Tidy includes off-table singles and joined loose groups, moving joined groups rigidly. IDs, membership, relative offsets and locks remain intact. Placed pieces, whole held groups and sorting trays stay fixed.
- Close perimeter rows use conservative rendered tab bounds. Settled exterior drops, tray-out/return, Recall and automatic arrangements resolve cross-group collisions. Temporary overlap wholly inside the board remains allowed.
- No schema, permissions, game engine, scoring, music, Memories, artwork or announcement change. No real family gameplay was used.

## Validation

Run from repository root using Node 24. DOM suites require jsdom via NODE_PATH; existing supported runtime dependency directory: C:\Users\kevin\Documents\Codex\2026-10-19\task-2\test-tools\node_modules.

    node tests/puzzle-workstation.cjs
    node tests/green-play.cjs
    node tests/workstation-menu-controls.cjs
    node tests/shuffle-api.cjs
    node tests/words-domino-layout.cjs
    node tests/next-game.cjs
    node tests/shuffle-bot.cjs

Receipts: 203 puzzle checks, 34 Play checks, 72 tray cases with zero clipping; existing bot/API/Words/Domino/Menu regressions passed. Wrangler dry-run passed with unchanged bindings. Browser used the production app plus fictional local transport; real Durable Object handlers/deferred storage were tested separately. Not physical-phone acceptance.

Private phone preview: https://drive.google.com/file/d/1kc_PJ8ih5mD8AxKgpvKgA61OITFlU5YE/view?usp=drivesdk

## Recovery

Reconcile current main before publication. Use scoped forward recovery; never restore an old unsafe reader. Rummy announcement and unrelated redesigns remain excluded.

## Independent review correction

The independent reviewer reproduced delayed remote-grab delivery: at server hold age 15.1s, the receiving client considered its hold only 14.9s old and discarded Tidy. The corrected client trusts each server-listed Tidy coordinate and clears that remote lease, while protecting the actual locally active drag/carry/lift group and placed pieces. The real server/client-handler regression reproduces a 200ms delivery delay and verifies immediate coordinate equality, intact joined offsets, a valid remote lease omitted by the server, and all three active local modes. Targeted independent re-review remains pending.

The navigation suite now reads the configured live candidate instead of archived root app.html; 19 checks cover manual hub routing, workstation placement, confirmed-turn room changes, actual-table verification, pending/stale/context guards, existing bot navigation, and returning to an unchanged puzzle.
