# Latest verified checkpoint — friendly72-hour reminders

Release d3b43e03559006c88aeb10cd32a6239e61abee1c is deployed successfully. Worker blobd801db4e65e0b64f67314acd0bc797c0aa0e3211,784943 bytes. App unchanged: blob285db680a3a80e33c929423d028a2af6a46819fd,6284113 bytes,914 tracks. Canonical files: work/final-current-release/app.html and worker.js.

The old24-hour per-game reminder is replaced by the requested gentle72-hour message, one attempt per member per inactivity period. Human moves reset the timer. Only opted-in members with a still-waiting human multiplayer turn and room membership qualify; bot-game reminder exclusion is preserved. Legacy accounts seed their initial timestamp once from last known visit/creation. Delivery is best effort, not guaranteed receipt.

Fifteen actual SQLite scenarios pass, including repeat/concurrent checks, multiple games, timer resets, committed-move races, opt-out, room removal and delivery failures. Independent review found no release-blocking defect. All worker bytes outside the reminder module, scheduled handler and successful-human-move activity hook remain identical. PuzzleRoom code/storage/bindings/lifecycle are untouched.

Cloudflare production Settings visibly confirms Every hour, next run2026-10-17T03:00:00Z. Live Home finishes loading; sampled browser error logs are empty. No forced production notifications or game moves were sent. Actual scheduled execution and physical phone receipt remain unobserved. Evidence: work/game-inactivity-reminder/live-hourly-trigger.png and test.cjs. At a later heartbeat after03:00Z, inspect the observed cron events page /86e18b73222d2807ad14e2e89bcef365/workers/services/cron-events/ohana-home/production in Cloudflare; do not infer delivery from configuration alone.

Still open: Bible printed columns, full Android Back/Home, further Christian country/contemporary/kids/comedy music, timed fades, exact Invite obstruction, red-three scoring question, physical iPhone and remaining full audit. Outfits stay last.

The earlier checkpoint/history follows.

# Friendly 72-hour family-game reminder

Replaces the old24-hour per-game reminder with one reminder attempt per member per inactivity period, once72hours have elapsed. Copy: “Hey, we miss you in Ohana. Your games are waiting.” Successful human game actions advance a per-member timestamp in existing D1 settings. No new table or Durable Object change.

Scope: subscribed members who still belong to a room and currently have a waiting turn in a human multiplayer game. Existing bot-game exclusion is preserved. Playing against Honu still updates activity, so that activity suppresses family reminders. A legacy account without a move timestamp starts once from its last known visit/creation timestamp; past per-member move times cannot be reconstructed reliably.

Wrangler adds one hourly scheduled trigger. Eligibility and opt-in are rechecked in the atomic claim, along with recent committed lastPlay data across active and completed games. Multiple waiting games and overlapping cron runs share one per-member claim. A new successful play creates a new inactivity period. Ordinary visits do not reset the timer after the initial legacy baseline.

Delivery is an at-most-once attempt for each inactivity period. The existing push sender retries transient failures once and removes expired subscriptions. It cannot guarantee receipt; device notification permission, subscription availability and push service delivery still apply. No forced production test notifications are sent. Actual scheduled delivery remains unverified until a real eligible run.

Verification: node test.cjs uses actual in-memory SQLite and mocked push delivery.15 scenarios cover72h boundary, ten waiting games, repeated/concurrent cron, timer reset, older activity writes, activity and committed-move races, finished games, seat changes, room removal, opt-out, legacy baseline, malformed games, delivery failures and independent recipients. check-preservation.cjs confirms all worker bytes outside the reminder module, scheduled handler and successful-human-move hook remain unchanged. node --check passes. No UI/artwork/app HTML changes.

Before calling the release live: verify hosting build, public normal startup and configured hourly trigger. Do not claim physical-device receipt from unit tests.

