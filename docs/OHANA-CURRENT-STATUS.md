# Ohana Home — current master handoff

Updated2026-10-17 06:20UTC. This replaces repeated chronological status headers. Read this file first; historical claims do not override it. Full previous master is preserved at ../handoff/2026-10-17/master-history-before-consolidation.md and in Git history through7c96a6d3de90be0e812db0653dac782ab69bdb3f.

## Verified source and release

Site https://ohanahome.app ; repository kevinfudge911/ohana-home, main; Cloudflare Worker ohana-home. Current application release27d09628399eb624150853f5ecf82869bb6e0eed. Later commits contain handoff updates and temporary synthetic test deployment/removal. Latest test cleanup efe8dfac5a1c6db02e6fd1b63ca5ead55efafb80 passed Cloudflare success and normal public Home startup; former test query also returned normal Home.

Current app blob8c6b2a950df14e272c864108f4bece1ff487bdfe,6307724B. Worker blob4c04306bf8ae95be043415b1da312964d43a46f0,785470B. Both verified against current Git main during consolidation. Canonical local files work/final-current-release/app.html and worker.js. Actual repo app path live/5e56a1670589dcba0b60713f79c86ac150466cca-d975c2c4ca11dd0e62f2534a9e5dddeea065a1f8-3bf844cb8c9c2a87e301a8616088ba6047d9ab5e-app.html; entrypoint live/worker.js. Do not create duplicate live/app.html. Raw live package66710971B, limit67108864B. Preserve22losslessly gzipped coloring pages and bootstrap script order.

## Already live — do not redo as unfinished

- Bible: two printed columns on each open leaf;11saved NKJV selections; original transparent Bible/table art; larger reading view. Responsive phone/tablet/landscape fit checked. See OHANA-PRE-SHOW-AUDIT.md and historical Bible evidence.
- Home: Music,Memories,Blessings,Granny,United,Journey,Shuffle,Tile. Individual games inside matching rooms. Approved Shuffle people/card-playing artwork preserved; oversized entrance/game artwork sizing repaired.
- Bridge/music: individual light icon-and-label backings, no duplicate symbols, corrected scrolling, Room/Volume thenChat thenMyGames, player opens jukebox, digital reader, Add/Edit/Share, independent listener playback. Nashville Roadhouse photo framed with uncropped viewer. Exact reported Invite obstruction remains unidentified.
- Music929selections: original907 plus18St.Peter public-domain hymns,2HMG CC BY4.0 songs and2Incompetech CC BY4.0 instrumentals. Traditional Hymns18, Sunday Best117, Contemporary Christian2, Family & Kids4, Family Instrumentals2. Exact selected/current audio sources and elapsed playback checked for additions; both new instrumentals verified inside Ohana with visible source/license credits. These are not a full-library clean certification. See OHANA-FAMILY-INSTRUMENTALS.md and OHANA-HYMNS-BATCH-TWO.md.
- Navigation: native-dialog Back dedupe, Prayer/Color/Puzzle/game/Granny route history, Home restoration. Responsive Chrome checks passed. Physical Android/iPhone Back still requires confirmation; browser Home boundary is not trapped.
- Cards: mobile ranks, hand arrangement gestures, compact HandFoot layout and landscape repairs. Opponent far-side cards face their owner; own cards/names/labels/controls upright. Actual HandFoot rows checked; Ohana10 backs checked; Spades actual trick-renderer fixture checked, but live table was bidding with no trick cards. See OHANA-CARD-SEAT-FACING.md.
- Black threes: always0; pure final-stage meld after required books, leave one final discard; discard pickup blocked by black3. Red-three new scoring NOT live.
-72hour reminders: hourly cron0 * * * *; friendly opt-in waiting multiplayer turns; deduped activity period, no forced notifications. First scheduled invocation2026-10-17T03:00:01Z Success. Not proof of individual delivery. See OHANA-72-HOUR-REMINDER.md.
- Tara Android auto-advance was explicitly resolved by user. Do not reopen that investigation.

## Unfinished and next actions

1. Timed silences/profanity: PRIVATE, NOT in normal player. Explicit opt-in draft, manual exact-recording ranges only, no automatic detector. All929production tracks unmapped/unverified. Synthetic browser checks proved status update and native-volume diagnostics while generated tone played, not audible suppression. Known iOS marked playback refused; background marked playback pauses; timer throttling can leak audio. No whole-library clean claim. Read OHANA-TIMING-STATUS-RETEST.md. Local draft work/music-timed-silence/; API binding work/timed-cue-source-binding/. Exact929source map and22external recordings passed SQLite tests. Next requires audible/physical device tests and deliberate real opt-in integration, not more promotion of synthetic tests as a feature.
2. Music expansion: still need suitable Christian country, kids vocals and spoken comedy. Country source had restrictive reuse terms; LibriVox media redirected to a Chrome-blocked host. Do not bypass or add as verified. See OHANA-FAMILY-CATALOG-RESEARCH.md. Daystar is held because Ohana auto-skipped it despite source playback; do not re-add as verified.
3. Red-three scoring: agreed+100each only after opening meld; four=1000total; caught in hand/unopened foot=-300each. Need eight-card choice:2000pergroups-of-four versus1400onebonus+extras. Asynchronous question already asked, no answer yet. Do not invent/repeat unnecessarily. Full red-three cards by owner/foot already live.
4. Physical iPhone/iPad/Android/Safari audit: touch reordering, pinch/pan, pull-to-refresh, signup visibility and Back/menus still not certified by responsive Chrome. User's intermittent phone Loading report later resolved by user; cause unknown, do not claim a loading repair.
5. Background audio: ordinary singleton audio persists between rooms; source has no ordinary hidden-page pause. Lock-screen/Bluetooth/battery behavior and OS force-close require physical testing. Optional MediaSession adapter is a private source-tested draft, NOT live; browser/native-device verification pending. See OHANA-MEDIA-SESSION-DRAFT.md. See OHANA-BACKGROUND-AUDIO-CHECK.md.
6. Identify exact Invite panel reported behind cardinal. Outgoing chooser previously fit; no invite sent in tests. Do not call all Invite paths repaired.
7. Final full gameplay/device audit remains incomplete; never certify whole site from startup/UI checks. YouTube/corner-TV and original-owned-video audio conversion remain future unbuilt work; check current provider rules before implementation.
8. Outfits only after ALL other chores are completed, published and verified.

## Mandatory working constraints

NEVER change PuzzleRoom Durable Object implementation/storage/bindings/exports/lifecycle. Preserve approved designs; no unsolicited redesigns, generic blue-and-white panels or duplicate Home controls. No messages/invites/forced notifications during tests. No gameplay moves/bids merely to produce a visual state.

Local preview networking denied. Do not retry localhost/file/data-page/alternate-port/proxy/CDP routes or enable Cloudflare preview URLs/security settings. Public same-site explicitly gated synthetic canaries have been used without family data/API writes; remove when evidence saved. Do not bypass blocked media hosts.

Use GitHub connector with fresh main lease, exact baseline guards and reversible scoped changes. Hosting success plus fresh normal public startup/UI proof required before calling live. Canonical copies update only after verification. Old full candidates/builders/patch manifests are stale; regenerate deliberately against current baseline. No physical-device claims from responsive Chrome.

Every15minutes review finished work and publish only verified items. Notify only meaningful completion/failure/necessary action; keep quiet when unchanged. Never claim workers are busy without checking. Preserve concise current state here and link evidence instead of repeatedly prepending full histories.

