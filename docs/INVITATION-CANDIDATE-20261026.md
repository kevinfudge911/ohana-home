# Invitation candidate — source phase

Base: fresh remote main `befbc9abc7cc197f7567ae48862aa46ced6f5b4c`.
Configured sources are `live/worker.js` and the hashed `live/*-app.html`;
root historical files remain unchanged.

## Behavior and explicit decisions

- Individual invitations create one waiting, two-person table per selected person.
- Group invitations create one waiting table for the host and the chosen people.
  Server game limits apply, including four-person Spades and two-person Gin.
- “Already playing” means both humans share a waiting or playing table of the
  selected game type in the current room. Variants of a type count together.
  Pending invitations either way also exclude that person until the existing
  two-day expiry. Finished games, other types and other rooms do not exclude them.
- Bulk selection applies to individual mode; group members are deliberately chosen
  within the game's limits. Individual sends have an explicit limit of 100 people.
- Parent-managed games, hidden CodexTest filtering, positive human IDs and room
  membership remain enforced. Solo-only games cannot receive invitations.
- New sends use new tables. The obsolete member/table dropdown pickers route to the
  current composer. Existing waiting-table per-person invite controls remain.
  Invitations retain room visibility and acceptance rules; they do not reserve seats
  or automatically seat recipients. Robots/solo retain their existing practice flow.
- Send remains explicit and the mode/game/recipients are summarized beforehand.
  Success leaves the same composer and history token open, clears sent choices,
  refreshes eligibility, and preserves useful mode/game context.
- Unknown failures lock the exact send for a same-ID retry. Server transaction
  receipts prevent duplicate games/pushes on double-click, lost responses and
  concurrent retries. Known rejection leaves editable current UI. Closing never
  cancels an already submitted request, and late work never opens a screen.
- Sender and recipient managed-game policy values are read together and checked
  again inside the atomic send guard. A parent's change before commit rejects
  the entire send. A receipt from a completed send remains confirmable even if
  the policy changes afterward.
- Database failures around the transaction or receipt confirmation return HTTP
  503, retaining the exact request ID for retry across Cancel/reopen. A clean
  commit takes its game IDs from the transaction result, avoiding a follow-up
  confirmation read. Replays read all game IDs in one query.
- A 100-person fictional send uses 11 D1 reads, including one subscription
  lookup, plus one atomic batch; every statement stays within 100 bindings.
  Cloudflare documents a 50-query Free invocation limit and counts `db.batch`
  as one query: https://developers.cloudflare.com/d1/platform/limits/ .
  Device push remains best effort after the invitations commit. A room with
  many subscribed devices may hit the separate Workers Free subrequest or
  `waitUntil()` duration limits; the production plan and push completion for
  a 100-person send have not been verified.
- Overlay close goes through the existing native/history lifecycle. The old
  dropdown UI was removed at its source. Automatic incoming-invite presentation
  waits while the current composer is active. Back/Forward cannot restore its old
  DOM. No unrelated navigation, game engine or artwork is modified.

## Review and integration requirements

Migration `0005_invitation_batches.sql` adds receipt storage only. It has NOT been
applied anywhere. Deployment requires the schema to exist before using the new
endpoint. There is no runtime permission or family data migration.

Tests use in-memory SQLite and fictional DOM/API fixtures. Generate the offline fixture with
`node tools/invitation-fixture.cjs [absolute-output.html]`. It extracts the actual
configured composer, styles and overlay code, and uses a restrictive CSP and API
stub; it cannot send real invitations or make game moves. The fixture has lost,
malformed-success, rejected and delayed fictional response controls.

A fictional browser pass verified selection, modes, success in the current
composer, rejection, retry through reopen, Back/Forward and portrait/landscape
scrolling. It found first-column checkboxes flush against the dialog edge on
phone/tablet and the text "1 separate games". Labels now have a 10px inset,
and one recipient says "1 separate game". Focused DOM checks cover computed
padding, touch-sized hitbox and singular wording. A browser render retest of
these two small fixes and the malformed-response control is pending.

Completed checks: `invitation-batches.cjs`, `invitation-composer.cjs`,
`invitation-preservation.cjs`, `direct-play-routing.cjs` (87 checks),
`private-rooms.cjs`, `session-preservation.cjs`, and legacy
`ohana-invitations.cjs` pass. The configured production
`spades-bot-api.cjs` also passed 13,274 synthetic checks with zero real requests.
Wrangler's configured `deploy --dry-run` succeeds, and Git whitespace checking
passes. No migration, deployment or upload is part of those checks.

Screenshot `libfile_923207544028819190762afe79310eff` remains uninspected: current
Library resolved-reference materialization was attempted into the consumer's local
workspace. Sandboxed download failed. One supported local retry downloaded bytes
but the unchanged helper failed applying attributes because Windows Python lacks
`os.setxattr`; no final local file remained. No guessed URL/alternate transfer was
used. Pixel comparison therefore remains a blocker for the browser/review phase.

`direct-play-routing.cjs` now compares against this candidate's fresh main and
allows only the reviewed invitation CSS block alongside its historical
TEN/Bridge/Rummy exceptions. Its navigation, handler and other-style checks
pass. `invitation-preservation.cjs` independently verifies the configured app
and worker against that same baseline. These are local fixtures, not browser QA.

No real invitation, real family game move, upload, external announcement,
production push/deploy or permission change occurred in this phase. The
fictional browser tab and local server were closed after the pass.
