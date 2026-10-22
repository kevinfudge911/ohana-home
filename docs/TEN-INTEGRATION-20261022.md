# TEN integration — exact review scope

Base: live `7625f38c4a782b57f5727d4239b2ff7e440db8f2`.

This forward-applies Kevin's approved TEN v3 (`582c077`) and the opponent-back rotation (`d3a01248`). TEN uses the approved transparent combined Home/TEN sign, purple open surface, uniform full-bleed Honu backs, flat preserved card faces, readable 26px rank/color strips, bounded wrapping, overlapped opponent hands and melds, and meld/piles/hand ordering. Only opponents' face-down hand containers rotate180 degrees; the player's hand and Draw pile remain upright. Two redundant example/instruction labels are removed as explicitly requested; meld requirements and actual card faces remain.

The final Home priority is United, Shuffle, Tile, Journey, Granny; remaining existing sections follow in their original relative order (Music, Memories, Blessings). Existing card identities, labels, links, handlers and content are preserved. This is one array-order change, not a room architecture change.

Only the configured live app HTML changes in production. Worker, game engines, puzzle behavior, current Menu and workstation controls, bot logic, auth, schemas, progress, music, media and invitations remain unchanged. Home/all-quick-Play behavior restoration, new puzzle follow-up, Rummy/Decks, Bridge and global headers are separate and are not included. No announcement is included.

Verification: 28 inline scripts parse. The source check proves all original JavaScript unchanged except the TEN presentation hooks, the two requested labels and the approved Home-order array. The actual TEN engine rejects an invalid meld without mutation and accepts the valid six-card phase while retaining the spare card. Existing puzzle protocol/storage212, Tidy protection546 and direct-navigation24 checks pass against this integration. Home-order DOM18 checks cover repeated preparation, missing/late Music, unchanged nodes/actions and the family section.

Actual Chrome fictional-fixture checks cover phone390x844, tablet768x1024, desktop1280x900, landscape844x390, a30-card three-row phone hand and four-player rotation. Cards stay within the board, no sideways overflow, opponent backs match Draw artwork and rotate180 while own/Draw remain upright. An actual drag moved card10 to the front; the order survived reload with all IDs preserved, saved game unchanged and zero API writes. Vertical scrolling is required for long hands and short landscape. Screenshots remain private local evidence; no private Library identifiers, user paths or screenshot binaries are included here. No family games were moved, created or mutated.

Run `node verify-ten-source.cjs`, `node check-ten-phase-v3.cjs` and `node tests/home-room-order.cjs` from the checkout. The source test uses Git from PATH or the `OHANA_TEST_GIT` executable override. The Home DOM test uses jsdom from the configured dependency runtime. Packaging uses Wrangler deploy dry-run only before publication.
