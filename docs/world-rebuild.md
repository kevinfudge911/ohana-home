# Ohana shared island rebuild — September 18, 2026

The approved Spades image in OHANA-DESIGN-MASTER.md remains the visual direction. This is an implemented home-and-table composition, not completion of every planned game or of Spades gameplay.

## Changes

- Illustrated island veranda as a shared living backdrop, with existing clock/cloud/water motion and reduced-motion preference preserved.
- Separate carved turquoise table asset. Home game invitations become parchment cards on the felt, with character medallions and wood nameplates.
- Existing game boards receive the shared setting, opponent seats, visible How to play, and the player portrait. Hand/Foot and Ohana 10 card hands move onto the table. Mobile tables extend vertically without shrinking the original card numbers or character art.
- Home Start a game and Room chat use existing actions. Catalog screens keep room and player choices. Narrow navigation stacks its icons over labels.
- Fixed unrelated chat-menu wiring that was throwing inside existing game-help dialogs.

## Preserved

All existing engines, custom rules, discard opening requirements, wild-card assignments, game data and character assets. Hand, foot and oval card shapes remain distinct. Chat, sound, accessibility and room management use existing controls and handlers. The only Worker edits are two static imports and two asset routes; the stripped Worker is byte-identical to the recovered live version.

## Validation

- 10 discard-opening engine regression tests and 7 wild-choice engine tests passed.
- Browser checks at phone and desktop sizes: home (one and multiple games), start catalog, rooms/settings, Words, Hand/Foot, Ohana 10, Tic-Tac-Toe, Memory and Checkers.
- Hand/Foot split-wild choice, pile targeting and submission payload; Ohana 10 number/color choice, pile target and payload passed.
- Card selection, distinct hand/foot outlines and round Ohana 10 cards preserved.
- Help dialogs, chat, Back and Start a game opened without browser errors; tested mobile screens had no horizontal content overflow.
- No real player moves or messages were submitted during testing. Browser fixtures are local demonstration state.

## Source handling

Apply tools/apply-world-rebuild.py to a freshly recovered live module directory from the prior wild-choice release. It consumes assets/ohana-world.js, assets/ohana-world.css and the two world WebP files. Do not apply to an already patched module package. Never deploy the repository root worker.js or main branch: they are stale. Raw live Worker code is deliberately excluded from Git because it contains private signing material.
