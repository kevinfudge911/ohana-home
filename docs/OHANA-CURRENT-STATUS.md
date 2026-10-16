# Current release checkpoint — October 16

Ready deployment: app 6099743 bytes, blob 1822a9055477588bfd33c23be2165ab8ecd6c475; worker 781217 bytes, blob 4a82cca3152665ea4d8cb2c596f72642243a7772. Includes printed Bible leaves/readable reader, integrated digital jukebox, Bridge ordering/navigation/My Games/guide, gold Journey/setup controls, shared coloring isolation, compact landscape workstation. Combined normal startup, Bible opening, Bridge order passed; individual evidence preserved in work folders. Deployment must be verified before calling live.

Previously confirmed live: 6b42aa7 header, card placement and gestures. Physical Android pinch/pull-refresh needs device confirmation. Remaining: exact covered Invite dialog, physical record-player button polish, red-three scoring choice for eight reds, friendly 72-hour inactivity reminder (not built), member upload sharing defaults, Christian radio, YouTube, timed profanity fades, remaining full-site gameplay/device audit. Tara automatic switching remains resolved by user. Outfits paused. Never change PuzzleRoom Durable Object storage/bindings/lifecycle; preserve bootstrap helper order and compressed assets.

# Ohana Home — current review

Reviewed October 16, 2026. This is a status reconciliation and active audit, not a claim that every game has passed a new end-to-end device test.

## Verified live

Public application matches the last verified repair release: **cc5b759**, 6,149,681 bytes, Git blob `f4356b5017764ed21f2324d0d809f423fb45c856`. GitHub main is **134d84c**, a later handoff/documentation commit with the same application. Home finishes normal signed-in startup.

| Area | Published behavior | Remaining issue or limit |
|---|---|---|
| Home | Music, Memories, Blessings, Granny, United, Journey, Shuffle, Tile; active games inside their matching rooms; Play now at top; duplicate Home label removed | Bible presentation remains unacceptable; consistent room headers and inner-room styling still under repair |
| Bridge | Individual light icon-and-label backing; duplicate legacy icons suppressed; unboxed record-player labels; scroll-reset repair; phone guide | Latest requested order is Player → Room/Volume → Chat → Games/tools. Reported Home/Invite failures are being audited |
| Music | Digital song banks, search, filters, playlists, shuffle, independent playback, owner edits and visible Share | Redundant title/overlap and clipped cardinal caption need repair. Radio and YouTube are not implemented. Current contribution source support is limited |
| Sharing | Owner Share for songs/playlists: Only me, everyone in Ohana, selected people; recipient cannot edit; private tracks retain protection | User wants their own new uploads shared broadly; per-member default is not yet implemented. No bulk privacy change was made |
| Hand and Foot | Original card faces, compact arrangement, score below names; rank positions restored; black threes always zero with legal final-stage meld | Pull-refresh/zoom/reorder, red-three placement, discard count, and book labels have further unpublished patches |
| Automatic next game | Earlier repairs live; Tara's Android is working by the user's explicit confirmation | Investigation closed. Do not reopen or change it without new evidence |
| Memory | Two-card reveal pacing and rapid second-tap repair live | Older wrong-position report was not reproduced; separate child-friendly visual redesign remains pending |
| Dominoes | Large-hand scrolling repair live | No new full match completed in this audit. Draw Dominoes scores at round end; do not invent a hand-size cap |
| Memories | Album spacing/full-original display/page-turn repairs live; fresh audit opens album and loads photos | Native Home-left/title-right header measured correctly. Physical device/rotation audit remains |
| Beach games | Chess sand styling and Tic-Tac-Toe shoreline corrections previously published | Full portrait/landscape regression review still required. Checkers in sand remains later work |
| Rules and updates | Game-type-wide introduction opt-out, illustrated guides, section update cards live | Guide accuracy and header/control consistency must be checked as screens change |

## Active unpublished work

1. **Touch controls:** suppress root pull-to-refresh without blocking native zoom. Hold briefly then slide to rearrange HF/Ohana 10 cards; quick swipe scrolls, a second finger cancels dragging for pinch. Logic tests pass; actual browser checks are underway. Real Android gesture confirmation remains necessary.
2. **Headers:** one readable Ohana Home at upper left and current Ohana room/game title at upper right. A legacy routine moving Home into the bottom dock was found. The updated game control avoids old icon-only sizing. Native Memory and Journey checks passed; remaining screens are being reviewed.
3. **Hand and Foot visual repair:** full red-three cards near the owner's foot, count directly below discard, Clean/Dirty labels attached to neat card stacks. Phone-size visual and card-selection checks passed. Final combined review is underway. Opponent red threes must stay on the opponent's side; fixture names must not imply duplicate ownership.
4. **Bridge/Music/Journey audit:** latest Bridge order; Home/Invite action behavior; redundant music wording and clipped caption; inconsistent blue/white box controls inside Journey. Findings and bounded fixes remain separate until verified.

## Not finished

- **Bible:** research and verse verification are saved, but a convincing printed-page design is not implemented. Preserve approved book/table art; correct scripture typography, page margins, perspective and clipping. No fake filler or silent translation change.
- **Red-three scoring:** desired +100 after opening meld, four worth 1,000 for each eligible player, caught hand/foot −300 each. Eight-red-three treatment is still undecided. Black-three rules are already live; do not confuse the two.
- **Shared coloring:** two-member synchronization tests passed; final phone layout and personal-fill persistence remain.
- **Profanity fading:** prototype exists; accurate word timings and final integration are missing. Songs are not automatically cleaned today.
- **Christian radio/music expansion:** sources were identified, including worship, old hymns and Christian country. Supported/authorized playback and integration remain. A station website is not automatically an authorized in-app stream.
- **YouTube:** no implementation or channel connection. A visible player or pause-on-leave choice remains; hidden YouTube audio is not supported. Converting original video files owned by members is saved for another day.
- **Later:** Checkers sand appearance, Memory visual refresh, smaller landscape workstation, full game/device/rotation audit, removal of redundant processing narration. Outfits alone remain paused.

## Release and continuation rules

Publish verified finished repairs promptly. Keep unfinished candidates out. Check normal startup, exact public version and actual screen behavior; a pushed commit is not proof of a working release. Preserve the early turn-helper startup fix and lossless coloring compression/hosting margin. Never alter PuzzleRoom Durable Object storage, bindings, SQLite exports, migrations or lifecycle. Never play family moves or send invitations/messages merely to test.

The account reset was verified at 0% used, with two resets left at that moment. The user selected Medium reasoning; the active setting cannot be directly verified from the available tools. Continue efficiently without duplicate research.

Canonical continuation: `docs/OHANA-MASTER-HANDOFF.md` in GitHub. Guarded pending patches are under `handoff/2026-10-16/work`. Local canonical application is `work/final-current-release/app.html`; old fixture/candidate whole files must not replace it.

## Finished follow-up release record

The application accompanying this report is 6,158,495 bytes, Git blob `d4def021c2af1fbb9580d99f52c505c42dc9ac5e`. It includes the tested shared header, Hand and Foot placement, and card-gesture repairs listed above. Public deployment must be verified before describing those follow-ups as live. Bridge/Music, Journey styling and Bible prototypes are separate and still under review.
