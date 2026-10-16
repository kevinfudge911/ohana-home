# Pending header standard repair — NOT READY / NOT PUBLISHED

Latest user request: every screen canonical Ohana Home top-left, actual Ohana room/game name top-right, Home clickable to porch. Bridge approved header must remain unchanged. Tara auto-next investigation stopped at user request.

Base work/final-current-release/app.html (root live d735). Candidate work/header-standard-repair/app.html. Root testserver8846 reads candidate; no production writes or moves.

Concrete findings:
1 Active game render used icon-only Back to games rather than canonical Home; O10 CSS hid h2.
2 Workstation renderer reparented gb-back to bottom dock, so CSS alone cannot fix header.
3 Native proof after bounded dock correction shows gb-back parent game-head, one control at x26/top5; actual type title Ohana Memory at rightx776. Home still has inline width44!important from inherited button decoration, squeezing logo. Last candidate adds explicit128px wordmark flex width and overflow visible but NOT retested. Do not publish as finished.

Prepared bounded changes: canonical existing arrow/wordmark inside gb-back; handler goHomePorch; actual S.sync.types[g.type].name with existing mode label; dock keeps Home in head; scoped header layout CSS and duplicate outer game header suppression. Existing Color/Puzzle/Granny/setup alignment scoped; Bridge untouched. No worker changes.

Apply ONLY after finishing validation:
node work/header-standard-repair/prepare.cjs <latest app>
outputs private app.html and patch.json, preserving source. Then
node work/header-standard-repair/transplant.cjs <latest release app>
uses exact guarded anchors for4 hunks + appendedCSS. It fails if source boundaries changed.

Remaining: resolve inherited44px inline width cleanly (prefer exclude canonical room-home control from old icon decoration instead of observer race); actual native and phone title/Home readable and full Home click returns porch, no duplicate header. No phone test performed (other worker owns viewport). No need to redo unrelated game rules or play any family moves.

Earlier fixes/evidence:
- Automatic+Memory paced fixes root published, normal startup helper relocation verified.
- Home category organization work/home-category-repair/EVIDENCE.md; root published.
- Shared coloring work/journey-shared-table/CONTINUED-EVIDENCE.md, latest-app/latest-worker private. Marker/eraser two-member sync, page switch, join, reload passed. Phone and personal fill roundtrip pending; no publish.
- Coloring packaging work/coloring22-gzip/EVIDENCE.md byte-exact22 SVG gzip saves864185B, actual all22render passed, root published.
