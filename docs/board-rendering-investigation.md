# Missing board bands — investigation

The reported screenshot has a full-width gold band across three rows, while the surrounding frame, rack and played letters remain visible. The earlier CSS-grid sizing patch did not resolve the report.

Read-only production audit: the active Words game matching SIRE/RIP has 225 board entries and 225 bonus entries. The rows hidden in the screenshot contain valid bonus entries in storage. Five other active Words games also have full 225-entry boards and bonus arrays. No board, rack, score or chat records were modified by this repair.

Confirmed: missing pixels are not missing database rows. Exact Android browser/compositor defect is not proven, and the cloud browser did not reproduce the original band. Browser paint/compositing remains a hypothesis, not a confirmed upstream bug. References reviewed include Chrome's paint-complexity guidance (https://web.dev/articles/simplify-paint-complexity-and-reduce-paint-areas) and a Chromium report of missed Android surface updates (https://groups.google.com/a/chromium.org/g/input-dev/c/ft_DcQOhAYM). Neither proves this particular failure.

Repair removes the affected rendering architecture: one continuous SVG paints all 225 cell backgrounds, boundaries and bonus labels. Independently positioned transparent hit areas retain the same cell indices and existing tile drag/drop handlers. Empty rows no longer rely on CSS grid row painting. The continuous box-shadow animation is removed from the board; static glow, chest animations, character animations and voices remain.

Tests verify every square and hit area's coordinates, bonus labels in empty rows, no mutation of saved state, and draft reposition/blank/drop behavior. Phone/tablet visual checks use fictional sample games. Actual Android confirmation still requires observing the updated page on the user's device.
