# Discard-pile opening repair

Kevin clarified that a player may open while taking the discard pile when the opening points come from the cards being laid from their existing hand. Drawing two is an alternative, not a prerequisite.

Root cause: the pickup click handler sent the obsolete, emptied staging queue instead of the selected cards. The Meld button was disabled until after drawing, and its hint incorrectly said only Draw 2 first. The server also counted the top discard toward opening and accepted extra IDs only after adding the rest of the pile.

Repair: both pickup controls now validate the selected hand cards with the visible top discard, send only owned card IDs, and perform one atomic pickup/meld. The bottom action reads Meld & take pile before drawing. Server checks the opening against only committed cards already in hand and rejects pile-sourced IDs. Existing legality checks, card values, whole-pile pickup and transaction rollback remain. How to Play now describes this rule and the joker's 50 points.

Tests: 10 regression tests include the recorded two fours + two aces + joker selection, exact 50-point opening, 45-point rejection even if top pushes total above 50, unrelated joker exclusion, attempted use of pile IDs, atomic invalid groups, already-open pickup, second-draw prevention, pickup-after-draw rejection, and round-three opening. Phone Chromium test confirmed both controls submit all five selected hand cards with no browser errors.

Published version: 981b5e21-7977-4e24-947d-4a71c16d62e2. Only worker.js and app.html changed in the recovered active deployment; no database or artwork changes. Backend patch is fixes/discard-opening.py; execute against the current recovered source, not the stale backend on main. The recovered Worker contains private push-signing material and is intentionally not committed.
