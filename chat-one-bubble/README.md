# One chat bubble (Ohana Home)

One chat bubble next to the player's character, replacing the OK pop-up and the other chat pop-ups.
Drag to move (spot saved separately for home and for rooms). Red count of waiting chats.
Tap opens the Messenger chat (straight to the one waiting chat when only one).
Plus tray adds: Camera chip, and GIPHY GIF search ("Powered by GIPHY").

## LIVE Nov 24 2026 about 1:09 PM CT (version c392bd94, rollback ebebf434)
Steps used:
To release, on a machine with Cloudflare access:
1. Download the NEWEST live ohana-home worker.js (do not use an older copy).
2. `node chat-one-bubble/apply-to-worker.cjs <live worker.js> <out worker.js>`
   (adds the bubble add-on to the add-on chain and the `/api/gif` route before `/api/chat-v2`).
3. Upload only worker.js; keep the other modules, bindings and settings.
4. Set secret `GIPHY_API_KEY` on ohana-home (same key as JJ Friends, file "GIPHY-API-KEY — JJ Friends GIF search" in Drive). Free key = 100 searches an hour, shared with JJ Friends. Searches are cached an hour.
5. Check live: bubble by the face on home, by the head in a game, count, drag, plus tray (Photo, Camera, GIF search), send a GIF.

Rollback: previous version (live #1378 ebebf434 when this was built).

## GIF route
GET /api/gif?q=words -> {ok, results:[{id,title,thumb}]} (rating g, 18 results)
GET /api/gif?id=ID -> {ok, image:"data:image/webp;base64,..."} (small webp, under 660 KB, so chat-v2 accepts it)
