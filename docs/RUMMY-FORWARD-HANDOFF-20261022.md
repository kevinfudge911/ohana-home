# Rummy / Decks forward integration for the sole publisher

Superseded by `RUMMY-GLOBAL-HEADER-INTEGRATION-20261022.md` and the one combined integration patch. The separate scoped-header ownership instructions below are historical.

Prepared in NEW isolated copy `an isolated Rummy worktree`. No original/integrator checkout was edited. No publication, production credential, family game move/invite or shared foreground Chrome use occurred.

## Verified base and preservation

Base is verified live `12d7c6bd96aa71ab06853acaa6de9c49947d9eb8`, tree `e487c4268f1cf3195862d937f5a1548b22f38cfe`. The same tree is local source candidate `22ade1c1e918094dc04bf753d12c2e845bc50313`; the recovery publication journal's blobs were checked before editing. Isolated snapshot `b4e0bf9aec31042ae63b4c9d5c3fe1184031b97d` preserves this tree's application and gzip bytes. Git archive converted line endings in some standalone text files; comparisons account for that without changing artwork or behavior.

Ready preview `4c441838` is ported forward. All six shared UI adapters were compared to the earlier preview before porting. The one actual conflict was `addNextGameControl`: the current base uses `goToNextGame`, while the old preview used `openOhanaWaitingGames`. Current direct binding is retained; only the Rummy workstation destination for that same native control changes. The separate direct-Play routing patch remains publisher-owned and is neither reverted nor bundled here. Automatic navigation, count calculation, Puzzle Play and the current Bridge remain exact baseline code.

The existing TEN V3 artwork/overlapping hand, opponent rotation, all puzzle workstation/tray/scale repairs and all unrelated embedded art/code are preserved. Worker and wrangler config are byte-identical to this local baseline. The configured Worker still imports only the existing gzip app and decodes it losslessly; no raw duplicate HTML module or new Worker asset route is added.

## Separate patches and apply sequence

`rummy-forward-ui.patch` contains the scoped Rummy/Decks UI plus gzip-aware sync/package tooling and synthetic fixture updates. UI commit is `c21413d6111a1cfd7aacf01f3869c76e9fabafb0` on the isolated snapshot. It preserves the prior approved characters/outfits, uniform hidden backs, shared wooden workstation, short phase-specific actions, private drag/keyboard order and original real rules/bot/move/revision handlers.

`rummy-forward-headers.patch` is separate. It adds the exact approved shared sign component from the provided global-header package plus an explicitly scoped adapter. No new artwork/design was invented. Scoped mounts cover Rummy/Gin game headers, Ohana Decks, Rummy/Gin setup and the Ohana Shuffle collection header. They do not mount TEN, Puzzle, other games or other rooms. Rummy's bottom Play control remains in the workstation; the sign reuses the original Home node. Existing collection/setup Next nodes and handlers stay intact.

Both compact review patches omit derived `app.html.gz` (and the header patch omits its generated app insertion). After applying A, then optional B, run from the candidate root:

```
git -c core.autocrlf=false apply --ignore-space-change --whitespace=nowarn /path/to/rummy-forward-ui.patch
git -c core.autocrlf=false apply --ignore-space-change --whitespace=nowarn /path/to/rummy-forward-headers.patch
node tools/package-rummy-forward.cjs
```

The explicit `core.autocrlf=false` avoids Windows Git rewriting unchanged application line endings while applying a patch; the independent reproduction check includes this setting. Packaging syncs only the marked shared-card module, inserts/updates the separate marked sign block when patch B's files exist, and regenerates the same lossless gzip transport. The commits retain exact generated files for review/recovery. Independent clean-baseline patch application plus regeneration is checked by the packaging receipt. Use the explicit patch order; do not deploy an old snapshot.

## Global header hook boundary

The provided `global-header-review.patch` contains a reusable component and broad opt-in registry; it is not enabled globally here. The scoped adapter uses `window.OhanaUnifiedGameHeader` if already loaded, so it does not replace an existing component instance. Scoped ownership is marked `data-decks-header-owner`.

For later global rollout, call `window.OhanaDecksHeaderAdapter?.stop()` before `OhanaUnifiedHeaderAdapters.install(...)`, or make that global registry explicitly skip scoped-owned headers. Otherwise both observers could own/destroy the same controller during rerender. The scoped stop restores original header styles/nodes and Rummy root padding; handlers are never replaced.

Rummy's current stylesheet reserves an 84px legacy header. The approved sign is at least 100px, so this scoped adapter's `onResize` updates only that Rummy root's top padding to the measured header height. A global takeover must retain this callback for `#game.rd-game[data-game-type=shuffle]`; otherwise the sign can overlap its board. No global camera/tray/workstation hook is changed. This is the only header-sizing hook introduced here.

## Completed verification

- Real engine: 60 fictional simulations and rules/scoring/privacy/revision checks PASS.
- Existing bot suite: 4,285 assertions, 1,377 legal actions and 40 completed hands PASS; current Worker/in-memory SQLite bot/reload/concurrency/stale/interrupted/review/next/replay/permission cases PASS.
- Actual Worker/in-memory SQLite API suite PASS. Its test-only source loader now stubs the gzip app decoding constant, preserving the actual Worker/engine request code under test.
- Current full-app synthetic browser flow PASS: Rummy draw/discard/bot reply; Gin opening/draw/discard/bot reply; mouse and simulated touch reorder, cancel, keyboard/poll/reload order, received-state immutability, rejection/pending gate, private groups, whole-card navigation, keyboard Decks/Gin navigation, six-seat family chooser/Back. No real family APIs are forwarded.
- Six final layout cases at phone 390x844, desktop 1280x720 and short landscape 844x390 PASS: approved sign with exact accessible game name, 44px Home/actions, no horizontal overflow; separate landscape hand-scroll screenshots show the complete rack above the workstation. Ten final screenshots are under `artifacts/rummy-forward/`.
- Preservation PASS: 29 scripts parse; Worker/config/engine/catalog unchanged; all current TEN/Puzzle/art/navigation code outside the shared module and six narrow adapters unchanged after Git newline normalization; final gzip expands to exact app bytes. Approved shared component SHA256 `c7801d9f6521501300da38fb183574eeb96ca3e148ab12e07dffe3f5ea6f1350` is unchanged from the supplied package.

Evidence: `artifacts/rummy-forward/browser-results.json`, `preservation.json`, screenshots, and `artifacts/shuffle-bot-test-receipt.json`. Preview server is stopped. No coordinated Chrome slot is needed; tests used a separate fresh headless profile.

The inherited startup `Cannot access 'titleBankKey' before initialization` error reproduces on the verified baseline; no new browser error remains. Unrelated fixture chat/puzzle/prayer tables are absent and logged; no production forwarding occurs. Physical-device/screen-reader acceptance and a fresh Wrangler deployment-package run remain publisher release checks. No announcement is included.
