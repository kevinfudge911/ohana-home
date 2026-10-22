# Combined Rummy and global header candidate

This supersedes the earlier separate `rummy-forward-ui.patch` / `rummy-forward-headers.patch` handoff. Use the one combined patch; do not layer those older header patches on top.

Base remains verified live `12d7c6bd96aa71ab06853acaa6de9c49947d9eb8`, represented locally by snapshot `b4e0bf9aec31042ae63b4c9d5c3fe1184031b97d`. All work is in `task-3/rummy-forward`, never the integrator checkout. No publication, family move/invite, credential use or shared Chrome occurred.

## Apply and merge

1. Preserve the publisher's direct Play/Home order `59506195` and the delivered `ohana-puzzle-forward-source.patch` first. The combined source patch was independently applied after both and checked not to change those functions or the Puzzle Worker. Applying this candidate to the plain 12d7 baseline is also verified.
2. Apply `ohana-rummy-global-headers-combined.patch` with `git -c core.autocrlf=false apply --ignore-space-change --whitespace=nowarn <patch>`.
3. Run `node tools/package-rummy-forward.cjs`. The review patch omits derived `app.html.gz` and the generated global-sign insertion; this command builds both from the patched source while preserving the existing gzip transport. Generated HTML/gzip are included in the candidate commit for recovery. Keep the publisher's packaging/config fixes from 59506195.
4. Run the focused tests and the publisher's existing direct/Puzzle checks, then do the normal fresh release reconciliation. Only the sole publisher decides publication. No announcement is included.

## Exact ownership

There is one component instance and one global registry. The old Rummy `decks-adapter.js` is removed. Startup stops a previously active scoped adapter before installing the global owner, and repeated `.install()` calls return the same registry. Do not load/re-execute a second bare component over mounted headers.

The registry reuses original Home, `[data-room-next]`, `[data-category-next]` and actual game Next nodes with their existing handlers. Back/Leave are never selected as Next. Rummy Play and active Puzzle Play/Preview remain in their workstations. Counts, automatic game navigation and manual bot-game access are not changed.

The component owns sign/header presentation and observes the actual heading text. Renderers still supply real saved names; no demo/default puzzle name is introduced. Teardown restores only original nodes still present, so replacing an h2 within a retained header cannot resurrect its removed predecessor. Pending saved-name text is retained during teardown.

Measured-height callbacks set fixed game-root top padding where needed and dispatch the existing game resize event. Active Puzzle invokes existing `pzResize()` after a real header-height change. No fit/reset/solve operation or game-state write is added. `coordinatePuzzleHeader()` yields its style writer when the global component owns that header; its caller still performs native Play placement and obsolete Back hiding.

TEN remains explicitly excluded at both registry and component boundaries. Its combined sign, card art, hand layout, opponent rotation and controls remain unchanged. The approved shared sign's exact embedded artwork data is unchanged; only controller teardown/ownership and adapter integration logic changed.

## Tests and practical limits

- `tests/global-header-integration.cjs`: 22 assertions pass for single ownership/takeover/teardown, actual Next vs Back/Leave, original handlers, exact dynamic saved names including Unicode/HTML-looking text, h2 replacement without duplicates, legacy style-writer yielding, Puzzle resize callback/state preservation, workstation Play/Preview and TEN exclusion. An unrelated saved Puzzle named Ohana TEN still gets its actual title; actual TEN is excluded by surface/type.
- `tests/global-header-renderers.cjs`: 18 actual current application renderer cases pass for Words, Hand & Foot, Spades, Chess, Memory and TEN at 390x844, 844x390 and 1280x900. Fictional state is unchanged, header bounds/targets pass and no new browser error appears. Memory has pre-existing phone document overflow; the test compares the unmodified layout and verifies the header does not increase it.
- Rummy/Gin current full-app synthetic Worker flow passes: real engine draw/discard/bot responses, private selection/order/reload, simulated touch/cancel, pending/rejection guards, private groups, Decks navigation, six-seat family chooser/Back and six viewport cases. The engine suite's 60 simulations, bot suite's 4,285 assertions/40 hands and Worker/SQLite API suite passed on this forward baseline; no engine or Worker change is included here.
- Preservation: Worker/config/engine/catalog remain unchanged in the base candidate; all application source outside the shared module, global-sign block and seven narrow UI adapters remains unchanged. Approved artwork bytes remain exact and gzip expands to the exact HTML.
- Independent application after direct Play/order 59506195 plus the Puzzle source patch passes. Direct functions, `orderShelf`, updated tray planning/resize and the Puzzle Worker remain exact after merging this candidate.

Evidence lives under `artifacts/global-header/` and `artifacts/rummy-forward/`; packaging/compatibility receipt is delivered beside the patch. Tests use fresh isolated headless profiles and synthetic state. No physical-device/screen-reader acceptance or full live Puzzle session is claimed. The inherited `titleBankKey` startup error reproduces on the base; no new error remains. Preview servers are stopped.
