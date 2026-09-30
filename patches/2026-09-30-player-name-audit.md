# Player name and character display audit

Baseline: live Worker 53b48f4a-8897-4697-81f9-a2bf8832b2eb. Repository root app.html is stale; apply this patch to the live baseline, preserving earlier rail, swap, tray and compact warning fixes.

All nine shared game seats now use the approved open name/character/score arrangement, including Mahjong, Memory, Tic Tac Toe, Checkers, Chess and Spades. Names wrap; portraits have no frames. Current profile data takes precedence over game snapshots in shared seats, game lists, history and invitation tables. Display aliases standardize Memaw/Meemaw to Me-Maw and Pe-paw to Pe-Paw; account records and sign-in identifiers are not migrated. Puzzle, member, invitation and message person labels use the same formatting.

All 23 character assets decode from the production bundle. Versioned character URLs refresh cached images. Failed character images are replaced with compact, accessible character emoji; no large browser alt text can spill across the score. No artwork is replaced in the asset bundle.

Validation: actual production CSS/functions exercised in Chromium at widths 390, 961 and 1200 for all nine game types; verified profile precedence, canonical labels, unframed portraits, minimum text size, no horizontal overflow, long names, accessible failed-image fallback, and compilation of all inline scripts. Requests mocked locally; no authenticated live player sessions or game moves used.

Before SHA256: 638e9e4f62fac32fbf88bdbd6c03ae8351f6440c0c35767f1502ab6e343913e0
After SHA256: 8d27bc63a5b3c613b80030643e4fde789b39ad4ff8dd93889452aca003b662d3
