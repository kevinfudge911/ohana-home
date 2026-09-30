# Ohana Home rail readability and Words swap fix

This patch targets the current Cloudflare deployment, not the older root app.html in this repository. Do not deploy the older root Worker over the live application.

Changes: doubles shared rail action/label text, wraps controls, observes rail height for hand clearance, and preserves the centered player and bottom-left settings. Words Swap supports multiple selected rack indices with visible selection count, deselection, Cancel, retained selection on failure, and one exchange request. Tile drag/reordering is disabled while swapping.

Validation: Chromium touch and keyboard multi-select, duplicate A tiles and blank, deselect, cancel, failed request/retry; unchanged production wordsMove engine replaces exactly three selected letters, preserves seven-tile rack and bag count, and advances the turn. Rail checked at 360, 390, 430, 650, 800 and 1200 pixels, plus shared rail mounting for all nine game types. Only the app HTML module changes; backend and assets remain byte-identical.

Base live version: 255bf6f2-b5f9-46a4-9fc4-9e1ba10259ac
Base HTML SHA256: 64ab6d4434df508709ad9de93b0932ef60dc823207b2b3e6f1ca50067b90134c
Updated HTML SHA256: dde770155740949617514c212f01d333cb20ec9740d436c1726624a002454648
