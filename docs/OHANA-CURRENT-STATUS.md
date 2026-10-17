# Ohana Home — current master handoff

Updated2026-10-17 06:50UTC. This replaces repeated chronological status headers. Read this file first; historical claims do not override it. Full previous master is preserved at ../handoff/2026-10-17/master-history-before-consolidation.md and in Git history through7c96a6d3de90be0e812db0653dac782ab69bdb3f.

## Verified source and release

Site https://ohanahome.app ; repository kevinfudge911/ohana-home, main; Cloudflare Worker ohana-home. Last fully browser-verified application release17d0094c8de7cfb58547dfdfbf59b8942dbd9e45. Blessings styling published after Cloudflare success and fresh normal public Home/Blessings verification.

Last fully browser-verified app blob6bbb4d40d2d720701b9d896962bdc93a9ae7bda0,6313426B. Worker blob4c04306bf8ae95be043415b1da312964d43a46f0,785470B. Published after Cloudflare success and fresh normal Home/music verification. Canonical local files work/final-current-release/app.html and worker.js. Actual repo app path live/5e56a1670589dcba0b60713f79c86ac150466cca-d975c2c4ca11dd0e62f2534a9e5dddeea065a1f8-3bf844cb8c9c2a87e301a8616088ba6047d9ab5e-app.html; entrypoint live/worker.js. Do not create duplicate live/app.html. Raw live package66716673B, limit67108864B. Preserve22losslessly gzipped coloring pages and bootstrap script order.

## Already live — do not redo as unfinished

- Blessings: gold/cream tabs, filters, prayer/praise actions, editor/menu controls and Help. Praying state remains distinct; mobile wall uses readable single-column notes without sideways overflow. CSS-only change; prayers, devotional text, counts, handlers, permissions and backend untouched. Responsive390×844,1024×768 and844×390 checks; no real notes changed. See OHANA-BLESSINGS-STYLE.md.

- Bible: two printed columns on each open leaf;11saved NKJV selections; original transparent Bible/table art; larger reading view. Responsive phone/tablet/landscape fit checked. See OHANA-PRE-SHOW-AUDIT.md and historical Bible evidence.
- Home: Music,Memories,Blessings,Granny,United,Journey,Shuffle,Tile. Individual games inside matching rooms. Approved Shuffle people/card-playing artwork preserved; oversized entrance/game artwork sizing repaired.
- Bridge/music: individual light icon-and-label backings, no duplicate symbols, corrected scrolling, Room/Volume thenChat thenMyGames, player opens jukebox, digital reader, Add/Edit/Share, independent listener playback. Nashville Roadhouse photo framed with uncropped viewer. Exact reported Invite obstruction remains unidentified.
- Music929selections: original907 plus18St.Peter public-domain hymns,2HMG CC BY4.0 songs and2Incompetech CC BY4.0 instrumentals. Traditional Hymns18, Sunday Best117, Contemporary Christian2, Family & Kids4, Family Instrumentals2. Exact selected/current audio sources and elapsed playback checked for additions; both new instrumentals verified inside Ohana with visible source/license credits. These are not a full-library clean certification. See OHANA-FAMILY-INSTRUMENTALS.md and OHANA-HYMNS-BATCH-TWO.md.
- Device media controls: optional MediaSession adapter now live, supported browser native metadata/state and8action registrations checked; existing queue/transport preserved. Physical lock-screen/Bluetooth operation unverified; no OS suspension guarantee. See OHANA-DEVICE-MEDIA-CONTROLS.md.
- Navigation: native-dialog Back dedupe, Prayer/Color/Puzzle/game/Granny route history, Home restoration. Responsive Chrome checks passed. Physical Android/iPhone Back still requires confirmation; browser Home boundary is not trapped.
- Cards: mobile ranks, hand arrangement gestures, compact HandFoot layout and landscape repairs. Opponent far-side cards face their owner; own cards/names/labels/controls upright. Actual HandFoot rows checked; Ohana10 backs checked; Spades actual trick-renderer fixture checked, but live table was bidding with no trick cards. See OHANA-CARD-SEAT-FACING.md.
- Black threes: always0; pure final-stage meld after required books, leave one final discard; discard pickup blocked by black3. Red-three new scoring NOT live.
-72hour reminders: hourly cron0 * * * *; friendly opt-in waiting multiplayer turns; deduped activity period, no forced notifications. First scheduled invocation2026-10-17T03:00:01Z Success. Not proof of individual delivery. See OHANA-72-HOUR-REMINDER.md.
- Tara Android auto-advance was explicitly resolved by user. Do not reopen that investigation.

## Current normal-site phone review — user authorized

The user explicitly rejected a separate review URL and authorized publishing the saved repairs on the normal website so they can verify from their phone. Normal-site candidate app79de65e43f76315f25eeb7674d3ecc24fb5295a2,6357652B; worker e9d8c743bdce98e17aa6847ce54bd235f022819c,785805B. No separate Bridge review route should remain. Query-gated ten music candidates remain hidden normally;929 ordinary selections. Browser connection is unavailable, so fresh startup and repaired interactions are NOT independently verified. Do not call this fully tested or declare the full audit finished. Fetch main/check runs for deployment result.

Includes freeflow Blessings words, MyGames existing artwork, Room-family chooser, floating chat constrained to Bridge, Playlist lid text opening selector. Scores/Settings/Announcements and all remaining Bridge destination styling are NOT included yet; continue audit. Preserve silent-work request: no music playback.

## Latest user steering and verification hold

- User rejected gold boxes too: clickable words/art with individual light oval readability backing, no raised/blue/boxed controls. Audit every Bridge destination, including Blessings, My Games artwork, Rooms, Scores, Settings and Announcements.
- Chat must float only within Bridge and disappear with Bridge; full conversation scroll required. Room under Volume must open family-room chooser. Record-player lid must visibly say Playlist and open digital selector directly.
- Bridge repair draft stalled the browser; follow-up deployed but could not be verified because Chrome connection stopped responding. Restoring prior checked Bridge via rollbackfb9c76b38894d4adce9f8474f9e8b76df8e7ae03; check deployment and fresh normal startup before claiming restored. Do NOT call draft tested/live. See work/bridge-chat-freeflow/HANDOFF.md locally and OHANA-BRIDGE-FREEFLOW-HANDOFF.md in GitHub.
- Ten more HMG tracks are query-gated, NOT published as normal additions. Ordinary catalog remains929; preview query939. Source playback checked, actual Ohana playback NOT RUN.
- User requests silent work while resting: do not play music or run audio tests. Source/license/catalog/code work may continue quietly.

## Unfinished and next actions

1. Timed silences/profanity: PRIVATE, NOT in normal player. Explicit opt-in draft, manual exact-recording ranges only, no automatic detector. All929production tracks unmapped/unverified. Synthetic browser checks proved status update and native-volume diagnostics while generated tone played, not audible suppression. Known iOS marked playback refused; background marked playback pauses; timer throttling can leak audio. No whole-library clean claim. Read OHANA-TIMING-STATUS-RETEST.md. Local draft work/music-timed-silence/; API binding work/timed-cue-source-binding/. Exact929source map and22external recordings passed SQLite tests. Next requires audible/physical device tests and deliberate real opt-in integration, not more promotion of synthetic tests as a feature.
2. Music expansion: still need suitable Christian country, kids vocals and spoken comedy. Country source had restrictive reuse terms; LibriVox media redirected to a Chrome-blocked host. Do not bypass or add as verified. See OHANA-FAMILY-CATALOG-RESEARCH.md. Daystar is held because Ohana auto-skipped it despite source playback; do not re-add as verified.
3. Red-three scoring: agreed+100each only after opening meld; four=1000total; caught in hand/unopened foot=-300each. Need eight-card choice:2000pergroups-of-four versus1400onebonus+extras. Asynchronous question already asked, no answer yet. Do not invent/repeat unnecessarily. Full red-three cards by owner/foot already live.
4. Physical iPhone/iPad/Android/Safari audit: touch reordering, pinch/pan, pull-to-refresh, signup visibility and Back/menus still not certified by responsive Chrome. User's intermittent phone Loading report later resolved by user; cause unknown, do not claim a loading repair.
5. Background audio: ordinary singleton audio persists between rooms; source has no ordinary hidden-page pause. Lock-screen/Bluetooth/battery behavior and OS force-close require physical testing. Optional device media controls are now live; native browser registrations/metadata/state verified, physical device buttons still pending. See OHANA-DEVICE-MEDIA-CONTROLS.md. See OHANA-BACKGROUND-AUDIO-CHECK.md.
6. Identify exact Invite panel reported behind cardinal. Outgoing chooser previously fit; no invite sent in tests. Do not call all Invite paths repaired.
7. Final full gameplay/device audit remains incomplete; never certify whole site from startup/UI checks. YouTube/corner-TV and original-owned-video audio conversion remain future unbuilt work; check current provider rules before implementation.
8. Outfits only after ALL other chores are completed, published and verified.

## Mandatory working constraints

NEVER change PuzzleRoom Durable Object implementation/storage/bindings/exports/lifecycle. Preserve approved designs; no unsolicited redesigns, generic blue-and-white panels or duplicate Home controls. No messages/invites/forced notifications during tests. No gameplay moves/bids merely to produce a visual state.

Local preview networking denied. Do not retry localhost/file/data-page/alternate-port/proxy/CDP routes or enable Cloudflare preview URLs/security settings. Public same-site explicitly gated synthetic canaries have been used without family data/API writes; remove when evidence saved. Do not bypass blocked media hosts.

Use GitHub connector with fresh main lease, exact baseline guards and reversible scoped changes. Hosting success plus fresh normal public startup/UI proof required before calling live. Canonical copies update only after verification. Old full candidates/builders/patch manifests are stale; regenerate deliberately against current baseline. No physical-device claims from responsive Chrome.

Every15minutes review finished work and publish only verified items. Notify only meaningful completion/failure/necessary action; keep quiet when unchanged. Never claim workers are busy without checking. Preserve concise current state here and link evidence instead of repeatedly prepending full histories.

