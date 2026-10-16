# Porch worker handoff — 2026-10-16

STOPPED at root/user1%usage request. No further browser/research. Parent owns publishing/current live status.

## Exact latest source inspected

`work/final-current-release/app.html` 6,149,681 bytes. Includes previously merged HF rank repair, compact layout, shared card-face helper, score-under-name, black-three rules and other parent changes. Do not overwrite it from any older private full app.

## Ready pending gesture patch (not published by this worker)

Directory `work/card-native-gesture-repair/`.

- `app.html`: private full candidate based on exact6,149,681 source.
- `patch.json`: bounded replacements plus appended CSS.
- `transplant.cjs`: `node work/card-native-gesture-repair/transplant.cjs LATEST_APP OUTPUT_APP`.
- `check.cjs`: PASS both HF `data-cid` and O10 `data-o10-card`: quickswipe stays native;350ms hold then slide forwards reorder; secondfinger cancels reorder without preventDefault; exact inverse restores base.25scripts parse.
- `README.txt`: rationale/tradeoffs.
- `server.cjs`: optional root-startable preview `node work/card-native-gesture-repair/server.cjs work/card-native-gesture-repair PORT`.

Root body already had overscroll:none; document html root did not. Patch adds root overscroll-y:none and appcontain without disabling nativepan/pinch. Prior data-cid touch bypass was HF-only; O10 uses data-o10-card, so not directly disabled by that predicate. Shared old pointer/nativegesture conflict remained. New explicit touchlongpress path intends to restore touch reorder while preserving quickscroll/twofingerpinch; mouse/Alt unchanged. Actual Android multitouch remains UNVERIFIED; do not claim physical fix from unit/CSS tests. No browser test of this newest gesture candidate was performed before stop.

## Latest user visual requests — NOT implemented

1. Replace tiny own red-three square labels with FULL actual red-three cards. Move stack beside OWN face-down foot, bottomright near hand, visible label `Red threes`, retain owner/count and existing red scoring.
2. Discard count must sit directly below discard, aligned to its card (currently slips below a line).
3. Clean/Dirty labels must remain attached to their individual realistic overlapped book stacks, not detached text.
4. User requested actual390 visual proof. No new visual candidate was built; only source inspection completed.

Relevant current locations:

- Own red renderer around14134: `.hf-owned-red-threes` uses tiny `.hf-owner-red-card` spans.
- Own red grid placement around16831 spans fullwidth row2; foot is column2,row3.
- `renderPile` around14110–14120 emits `.hf-book-word` sibling before `.hf-public-cards`.
- Older book CSS5127–5128/5311–5314 uses absolute overlapped card stack and order1 label; later compact CSS16840 shrinks card dimensions, potentially separating labels.
- Discard count is `.hf-discard-stack>small`; draw/discard parent `.world-hand>.hf-decks`.

Suggested bounded follow-up only (not applied): use same `hfCardShape`+`hfPlayingCardFace` for full collected red cards; place beside foot in ownhand grid; explicit discard flex-column/count alignment; book parent inline-flex column and label gap2 with stack measured to actual card size. Do not add scoring or new artwork.

## Earlier tested ready artifacts

- `work/hf-rank-pan-repair/`: rank clipping fixed by restoring original25%hand/23%foot rank position,18px font. Actual390 screenshot `ranks-phone390.png` visually8/9/10/A/K intact; tap9 showed10points. Touch nativepan bypass tradeoff was already superseded by newest pending longpress patch above. Root merged/published according to parent; use parent live record.
- `work/hf-black-only/`: tested isolated black-only engine/client patch.10casegroups PASS, old red scoring explicitly unchanged. Parent owns merge/publication. Full house-rule version remains private and includes unresolved red>4/unopened-setaside assumptions; NEVER blindly apply it.
- `work/hf-compact-layout/`: layout only, originalactual renderer shared with examples, ownfoot bottomright, draw/discard abovehand, opponent opposite;390hand11cards reduced304→204px; score below name actualphone verified. Parent merged; do not reapply onto current source.
- `work/domino-rack-scroll/`:35tile scroll fix, native/390/landscape reach first/last, originalengine untouched. Root merged; do not reapply blindly.
- `work/bible-research-2026-10-16/`: all11 existing NKJV strings manually checked against BibleGateway; URLs/hashes in verse-checks.json, no scripture/code edits. Recommendation preserves approved book/table art and authentic text; no fake filler. No further research needed.

## Important safety/ownership notes

No publishing was performed by this worker. Never deploy fixture server files, debug/privateSQLite data, original family-photo screenshots or `hf-combined-private/app.html` (contains fixture-only reconnect hide/debug). Use guarded transplants against latest source, preserve parent startup fix/music/Bridge/Home. No new artwork generated by this worker in current phase.
