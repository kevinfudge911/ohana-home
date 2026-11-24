# Live: one chat bubble + GIPHY GIF search (Nov 24 2026, about 1:09 PM CT)

- Cloudflare ohana-home live version: c392bd94 (upload d91357eb, then secret GIPHY_API_KEY added).
- Built on the newest live version at the time: #1378 ebebf434 (Mahjong Surprise v3). Rollback = ebebf434.
- Only worker.js changed (chat-one-bubble/apply-to-worker.cjs). The other 160 modules, bindings, assets and settings were kept.
- worker.js here and live/worker.js = exactly what is live.

Checked live in Kevin's Chrome: bubble by Pe-paw on home and in a Ten game, drag works, tap opens Messenger,
plus tray shows Photo / Camera / GIF from phone / GIF search / Ohana GIFs, real GIPHY search ("thank you" gave 18),
"Powered by GIPHY" under results, a GIF sent to CodexTest showed in the chat.
Not checked: CodexTest replying back (nobody signed in as CodexTest).
