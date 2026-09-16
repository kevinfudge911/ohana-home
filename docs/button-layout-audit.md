# Ohana control layout audit — 2026-09-16

- Game header: combined navigation, sound, turn identity and latest word/points into one wrapping region. Removed forced sound-only row and separate turn card.
- Board controls: compact gaps and padding, minimum 44px action height, Next game beside Play word. Rack remains visible during zoom.
- Hand & Foot: reduced duplicate welcome banner; retained card sizes, scores and draw/discard controls.
- Mahjong: compact utility spacing; retain tile sizing and readable scores.
- Settings: wrapping utility groups; device actions sized to their contents; family administration stays collapsed. Profile fields retain editing space.
- Rooms: room actions share rows rather than each taking the entire card width. Private-room permissions and invitations unchanged.
- Ohana: reduced member-row padding; retained direct game invitations and external invitations.
- Game setup: reduced section spacing; retained 44px choices and all modes/difficulties.
- Main navigation: larger, heavier labels and stronger active state; icon and label share a line on wide screens.
- Chat: retain message reading/composing space and emoji access.
- Sign-in: retain readable fields and accessibility help.

Verification: accessibility suite (nine screens), settings organization/profile, Next game routing and post-turn persistence, board/rack/zoom and Hand & Foot selection tests. Browser inspection uses fictional games, never writes to family games.
