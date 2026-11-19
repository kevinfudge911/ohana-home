# One alert per player (live 2b10e321, Nov 19 2026 12:45 PM CT)

Kevin: one alert per player, even if that player plays 25 games. Never one alert per game.

Before: turn alerts were held to one per player per hour (Nov 18), but "saved you a seat" and replay
invites still sent one push per game, and the hour restarted, so a long run of games still sent several.

Now (worker.js only, built on ef2cd28b):
- All four seat/replay invite pushes carry from:me.id.
- notifyMembers is wrapped: an invite from a player goes through the same play_alerts check as turn alerts,
  with tag ohana-player-<id> so the phone keeps one notice per player.
- ohanaPlayAlertOk now slides: every invite or turn from that player refreshes the clock, so the first one
  alerts and nothing more comes while they keep playing, until they've been quiet for an hour.
- Invites still show in the Game Nook; only the phone buzz is held back. Chat, wins, "says", puzzles unchanged.
- Old functions kept as ohanaPlayAlertOk0 / notifyMembers0. Rollback: ef2cd28b.
- Repo live/worker.js is a stale formatted copy (3 of the 4 invite spots exist there); never deploy it.
