# Private shared Ohana Journey tabletop candidate

Not published. Frozen repair files are untouched. No real family coloring or chat writes occurred.

## Existing behavior found

Journey saves fills and marker/eraser strokes in member-specific localStorage, with local Undo. The picture library and generated-page history are also device-local. The only server action is the existing explicit JPEG Share to family chat. There is no existing coloring-room transport to extend.

## Bounded implementation staged

- Additive D1 tables: one active coloring page per family room, retained page records, ordered idempotent operation log. No existing tables/data altered.
- Same room membership and deleted-room checks as existing services. Page IDs come from the actual8classic/40buddy-and-adult catalog plus valid deterministic generated seeds; client HTML/SVG is never accepted.
- Existing fill, marker, eraser, color, brush-size and export handlers are reused. A shared canvas appears first when the family has an active picture; existing personal pages remain below it. Selecting those remains personal. Only explicit “Put a fresh copy on the family table” creates a shared picture.
- Personal coloring keys/work are untouched. Shared pending edits use separate member/room/page outbox keys and stable request IDs, with retry. Epoch guards avoid applying late operations/polls to another page.
- Two-second polling shares completed fills/strokes. A stroke in progress remains local until pointer-up; there are no live cursor or presence features.

## Ownership and conflict semantics

All room members contribute. Last server-accepted fill on a region wins; marker/eraser strokes replay in accepted order. Eraser acts on earlier shared ink, consistent with the existing ink-layer eraser.

Undo targets only the member’s latest active fill/stroke after the latest clear. It cannot undo another person’s operation. Replaying the log keeps later other-person fills intact rather than restoring a stale snapshot.

Room owner/admin may choose a fresh shared page or clear everyone’s current picture. Room1 follows existing core management semantics: admin only. Clear retains its explicit confirmation. Switching pictures retains the old page and its operation log; a delayed old stroke saves to that old page. Users already on the old page get a Join new picture action; the page does not change under an active stroke.

These ownership choices are staged for review, not silently deployed. Existing personal Undo/Start over and explicit chat sharing retain their prior behavior.

## Verification/status

Real SQLite API fixture passes: two members merge; same-region fill ordering; retry idempotency; own-only undo preserving another member’s fill; room/page validation; owner-only switch/clear; incremental polling; old page retention and delayed old-page stroke isolation. Results: api-proof.json. App module parses.

**Actual two-browser UI verification is still pending. Do not publish this candidate yet.** Root must start the reachable isolated preview:

`node work/journey-shared-table/server.cjs`

Port8804. Host: `/`; second member: `/?member=2`. Both share an in-memory SQLite table. The private server alone supplies disposable identities and API bridging. Test host choosing a picture/explicit start, guest joining, fill sync both ways, marker/eraser sync, own Undo, reload, pending page switch, and personal-work preservation. No family data is connected.

Production integration later must transplant only the appended client module, new API function/constants and one `/api/coloring/table` route into the latest app/worker, preserving newer releases. Raw private app/worker copies are not a release package. No new artwork is needed.
