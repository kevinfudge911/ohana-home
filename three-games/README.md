# Chicken Foot real rules, bigger domino deals, Spades 2 people + 2 robots (Nov 18 2026)

Live on Cloudflare worker `ohana-home`:
- **3dbc743d** at 3:22 PM CT (server + client), then **3bad9f6e** at 3:24 PM CT (Chicken Foot board made more compact).
- Built on 931237c8 (dominoes premium tiles).

## What changed
**Server (worker.js)** — `server_patches_final.json` applied to live, then `server-add.js` appended to the end:
- Renamed `dominoInit/dominoPlayable/dominoMove/advanceBot/ohanaCreateReplay` to `...0`; new wrappers with the original names.
- Draw, Block, All Fives deal 12 tiles each for 2-4 players (11 for 5-6, 9 for 7-8). Mexican Train and Double 15 unchanged.
- New Chicken Foot games (state has `chicken:1`): 12|12 engine, six legs first, any double grows a 3-toe chicken foot that must be filled before play goes elsewhere, draw one then pass, 0|0 counts 50. Old Chicken Foot games already in progress keep the old rules.
- Spades `mode="robots2"`: create with `opponent:"bot2"` makes a waiting 2-seat table; when the invited person joins, seats become [creator, Robot, friend, Robot 2] so the two people are partners. Robot turns notify the person if away. Replay re-invites the same friend.

**Client (app.html.gz)** — `client_patches_final.json`, script `ohana-three-games-v1` (same as `client.js`):
- Chicken Foot board shows each leg/toe with its label and open number.
- Start a game > Spades > "One person + 2 robots" picks one partner and sends one invitation.
- Rules help updated for Chicken Foot and All Fives deal size.

Check in the app: `window.ohanaThreeGames.ok === true`.

Repo snapshot of live HTML/worker is older than live. Do not deploy it; apply patches on top of live.
