# Freestanding characters outside games

Explicit user instruction: everywhere outside games characters stand freely with plain names underneath. No circles, portrait backgrounds, borders, boxes or framed nameplates. Preserve in-game layout, actual character selections and artwork.

Adds scoped CSS for home family seats and own seat, shared portraits, names and avatar wrappers. Every selector excludes #game descendants. Browser checks at widths 390, 961 and 1200 assert no portrait/nameplate background, border or shadow, names below portraits, and complete computed-style equality for tested in-game portrait/nameplate/image elements before and after.

Baseline a81ab205-ce14-4ac0-9c75-a72c15deb718; published 1d0f538b-0511-4fb2-9122-89fb00f3b98b. Retains binary asset packaging fix: upload WebP and PNG modules as application/octet-stream, NEVER downloaded multipart text/plain. Root repository app.html is older than production; use live baseline.
