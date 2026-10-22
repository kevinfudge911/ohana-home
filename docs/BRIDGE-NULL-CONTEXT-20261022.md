# Home/Puzzle Bridge command context

Published baseline: 23c91bb4d553480d7e271ef48cbceb0e884b8e8f. Live Home Bridge Announce closed the Bridge without opening the composer, reproduced twice without sending. Memories and main HTML otherwise match the reviewed media release and Cloudflare is Ready at 100%.

Root cause: typeof null is object. The optional table ID becomes undefined, Number(undefined) is NaN, and the captured context can never compare equal. Normalize only missing/null IDs to zero in both bridgeGameContext ID expressions. Existing account, room, visit, tab, puzzle and real-table guards stay intact. No announcement, game move, upload, auth, engine, artwork or Worker change.

The old actual handlers reproduce the defect in 22 assertions. Corrected actual handlers pass 33 checks for Home/Puzzle command destinations, real table compatibility, native dismissal wait, and cancellation after account/navigation changes. Existing 71 Bridge dispatch assertions pass. Whole-source inverse restores the exact published application, all 32 scripts parse, and regenerated gzip is exact and idempotent. Live recheck awaits reviewed publication of this follow-up.
