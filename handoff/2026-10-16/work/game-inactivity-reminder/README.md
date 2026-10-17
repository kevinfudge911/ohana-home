# Friendly 72-hour family-game reminder

Replaces the old24-hour per-game reminder with one reminder attempt per member per inactivity period, once72hours have elapsed. Copy: “Hey, we miss you in Ohana. Your games are waiting.” Successful human game actions advance a per-member timestamp in existing D1 settings. No new table or Durable Object change.

Scope: subscribed members who still belong to a room and currently have a waiting turn in a human multiplayer game. Existing bot-game exclusion is preserved. Playing against Honu still updates activity, so that activity suppresses family reminders. A legacy account without a move timestamp starts once from its last known visit/creation timestamp; past per-member move times cannot be reconstructed reliably.

Wrangler adds one hourly scheduled trigger. Eligibility and opt-in are rechecked in the atomic claim, along with recent committed lastPlay data across active and completed games. Multiple waiting games and overlapping cron runs share one per-member claim. A new successful play creates a new inactivity period. Ordinary visits do not reset the timer after the initial legacy baseline.

Delivery is an at-most-once attempt for each inactivity period. The existing push sender retries transient failures once and removes expired subscriptions. It cannot guarantee receipt; device notification permission, subscription availability and push service delivery still apply. No forced production test notifications are sent. Actual scheduled delivery remains unverified until a real eligible run.

Verification: node test.cjs uses actual in-memory SQLite and mocked push delivery.15 scenarios cover72h boundary, ten waiting games, repeated/concurrent cron, timer reset, older activity writes, activity and committed-move races, finished games, seat changes, room removal, opt-out, legacy baseline, malformed games, delivery failures and independent recipients. check-preservation.cjs confirms all worker bytes outside the reminder module, scheduled handler and successful-human-move hook remain unchanged. node --check passes. No UI/artwork/app HTML changes.

Before calling the release live: verify hosting build, public normal startup and configured hourly trigger. Do not claim physical-device receipt from unit tests.

