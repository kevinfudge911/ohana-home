# Rummy / Gin robot batch — prepared, not published

Based on live `64f859f62975a08449155cb3152cdcd34ec8a653`. Adds one standard two-player Ohana Robot opponent to Regular Rummy and Gin. Family Rummy remains2–6; family Gin remains2. The existing shared table, cards, scoring, hand arrangement and family invitation flow remain in use.

Setup: Home → Ohana Shuffle → Card table → Choose a game → Regular Rummy / Gin Rummy → Ohana Robot → Play Ohana Robot. This path works in the **local fictional preview only** until publication is separately approved. A creator may also explicitly add the robot to a one-person waiting two-seat Shuffle table; active or larger family tables are not converted.

The policy receives only its own cards and public table information. Existing engine validation applies every action; the bot cannot use other hands or stock order. A complete turn is computed in memory and saved through the existing state/turn/status lease. Reloads resume pending bot turns. Repeated/concurrent requests cannot commit a turn twice. Completed rounds wait for the human to review and choose Next hand, including a robot win. Replay preserves the robot seat.

The standard Rummy policy melds, lays off and discards. A public-counter-based occasional low-card release breaks otherwise endless tiny-hand pairs; the initial seed19 simulation reproduced two opponents holding all four aces in pairs. That regression now finishes, and all40 seeded fictional hands finish within450 actions. Gin handles opening passes, drawing, discarding, knocking/Gin and existing finite-stock/scoring rules. No difficulty-level quality claim is made.

## Validation

- Existing engine suite:60 fictional simulations plus deal, meld/layoff, scoring, revisions and privacy.
- New robot suite:40 completed seeded hands,1,377 legal actions and4,285 assertions; actual Worker with in-memory SQLite covers bot-first, exact concurrent turn count, forced CAS collision, interrupted draw, reload, human round review, next hand for both modes, replay, seat/ownership rejection and preexisting-game preservation. No family invites are emitted by bot creation/replay.
- Actual setup-binding tests cover mode/opponent switching, two-seat clamp, keyboard focus, robot create/open payload and unchanged six-seat family chooser.
- Existing UI and6 interrupted-client cases preserve private hands, arrangement/order, revision payloads, pending gates and navigation isolation.
- Local Chrome against actual candidate Worker/SQLite: Rummy human draw/discard and robot reply; Gin opening pass, robot reply, human draw/discard and robot reply. Reload/reopen preserved the Rummy hand order. Phone390×844, desktop1280×720 and landscape844×390 checked; actions46px, cards65×96px and no sideways overflow. Long hands use existing vertical scrolling. No physical-device touch or complete browser match-to100 claim.
- Preservation guard checks exact app bytes outside the shared-card module and the waiting-bot eligibility change, the nine allowed Worker hunks, and unchanged config, CSS, catalog and music module. Words/Domino, Roadhouse, announcements and other app logic are preserved.

Run from this checkout with Node24 and existing jsdom on `NODE_PATH`:

```
node tests/shuffle-engine.cjs
node tests/shuffle-api.cjs
node tests/shuffle-bot.cjs
node tests/shuffle-ui.cjs
node tests/shuffle-bot-setup.cjs
node tests/shuffle-interrupted-flow.cjs
node tools/verify-bot-preservation.cjs
```

`node tools/bot-preview.cjs` serves `http://127.0.0.1:8794/` with synthetic users and in-memory SQLite. It never forwards API requests to production. Closing the process discards only these fictional tables. Actual family-game mutations, invites and announcements are prohibited in this workflow. Browser screenshots and receipts are local in `artifacts/`.

## Deferred backlog

- The larger Shuffle selection area is deferred until Kevin inspects this bot batch. The catalog remains85 rules-only candidates; only Regular Rummy and Gin are currently playable on the shared card table. No solo card adapter is implemented or newly claimed.
- Static bot audit finds existing policies for Words, Domino, Tic-Tac-Toe, Memory, Checkers, Chess, Mahjong, Ohana10, Hand & Foot and Spades. Those existing bots were not fully recertified here. Memory/Mahjong have solo modes; solo puzzles/coloring need no opponent.
- Spades needs a separate review: its declared classic game is four-player partnerships, but the generic one-robot flow creates only two seats and `spInit` deals13 cards per seat (26 cards total). Its bot replay is also excluded by the existing allowlist. Do not claim a correct four-seat robot partnership game from policy presence alone. Preserve existing human Spades tables while defining the proper bot-seat/rules scope.
- Domino variant coverage and multiplayer Mahjong bot continuation deserve dedicated fixtures; policy presence does not certify every variant. Cooperative United puzzles have no automatic opponent implementation.
- My games currently labels shared tables as Ohana Shuffle · Card table; mode-specific labels can be considered with the deferred selector work.

## Release hold

No push, deployment or Rummy announcement is authorized by this preparation. Report the exact commit/tree/tests for bounded publication review. Preserve all family progress and safe Shuffle readers; use forward recovery rather than a blind old-Worker rollback. Roadhouse, workstation artwork, catalog expansion, schema/migrations, music and Memories are excluded.
