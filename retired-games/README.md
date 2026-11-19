# Retired games: Mahjong (live ae90cb7f, Nov 19 2026)

- Server (worker.js): `RETIRED_GAMES=["mahjong"]` and `retiredGameCheck(type)` placed before `allowGame`.
  Called in /api/game/create, the replay ("play again") path and group invitation batches.
  New Mahjong tables are refused with "Ohana Mahjong is retired now. Games already going can still finish."
  Games already going are untouched (moves, viewing, finishing all work).
- App: hides the Mahjong setup card and drops Mahjong from the category sign text; adds a quiet
  "Retired games: Ohana Mahjong · N games still finishing" line where the card was.
- Active Mahjong games stay on the home list until they finish, then drop off on their own.
- Nothing deleted: Mahjong code and saved games are kept. To bring it back, empty RETIRED_GAMES and the app list.
