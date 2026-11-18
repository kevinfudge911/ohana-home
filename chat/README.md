# Ohana slim game chat (v1) — live 15ad6ae8, Nov 18 2026 5:42 PM CT

What it is: the game/DM compose card made into one slim flat line like big chat apps.
- Round blue arrow to send (no "Send" word), picture button, GIF button, pill text box that grows.
- GIF tray: 16 built-in animated stickers drawn on canvas and encoded as real GIFs in the browser
  (LOL, Nice play!, Domino!, Your turn, Good game, Oops!, Woo hoo!, Hurry up!, Love you, No way!,
  Hmm..., Too easy, Hi!, Zzz..., Merry CHRISTmas, Happy Thanksgiving) plus "My GIFs" (pick a GIF from the phone).
  No GIF API or key used.
- Pictures: pick or paste; photos shrink to JPEG under the 900k limit, GIFs kept as-is. Shown inline in chat.

How it is wired into the live worker (ohana-home):
1. ohana-slim-chat-v1.html block inserted in the app HTML right after `<!-- OHANA LANDSCAPE END -->`.
2. App HTML: `panel.id='ohana-chat-compose-host';` -> `panel.id='ohana-chat-compose-host';panel.__ohanaTarget=target;`
3. chat-v2/service.mjs image check now allows gif: `(jpeg|png|webp|gif);base64`.

Sends through the normal `/api/chat-v2` send action (scope, text, image, clientId). Tested in a stubbed
frame only (nothing sent to family); first real send from a phone is the final check.
