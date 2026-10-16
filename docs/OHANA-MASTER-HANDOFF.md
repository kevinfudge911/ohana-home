# Ohana Home — master handoff, October 16, 2026

## Read this first

The user wants finished, tested work published promptly, with honest separation between generated, staged, pushed, and verified live. They have about 5% usage left and report a reset on October 22. Avoid duplicate research, repeated broad tests, unnecessary image generation, and unrequested extra features. Only outfits are paused. Other features were NOT cancelled. Keep progress concise and do not interrupt conversations with Mike, Chris, pets, or other devices.

Production: https://ohanahome.app . Repository: kevinfudge911/ohana-home . GitHub main auto-deploys the Cloudflare Worker ohana-home. Do not change or delete PuzzleRoom Durable Object storage, bindings, SQLite exports, migrations, or lifecycle. Never play a production move or send a family message just to test.

Local workspace: C:/Users/kevin/Documents/Codex/2026-10-14/ohana-local-browser-verification . Local work/ paths below are private test/staging files, not automatically present in a fresh GitHub checkout. Pending text patches are mirrored under handoff/2026-10-16 in GitHub with this handoff. No test databases, credentials, or private photo files belong in that mirror.

## Deployment and recovery

Last confirmed live before the release accompanying this handoff: commit 6cd0c67ca9584370d22db1c78109324bb6430a9c, app 6,020,509 bytes, Git blob 42779e1dbb99da512650f01632bb2e323b884ac8. Public response AND actual signed-in Home loading were verified. It includes the music library ACL, section updates, new category artwork, printed-text Bible attempt, tablet Tic-Tac-Toe shoreline, skip-cycle repair, shared automatic-turn repair, Memory reveal pacing, and large Dominoes rack scrolling.

The pending combined release saved with this handoff has app 6,112,686 bytes, Git blob bd331892f746c5d4941bc946cd9c351617cdcedf; worker 772,457 bytes, blob 83b9a39281f677b99b05685de91086b53cc58f6a. It adds the NEW Home order and game grouping, NEW Bridge phone layout/guide, compact Hand and Foot layout/scores, BLACK-THREE-only rules, and the tested digital song-bank selector. Verify deployment/public bytes before calling this live. The red-three scoring changes, YouTube, new Bible design, and shared coloring are not part of that combined release.

App remote path: live/5e56a1670589dcba0b60713f79c86ac150466cca-d975c2c4ca11dd0e62f2534a9e5dddeea065a1f8-3bf844cb8c9c2a87e301a8616088ba6047d9ab5e-app.html . Worker: live/worker.js . Static imports use Wrangler no_bundle. Do not blindly upload all local live/ files: local folders contain old plain SVGs and audit files absent from current Git.

Two incidents this morning:

* First deployment ccaacb8 failed Cloudflare validation 10027: actual package exceeded the 64 MiB uncompressed limit even though raw tree bytes were just below it. Wrangler/module overhead matters. Losslessly gzip-compressed the remaining 22 coloring SVGs, added their names to the existing gzip route set, and replaced the corresponding Git modules. Saved 864,185 bytes. All original Git hashes, gzip round trips, and actual 22-page browser rendering passed. Originals are recoverable in Git history/local backup. Do not restore the plain modules into the deployment accidentally.
* Release bb5be23 initially hung Home at Loading. New api() turn-watch hook called helpers in a later script before their declaration script executed. Rolled back with d1493ba to the exact last working 33488 tree, verified Home, then fixed helper ordering. The helpers now live BEFORE api() in the same initial script; typeof guards also remain. Corrected release 15a8a537 passed normal startup and reload, then public signed-in Home. Preserve this fix. Seeded fixtures had hidden the original bootstrap failure.

Local evidence/backups: outputs/ohana-full-audit-2026-10-15.txt, outputs/rollback-live-33488-2026-10-16, outputs/retry-release-2026-10-16, outputs/coloring-lossless-backup-2026-10-16, work/normal-boot-proof/EVIDENCE.md . Old rollback app blob fd8c1639d05ebad8f0ac973e786a9f97e368e120, tree eaf26150211b66eba7d9cc764317e1d10492f04a.

## Current priorities and exact requirements

### Home organization — latest instruction supersedes earlier order

Keep Play now plus waiting-turn count at the top, opening an existing waiting game directly. Main entrance order: **Music, Memories, Blessings, Granny, United, Journey, Shuffle, Tile**. Granny stays a separate main entrance. Journey, Shuffle, Tile all stay on Home.

Move individual active games INTO their matching rooms. Inside each room show existing games, opponents, scores/status, and whose turn; preserve original game cards below for starting games. Shuffle: Ohana 10, Hand and Foot, Spades. Tile: Chess, Mahjong, Words/Wordfeud, Dominoes. Journey: coloring, Tic-Tac-Toe, Memory, Checkers. Our Ohana people can remain below room entrances. Opening rooms must not create games; existing setup/settings/invite flow remains.

Home repair is tested in work/home-category-repair: normal boot/reload, exact eight entrances, restored Granny, Play now, matching active lists, Back/Home, and opening an existing Memory table without playing a move. Original nodes and their handlers are reparented/restored. A MutationObserver loop was caught and fixed; preserve the guard that moves Our Ohana only when it is not already in the correct place.

### Bridge — ready in combined release

User phone screenshot showed duplicate old glyphs alongside new artwork, wrapped words, hard-to-read controls. Above record player: ONLY Ohana Home and Ohana Bridge title. No Commands or Music tabs. Below player: one light cream backing that includes BOTH symbols and labels, Chat, Help, sound and tools. Ordinary family Chat visible; AI Chat hidden from menu but existing background function preserved. Labels whole, targets at least 44px, one meaningful icon each. Bottom cardinal always accessible and toggles back to the same game without Home trip.

work/bridge-phone-layout-repair/build.cjs followed by finish-guide.cjs makes bounded changes. Guide version 2 uses an actual current portrait screenshot with instructions underneath. Phone/landscape Chat/Help/Close and physical Play/Pause passed; one audio singleton preserved. Some semantic automation clicks miss skewed physical button geometry, so use visible physical hit testing when appropriate.

### Hand and Foot layout — ready in combined release

Use EXACT actual playing-card renderer/art for meld samples, not a different demo design. Overlap cards like a real hand, keeping every rank/number/A/K/Q visible. Compact samples together. Draw and discard immediately above own hand; melds above those piles. Own foot at bottom right, near hand. Opponent on opposite side. Red threes on owner's side, own near own hand, with visible owner/count. Workstation score UNDER player name so names/scores remain readable on phones.

work/hf-compact-layout is layout-only. Actual phone hand shrank from about 304px to 204px, no horizontal overflow; all nine sample rank corners exposed, Ace tap shows 20 points, foot/draw/discard positions checked. Scores measured below names on both players. No red-scoring inference is included in the layout patch.

### Hand and Foot rules

**Black threes:** always ZERO in hand, foot, or meld. They block discard-pile pickup, even if another black three is held. May meld at least three pure black threes only in final foot after required clean and dirty books, when they are all remaining cards except ONE final discard. No wilds/red threes in that meld; no book qualification/canasta bonus. BLACK-ONLY repair is included in the pending combined release. Ten engine test groups and an isolated actual browser black-three Meld → final discard → finished round passed. Invalid melds rejected atomically. work/hf-black-only has guarded transplant and evidence.

**Red threes requested, NOT yet published:** +100 each only after that player's opening meld. Any player who gets four earns 1,000 total for those four, not only the first player. Red threes caught in hand or unopened foot at round end cost -300 EACH. Auto set-aside/draw replacement stays. Red threes visibly stay beside owner.

One question is still pending: eight red threes — 2,000 for two sets of four, or 1,400 from a single four-card bonus plus 100 per extra? User has not answered the presented choice. Full staged rules currently provisionally use one bonus +100 extras; do NOT silently publish that assumption. Unopened, auto-set-aside reds are provisionally zero because bonus needs an opening meld; distinguish those on table from actual hand/foot penalty. BLACK-only patch explicitly leaves current red scoring unchanged. Full provisional patch: work/handfoot-house-rules . Isolated full-flow proof work/hf-combined-private . Do not carry fixture-only reconnect-overlay hiding into production.

### Bible — user says highest priority after current repairs

Current published typography attempt is REJECTED by user. Do not call it fixed. Preserve approved Bible/table artwork. User supplied four Bible/cake references for page/text appearance; use dense real-print geometry from first/third, not cake decoration.

Research completed: all eleven existing NKJV verses match verified source (retain 1 Peter 5:7 lower-case continuation; no paraphrase). Current implementation splits a SHORT verse arbitrarily across leaves, stretches justified spacing, has excessive blank paper, and can put lower book behind workstation. These are concrete defects.

Proper approach: dark near-black regular serif; coherent paragraphs/poetic lines and small verse numerals; small book/chapter running heads, equal outer margins and larger inner gutter. Each page plane independently follows perspective/curve; clip ink to paper. Keep complete short verses together. Fit whole book above workstation on phones; an optional tap-open readable book view can solve scene-scale limits. No giant Holy Bible heading/cross pasted onto open pages. No fake/repeated filler Scripture.

Content constraint: eleven short NKJV quotations cannot honestly imitate a full continuous printed Bible spread. Options are accurately labelled selected passages, or verified contiguous text obtained appropriately. Do not silently change translation or fabricate surrounding scripture. No new Bible implementation has been made from this research yet.

Research: work/bible-research-2026-10-16/verse-checks.json and recommendation.txt; work/bridge-phone-layout-repair/bible-research.txt . Cambridge actual NKJV samples are PDF pages 24–26, printed 19–21: https://www.cambridge.org/ca/files/2614/0500/2026/9781107924260Web.pdf . Thomas Nelson sample: https://cr-assets.localretailconnect.com/preview/9780785259480.pdf . These document paragraph/verse-number typography and margins. Do not substitute decorative quote panels again.

### Music — latest direction

Live catalog has 907 original tracks, independent per-listener playback, search/filters/playlists, shuffle bag without repeats until exhausted, carry between rooms and Memories. Original catalog is immutable. Family contributions live: supported direct Suno audio URL metadata, own edits/removal, Only me default / My Ohana / Selected people. Three-member actual browser + 23 SQLite ACL checks passed. Playlists cannot grant access to private underlying songs. Known provider-public media URL remains external; app ACL protects Ohana catalog access, not a copied provider URL.

Current cream scrolling selector REJECTED. User supplied five jukebox references, then explicitly chose FIRST digital Nostalgia touchscreen style. Desired: professional dark/backlit DIGITAL command center inside Ohana jukebox, songs/genres/adding/editing/playlists/playback ON SCREEN. Not extra physical key rails/hinges/buttons. Vintage examples guide cabinet visual quality, not interaction. Fixed title banks/pages instead of a vertical listener song-list scrollbar. work/jukebox-bank-preview has the bounded music-module-only implementation. Actual 8841 phone bank paging, filters, sharing-form access, and playback through rotation passed with the isolated ACL backend. This tested selector is included in the combined release, with no YouTube implementation yet.

**Newest video scope supersedes cancelled corner TV / separate Theater plan:** add television in MUSIC ROOM corner; chosen song's YouTube video shows there. Video only needs to be visible in music room, while sound can continue throughout other rooms. Reuse existing controls, sharing choices, and persistent player. User and Fudgy Pie and other members can add YouTube links. No channel URLs/auth have been provided; do NOT claim channels are connected or all uploads auto-imported. Minimal link-based playback first; no new Theater room now. Separate outdoor Ohana Theater is later if wanted.

YouTube playback is NOT built yet. Current backend only accepts supported Suno URLs; must add strict validated YouTube source handling and explicit iframe playback, never send YouTube page URL to audio.src. Keep one effective playback source (pause audio when video begins; pause video when audio begins), preserve ACL. IMPORTANT research constraint: YouTube Developer Policies III.I.9 prohibit hidden/background player playback (https://developers.google.com/youtube/terms/developer-policies). The user's requested hidden TV picture with continuing YouTube sound outside Music therefore needs a supported alternative decision: a visible small player during games, or pause YouTube when leaving Music. Ordinary direct audio can continue as before. Do not promise hidden YouTube audio. Official docs https://developers.google.com/youtube/player_parameters require usable player dimensions and original controls/fullscreen. No arbitrary iframe URLs. No direct file-upload implementation exists; adding links is not uploading files.

Profanity fades: user wants timed brief fade/mute on explicit words, then restore volume, not a generic clean-song review gate. Prototype work/music-censor-preview passed timing/seek/mute tests but songs have NO word timings. Accurate cue mapping/source CORS/phone behavior still need integration. Do not claim all songs are automatically censored.

### Shared coloring — staged, not published

Ohana Journey contains shared family coloring table above original personal pages. Additive API/DB, operation log, polling/outbox retry, owner/admin page change/clear, own-only undo. Existing personal pages stay private/local as before. Actual two-member fill/marker/eraser sync, own undo preserves other member, host change prompts guest Join new picture, reload and personal selection isolation passed. work/journey-shared-table/transplant.cjs is bounded. Phone layout and final personal-fill persistence roundtrip still pending; global viewport overrides conflicted across workers. Do NOT claim physical phone proof. No production writes performed.

### Remaining and later

* Full-site hands-on audit AFTER current started repairs, including phone/tablet portrait ↔ landscape; shorter landscape workstation so board stays visible; no progress/cards/pieces lost on rotation.
* Checkers directly in sand, remove old raised/table look; lower priority, preserve gameplay.
* Memory smaller playful kid-friendly art/table redesign remains separate from now-live timing/rapid-second-card repairs. Original wrong-index bug was not reproduced in tested fixtures; user clarified immediate AI moves and ignored rapid second selection, now repaired.
* Automatic switching is live but still needs user's physical-device confirmation. Proven defects fixed: production POST lacks .next, capped sync may omit older current game, direct Chess/Mahjong submissions bypassed old hook. Authoritative GET and shared accepted-move watcher with rejection/new-turn guards, Memory reveal wait. Preserve startup-order fix.
* Next respects skip cycle/oldest waiting rather than immediately returning to skipped game. Manual and automatic transition guard prevent double-open.
* Game rule introduction Don't show again is per member + GAME TYPE, not each table; account preferences, manual Rules reopen. User wants actual variant, partner names, scoring explanation.
* Game setup Go windows' oversized blue controls need cohesive Ohana redesign LATER. Don't disrupt functional setup/invite flow.
* User's NEW later request: hide excessive internal turn/action narration (especially Ohana 10); keep useful turn state but don't display computer processing instructions.
* Recipient invite popup is live. Actual test invite requested but not sent: existing test profile credentials unavailable; do not guess/reset PIN or change user's current session.
* Draw Dominoes scores at round end; zero during play is expected, All Fives is different. Do NOT impose a hand-size cap based on user's joke/large drawn hand. 35-tile rack scrolling was real and repaired.
* Spades partner was Eagle for Pe-paw; MomFudge and Memaw other team. Existing character cards must be preserved.
* Journey new main artwork shows her with ALL children's activities; old coloring-only artwork becomes Ohana Color inside. Chess belongs Tile, Checkers Journey. Shuffle/Tile original new illustrated entrances are live.
* Old Canasta voice line 'those were supposed to be mine' remains unconfirmed; two possible Pogo clips only. Do not claim found.
* Five outfits saved and PAUSED: Eddie Doctor/Gardener, Honu Doctor, Otto Gardener, Pippa Gardener. Full wardrobe expansion not done. Do not publish/resume without user instruction.
* Brother's ZIP was delivered; eight explicitly disposable test tables were cleaned previously. No further cleanup authorized by that alone.

## Verification discipline

Use actual browser via the approved CUA API. Normal bootstrap tests must preserve script order; pre-seeding S/render/openGame hid the startup issue. Isolated local fixtures use fake members/tokens only; do not ship those scripts/databases. Local ports are often occupied; root starts listeners under session network permission, then delegates checks. Global viewport override can race between helpers; serialize and verify actual innerWidth, reset afterward. Resized Chrome is not a physical phone/tablet test.

Publish with fresh expected Git main SHA, no force. Keep rollback snapshots and exact app/worker Git blob hashes. Check Cloudflare build AND public response, then actually open/reload Home before telling user everything works. Passing parse/tests does not establish usability. Keep untested feature prototypes separate. Future agents should read this handoff and current Git state before resuming.
