# Ohana Memories: easy add, edit, delete and albums (Nov 25 2026)

Not live yet. Goes live only after the owner says Yes.

## What changes for him
- Top bar on /memories: **＋ Add photos**, 📷, **✎ Edit photos**, and album chips (tap to show an album, ＋ New album).
- **Add sheet:** big previews with check marks. Only checked photos go in. Photos left over from before, and the same picture twice, come in unchecked. Words per photo or for all. Pick the album. Unchecked leftovers are cleared after adding.
- **✎ on every photo** (book and viewer): change words, date, album, or delete. ‹ › save and go to the next photo.
- **Edit photos:** grid of every photo; tap to pick many; Move to album or Delete.
- **Undo** after every delete and move (12 seconds). Delete only hides, like before.

## Files
- `memories-easy.js`, `memories-easy.css`: the add-on, injected before `</body>` of the live MEMORIES_HTML. Reuses the page's own functions; keeps every live feature.
- `api-routes.js`: `POST /api/memories/photo/:id/edit` (caption, created_at, album) and `/unhide`. Same permission as the old hide route.
- `apply-to-worker.cjs`: patches only worker.js of the newest live worker. Guest/senior memories page is not changed.
- `test-mock.js`: test only (pretend server). Never ship it.

## Release
See `RELEASE-PROMPT-memories-easy.md`. AI HQ handoff: Drive doc 1PbD8A2T32__MKJf6WYGWLcKG-41ROTMmI3bFtPq4vMQ.
