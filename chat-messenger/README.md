# Messenger-style chat (live as Cloudflare version 72d855af, Nov 19 2026 ~9:05 AM CT)

What it is
- Full-screen chat like Facebook Messenger. "Chats" home lists every person, group and room chat with picture, last message, time and unread count.
- Tap a person once: the conversation opens. Bubbles both ways (mine blue on the right, theirs on the left with face and name in groups).
- Typing bar always at the bottom: + (Photo, GIF from phone, 16 animated Ohana GIF stickers), message box, send arrow.
- Polls every 4 s while a chat is open; list every 12 s. Marks read on open. Failed sends turn red, tap to retry.
- Top sign chat emblem (#chat-head, shows the red unread number) now opens Chats. "Tools" link in the Chats header still opens the old Ohana Bridge tools.
- In any game: a small round chat bubble sits just above your player dock, pulses with a red count when a new message comes in, one tap opens the chat.

How it hooks in (no old code removed)
- Inserted right after `<!-- OHANA SLIM CHAT END -->` in app.html (block = messenger-insert.html).
- Replaces the globals openChatInbox (except tools mode and game keys), openMemberDM and openGameSay (lobby only; in-game say keeps the old popup).
- History: GET /api/chat?conversation=KEY. Send: POST /api/chat-v2 with scope direct (people:a,b), people (groups), room (room:N).
- Uses window.ohanaSlimChat (slim chat block) for GIF stickers and picture shrinking.

Also in this deploy
- Hand and Foot: red threes 100 each; 4 or more in one hand = 1,000 (+100 per extra). worker.js hfScoreHand. Rules text updated.

Tested live with test unit CodexTest (10042): typed + sent a text and a GIF to Pe-paw; both showed on Pe-paw's side.
