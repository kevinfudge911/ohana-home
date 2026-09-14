# Ohana Home invitations

The main family room previously had no invitation code and the public room invitation endpoint explicitly excluded room 1. Flower and other private rooms already had links.

- Rooms shows Invite to Ohana for room 1, including before its first link is created.
- The Ohana member list has an invitation action for its current room.
- POST /api/rooms/invite checks current-room membership, then creates a stable code only if one is missing. No membership or session changes occur when requesting a link.
- The existing room invitation join flow now accepts room 1. Guests join only the invited room, receive no admin privileges, and existing users keep their tokens.
- Main-family admins can replace the family invitation. Private-room rotation remains owner-only. Replacing a link does not remove existing members.
- Sharing opens the device share sheet or copies the room link; it does not send invitations automatically.

Verification: private-rooms API tests cover ordinary-member link creation, private-only guest rejection, stable codes, family signup isolation, no admin grant, session preservation, and invitation rotation. UI tests verify the family button with no code, the room-1 request, copied link, and existing room switching behavior. Session-preservation tests pass.
