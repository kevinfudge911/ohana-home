# TEN viewport and clipping repair

Forward integration of independently reviewed e8c0535 onto the live Bridge/Spades/Mango baseline. TEN uses the available play area between its existing header and fixed workstation. Its initial overview fits the full hand and Draw/Pile labels; enlarging the board retains blank-felt panning and keyboard/focus reachability. Approved cards, opponent count, spacing, title and game rules remain unchanged.

The exact reviewed three-file patch applies and reverses to the complete current source. All unrelated HTML, Worker, assets, bindings and configuration are preserved. Both inline camera copies and the source copies match. Lossless gzip decodes exactly; 33 executable scripts and 483 emitted modules are verified. Fresh regressions passed 199 Bridge context, 71 dispatch, 33 null-context and 18 navigation checks. Independent review passed 334 layout assertions, 27 touch assertions, 50 viewport assertions, six Rummy/Gin and five resize/teardown cases; the old source reproduces the clipping. No family moves, invitations, uploads, messages or announcements.

Physical-device acceptance is not claimed. Short landscape starts with a small overview, and tablet mostly expands the felt rather than every card and word. Zoom/pan remains available. The separate cardinal adapter is excluded.
