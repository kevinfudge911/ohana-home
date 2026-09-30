# Compact Ohana warnings

Replaces browser-native confirmations with small themed, accessible dialogs. Next game, Pass and Quit have explicit action labels. Escape, outside tap and Cancel preserve the current action. Duplicate prompts and approval after a game change are rejected. The board remains visible without backdrop blur. Play error cards use matching compact sizing.

Patch targets live version `47dac3d7-856d-4620-ae1f-8a2091802ff0`, after the readable rail, letter swap and puzzle tray fixes. Root app.html in this repository is older than production; apply this patch to the live baseline rather than deploying the stale root files.

Validation: all inline scripts compile. Browser checks at widths 390, 961 and 1200 cover size, focus, cancel, Escape, outside tap, acceptance, duplicate prompt, stale game guard and safe text rendering. No native confirm calls remain. Tests use extracted production functions and CSS with mocked game requests; live authenticated gameplay was not exercised.

SHA256 before: `fcfe1b982cd5956229da3c727259a505613e2fdfa5d9fc567bc0073cd09ff630`

SHA256 after: `638e9e4f62fac32fbf88bdbd6c03ae8351f6440c0c35767f1502ab6e343913e0`
