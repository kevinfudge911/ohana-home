# Remove obsolete automatic button themes

This release removes decorative blue/enamel/carved button declarations at their source rather than adding a higher-specificity theme. It edits 28 existing CSS rules and removes 4,843 bytes. Puzzle setup is excluded from the old illustrated game-entry frame; original artwork and selection/focus cues remain.

All application script blocks remain byte-identical, 26 scripts parse, and exact forward/inverse reconstruction passes. Worker, PuzzleRoom Durable Object, storage, game data and rules are unchanged.

The prior regression release deployed successfully. This source cleanup is authorized for publication on the regular site for phone review; live verification is pending. This is not a certification that every local blue control throughout every room is gone. Remaining local styles need direct screen audit.

Current source: app blob 5521c1e9daa92844b08388c0d768745ec610ea2f, based on e7527bf32668f2db85e795b7a23a0ae33f3bc99a. Package remains under hosting limit.
