# Bridge integration

Baseline: 0d034a9267e240e60b9128a0ff8b0690f6d9d478. Applies exactly the independently reviewed Bridge v3 cumulative source and its corrected standalone header dependency.

Current game actions and Family & rooms navigation have separate groups. The record player is centered. Chat and Expand remain inside the Bridge. Quit and Restart capture the original game context and cancel safely; Updates dismisses the Bridge before opening. One corrected shared-header component and one Bridge adapter remain.

Validation: 199 context assertions; 71 dispatch/cancellation assertions; 10 actual Worker checks with fresh in-memory fictional data; 77 direct-navigation assertions; 24 Puzzle next-game assertions; music queue lifecycle regression. All 30 nonempty scripts parse. Phone, tablet and short-landscape browser checks show the grouping, contained chat, reachable Updates, normal-entry Return and unchanged fictional cards. A fixture preference-write attempt was blocked; no family API was contacted.

Preservation: temporary Git-index reconstruction proves the production HTML is exactly the two reviewed patches on the live baseline. All 14 quick-navigation functions, TEN bounds, Worker, bindings, package configuration and build script are unchanged. Existing puzzle code is covered by that exact-patch proof. Gzip decodes byte-for-byte to the HTML; all 482 attached modules match source. Dry-run upload 62,630.16 KiB, below the 63.9 MiB limit.

No Rummy UI, camera, Memories, Roadhouse art, announcements, family moves or saved-game migrations are included. Production remains unchanged pending final integration review and the authorized guarded publication.
