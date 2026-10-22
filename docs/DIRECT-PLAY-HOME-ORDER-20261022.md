# Direct quick Play and latest Home order

Forward integration from live12d7c6bd. Home Play, manual game Next/Skip and room shortcuts open the next eligible human waiting-turn game directly. They do not open the Games waiting dialog or require a second Play tap. Bot-only tables are excluded from manual attention navigation. Existing automatic advancement is unchanged. Dedicated My Games and explicit waiting-list access remain available. Puzzle's accepted direct handler and all current control styles/locations are unchanged.

The five reviewed navigation functions carry the direct-routing correction and async context guards, so a delayed read cannot override a later room/game/profile/navigation choice, active puzzle pickup or changed Words draft. Confirmations for unplayed letters remain. No game move is submitted by these controls.

Kevin's latest Home order is United, Blessings, Shuffle, Tile, Journey, Granny, Music, Memories. Only the existing card-order array changes; artwork, IDs, routes, handlers and content stay intact.

The lossless main-HTML package is refreshed. A deterministic local build hook regenerates gzip before every Wrangler build/deploy, preventing stale served HTML. All482 emitted modules are byte-verified. Dry-run upload62456.60KiB remains about60.99MiB with roughly2.9MiB headroom. Worker code, engines, bindings and stored data are unchanged.

Verification:77 actual-handler assertions across12 contexts,18 manual/automatic navigation checks,24 Puzzle direct-navigation checks,18 Home-order DOM checks,28 parsed scripts, unchanged TEN meld engine checks and package integrity pass. The actual Chrome fictional fixture opens its sole TEN destination from one Home Play tap with no waiting dialog and unchanged saved game. Its existing first-visit What's New card was dismissed before that click; the fixture rejected the update acknowledgement, and no gameplay action was invoked. No real family moves or games were created.

Run tests/direct-play-routing.cjs, tests/next-game.cjs, tests/puzzle-next-direct.cjs, tests/home-room-order.cjs and tests/ten-lossless-packaging.cjs with the configured jsdom dependency runtime. Git may be supplied through OHANA_TEST_GIT. Published history12d7c6bd and74166441 supplies reproducible baseline reads. These tests use isolated DOM state and make no network requests.

Not included: puzzle scale/ring/drag follow-ups, shared headers, TEN board-height/zoom changes, Bridge, Rummy/Decks, Roadhouse art or announcements.
