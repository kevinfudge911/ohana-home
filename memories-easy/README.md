# Ohana Memories: clean album and sharp photos (Nov 25 2026)

Not live yet. Goes live only after the owner says Yes.

## What he sees
- Only the book and the photos. Nothing under the book (no Back/Next, no pickers, no buttons).
- The album name sits above the book with a small gold arrow. Tap it for the album list: All memories, Unfiled photos, each album, then New album, Pick photos, Share, Journey memories, Refresh and Help. Family rooms are listed at the top when there's more than one.
- Small leather tabs on the book's left and right edges turn the page. Swiping and the arrow keys turn it too. A tab hides when there's no page that way.
- Tap a photo to see it big. Hold a photo about half a second to change it (words, date, album, delete). Works in the book, the big view and Pick photos.
- One small camera with a plus by the book's lower corner adds photos. It asks Camera or Photos, because Chrome on newer Android phones hides the camera inside the photo picker. A gold number shows if photos are waiting.
- Big view: close, back and forward arrows, photo number, and small heart, share, open larger and save marks in one row. Reactions and comments sit under the photo.
- Under each photo in the book: a small line with its reactions and comment count. Tap it to react or comment.

## Every old feature, where it lives now
- Family room switch, New album, Share album: album name menu.
- Journey memories, Refresh, Help: album name menu.
- Copy album link and Install: inside Help.
- Reactions and comments: small line under each photo, full row in the big view.
- Take a photo: camera, then Camera.

## Photo quality
- New photos keep a full-size copy (up to 4096 px, JPEG 95) in R2 (`memories/original/<room>/<id>.jpg`, binding MUSIC_FILES).
- The album copy is 2560 px at JPEG 92 (up to 1.5 MB, server limit raised to 1.6 MB). The small picture is 640 px.
- Resizing is done in halves with high smoothing, so nothing goes soft.
- The big view swaps in the full-size copy when it has one.
- Older photos stay as they were stored. A few were saved small back then, so they can't get sharper.

## Files (kept as separate sections)
- `memories-easy.js`, `memories-easy.css`: the add-on, injected before `</body>` of the live MEMORIES_HTML.
- `api-routes.js`: edit, unhide and full-size routes (`GET`/`POST /api/memories/photo/:id/original`).
- `apply-to-worker.cjs`: patches only worker.js of the newest live worker.
- `test-mock.js`: test only (pretend server). Never ship it.

## Release
See `RELEASE-PROMPT-memories-easy.md`. AI HQ handoff: Drive doc 1PbD8A2T32__MKJf6WYGWLcKG-41ROTMmI3bFtPq4vMQ.
