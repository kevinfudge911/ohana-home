# Missing Logan family-photo puzzle — prior record clues

2026-10-17. User identifies the nearly completed **Logan family photograph**, in **Ohana Home**, as missing from the Puzzle Room list. This is the current user report, not a recovered saved-row inspection.

## Exact prior evidence

1. `outputs/ohana-published-2026-10-15.txt`, line7: signed-in post-deployment browser verification loaded the existing shared Journey puzzle at **604 of992pieces**, with **Pe-paw310placed**. After returning Home the note records **Logan Family61%together**. It explicitly says no piece was moved. The surrounding report ties this check to successful deployment9c736cd / active version59b23ea8, not current saved state.
2. `work/journey-character/README.txt`, Reference evidence: the signed-in browser's **Logan Family** puzzle Preview showed the child the user identified as Journey (aqua floral dress/yellow ruffles, plush animal). Original was exported through pageAssets without moving puzzle pieces. Private reference remains `work/journey-character/journey-family-reference.jpg` (161527B). Do not publish that private working reference as a new public site asset or use it to recreate/reset the puzzle.
3. This agent's earlier actual live DOM snapshots in the conversation (music audit2026-10-16, before today) recorded the Home entrance **Ohana United → Logan Family →90%together →3helping**. This is a recorded tool-output clue, not a separate JSON saved row. It is consistent with later progress beyond61%, but does not establish today's status or a numeric ID.

## Identifiers still unknown

- **Production puzzle ID: not found** in bounded saved notes/metadata search.
- **Numeric room ID from an actual puzzle row: not found.** User explicitly says Ohana Home; app's main-room convention is1, but do not convert that convention into a verified saved-row room_id.
- Current status, exact last locked count, completed/archived/deleted flag, retained pieces/DO state: **not inspected**.
- The JPEG contains no `/api/puzzle/<id>` metadata clue.

## Important exclusions

- `/api/puzzle/1` in local-browser-server and related fixtures is synthetic test data, **not evidence the live Logan puzzle is1**.
- `outputs/ohana-full-audit-2026-10-15.txt` line22 identifies **Supermom992** as a different legacy album image (`/api/album/3/image`), plus Fall album7/babies album6. Those album IDs must not be assigned to Logan Family.
- No evidence here proves deletion, completion, automatic archiving, loss or recovery. A saved reference photograph does not restore piece placement and is not a reason to recreate it.

## Search scope / safety

Bounded local text search of outputs/work notes, JSON/text metadata, selected fixture source and the private reference JPEG metadata only; large artwork/catalog/source blobs excluded except focused filename checks. No live endpoint called, especially no GET `/api/puzzles` (it may archive completed puzzles). No browser, DO call, backend/storage mutation, reset, recreation, or real move performed.

Next authorized investigation can use an actually read-only saved-row lookup for name **Logan Family** and user-specified **Ohana Home**, retaining ID/status/count/image identity and checking Memories association, without invoking archive-capable list/summary lifecycle or changing puzzle state. Access is currently unavailable; do not claim live recovery.

