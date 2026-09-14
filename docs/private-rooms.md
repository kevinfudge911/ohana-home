# Private Ohana rooms

Rooms are independent membership scopes within the same app. Existing members, games, and messages migrate to room 1 (the original family). No scores, board states, or identities are rewritten.

Each member can create private rooms and share a 128-bit invitation link. Joining a private-room or private-game invitation adds membership only to that room. Room members can create all existing game types, play with Honu, and use room chat and game chat. The Rooms overview lists active games only from rooms the signed-in person belongs to. Being a family administrator does not grant access to other private rooms.

Server checks enforce room membership for sync, room messages and every direct game action. Game response name maps and chat push recipients are scoped to the game/room. Family administration cannot clear private chats or reset unrelated guest identities. The host can replace the room invitation; existing room memberships remain. Anyone holding a current invitation can join and room members may share invitations, so share links only with intended guests.

Apply migrations/0003_private_rooms.sql exactly once before deploying the room-aware worker. Do not roll back to the old global-sync worker after private room data exists: it does not enforce room isolation.

Verification: tests/private-rooms.cjs runs the actual API handler against in-memory SQLite. tests/private-rooms-ui.cjs checks room navigation and chat state separation using the real frontend. /rooms-preview is a read-only fictional appearance preview, not a live private room.
