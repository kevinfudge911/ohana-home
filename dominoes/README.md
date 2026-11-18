# OhanO DominO premium tiles + Words-style board (Nov 18 2026)

Live on Cloudflare worker `ohana-home` as version **931237c8** (deployed 3:11 PM CT, Nov 18 2026), on top of fe5a302c.

## What it does
- Board panel framed like Ohana Words: lavender border, purple drop shadow, wood-gold frame, harvest scenery with a soft grid (Thanksgiving), sage grid otherwise. Garland stays on top.
- Tiles are ivory/bone slabs: grain, bevel, thick edge, brass center pin, engraved divider, gold edge on doubles.
- Pips are inlaid enamel with a carved well and gloss, one cached image per value (keeps the board light).
- New tile lands with a little drop + shine sweep and a soft clack (skipped when muted or when the game's own drop sound just played).
- Speed: board went from about 3,367 elements to 286; board restyle about 4x faster.

## How it is applied
`insert.html` is inserted right after the marker `<!-- DADDY CARDINAL SONGS + GAME FLYER END -->` inside the gzipped app part (`*app.html.gz`).
sha256 of insert.html: 6e533f17df75dd50dae8590f16cbdcc313adbb04db6934049033f22eb1127bd4

`dmx.css` and `dmx.js` are the same code, split out for reading.

## Important: repo snapshot vs live
The `live/*-app.html` snapshot in this repo is OLDER than the real live app (live is about 1.6 MB bigger, with other AIs' Thanksgiving work).
Do not deploy that snapshot. Always pull the live gz part from Cloudflare and apply patches/add-ons (like this folder and `cardinal/`) on top of it.
