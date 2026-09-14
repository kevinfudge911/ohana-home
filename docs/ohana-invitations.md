# Ohana invitations

The member tab is named Ohana in every room. Each other member has an Invite to game button. The picker offers the sender's waiting tables with available seats and new two-player games across all five game types.

Addressed invitations persist in game_invitations (migration 0004). The recipient sees invitations across their joined rooms in My Game Nook and can accept or decline. Accept switches to the correct room before joining. Existing room visibility rules still apply; this does not create invitation-only games within a room. Push invitations use the recipient's existing notification subscriptions. No one is automatically seated by an invitation.

The API requires the sender to be seated in a waiting game and the recipient to belong to that same room. Duplicate pending sends do not send another push. Started games disappear from the invitation inbox. Joining uses a compare-and-set update so simultaneous joins cannot overwrite players or restart the game.

Verification: tests/private-rooms.cjs covers room isolation, sender authorization, invitation receipt, decline, re-invite and acceptance. tests/ohana-invitations.cjs covers the Ohana label, picker, request and room-before-game acceptance order. /ohana-preview uses fictional members for visual checks and never sends invitations.
