# Ohana rooms and games — illustrated details

September 18, 2026. Follow-up to the shared island rebuild, responding to the missing reference details. The Spades reference remains the visual standard; this release does not introduce Spades gameplay or claim an exact final match.

## Implemented

Flower has a hibiscus garden veranda. Private rooms consistently select a cove, garden or beach setting from their stable room ID. Main-room Words and Checkers use the lantern cove; Memory and Mahjong use the garden. Existing room privacy and membership are unchanged. Background switching preserves the scene renderer, local lighting schedule and reduced-motion preference.

Added illustrated floral corners and table crests, scenic character medallions, a illustrated hibiscus portrait for flower avatars, larger player seats, decorative opponent card fans, wooden live scoreboards and separate coral, blue, green and violet navigation controls. Scores are derived from existing game state; Ohana 10 reads penalties, not a fabricated points field. Card ranks, faces and special hand/foot/oval silhouettes are unchanged. Wide-screen card hands have gentle individual rotations with no overlap; phone cards remain upright and fully readable.

Each game receives a coherent accent: Words violet, Hand/Foot lagoon, Ohana 10 coral, Memory green, Mahjong jade, Checkers amber, Tic-Tac-Toe sky blue. These are distinct accents and settings within one brand, not seven completely new tabletop illustrations.

The Words title is visible again. The letter tray now sits below the board in the document layout instead of covering the lower rows. The selection rerender restores the scene details, player seat and tray without changing scoring or network actions.

## Validation

17 engine regression tests passed (10 discard-opening, 7 wild-assignment). Browser checks passed for both card-game wild pickers, assigning separate piles, payload construction, help/chat/back/start flows, and rendering Tic-Tac-Toe, Memory and Checkers. Theme tests passed for Flower, private rooms, Words, returning home, room doorway pictures and repeated rerenders without duplicate backdrops/scoreboards. Words letter selection, placement and recall passed after the tray change. Phone content width stayed within the viewport. Decorative foliage is intentionally clipped at the viewport edge and never receives pointer events.

All browser gameplay used local sample state; no real player moves or chat messages were sent. Mahjong received shared presentation changes but no separate gameplay fixture test.

## Rebuild and source safety

Apply tools/apply-ohana-details.py to a fresh recovered package of the prior world-rebuild release. It consumes assets/ohana-world.js, assets/ohana-details.css and the three new assets. The patch changes the public HTML, scene module and three Worker static routes/imports. Removing just those imports/routes yields the exact previous live Worker. No bindings, database schema or game engine code changed. Never deploy stale main/root worker.js. Raw recovered Worker packages contain signing secrets and are intentionally excluded from Git.

The current public HTML and scene module are in design/premium. Screenshot files depict the implemented interface with local sample game data. Asset prompts and paths are in ohana-illustration-assets.md.
