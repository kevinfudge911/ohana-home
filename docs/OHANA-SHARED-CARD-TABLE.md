# Ohana Shuffle shared card table — prepared, not published

## October 20 functional release separation

This isolated candidate contains the single Words tile-return repair, Regular Rummy/Gin, the scoped shared-table header/bottom-clearance corrections, and same-table/round scroll preservation. The workstation controller and short-landscape controls remain identical to published 00a88a8; the unverified Menu/Hide/Show redesign is excluded. The combined visual candidate is preserved separately. Fictional browser checks covered six players, next-hand/reload, History/Other destinations and card selection without scroll reset. They used local synthetic transport, not a production database or real multi-client session. Physical touch and the exact earlier control sample remain unverified. No push or deployment.

The dated checkpoint below and all older publication/security receipts are historical context, not the current release status.

## Earlier October 20 sequential integration checkpoint

The sole Ohana owner integrated stopped Rummy commit `d62e520` onto published
`00a88a8747f8244d003e96bea741d0923c663a58` plus the separate private Words and
workstation-control repairs. Integration commit: `4c88645`. The saved Rummy branch
was not modified. Engine/API/UI suites passed again after integration; six new
interrupted-flow fixtures also passed. The combined candidate packaging dry-run
passed at 65,105.42 KiB raw / 60,029.64 KiB gzip. No push or deployment occurred.

The original preservation/security JSON artifacts below are historical receipts
from the earlier candidate, not current combined-candidate certification. Current
preservation compares against `00a88a8`: configuration, PuzzleRoom and the music
closure match with CRLF normalized; cardinal art is byte-identical. The inline
card-table block matches its source modules. Original exact control-preview
recovery and combined browser layout/interaction checks remain outstanding; JJ
owns the shared laptop browser. DOM tests do not establish visual/physical fit.
The earlier main-push denial below describes historical execution, not a new
attempt or an authorization request for this private checkpoint.

## Scope and preservation

Kevin's latest direction is one reusable card table and initial game selector **inside the existing Ohana Shuffle**, keeping all existing standalone games. The new database game type is `shuffle`; its immutable per-table mode is `rummy` or `gin`. There is no new room, migration, game conversion, permission change, credential creation, or production data write.

The existing master game registry is `GAME_TYPES` in the configured `live/worker.js`; frontend lists are `OHANA_START_GAMES`, `renderGames` shelves, and the category-room `categories` map in the imported hashed live app. No separate master card catalog was found. All existing registry entries and game engines remain in place. The existing `handfoot`, `ohana10` and `spades` types, invitations, scores and progress retain their identities and rules. Regular Canasta is explicitly a future candidate, not a rename of Hand and Foot.

Current reconciled baseline: **`ab707d0523172386de71288e4ca4cc05ff826afb`**, the verified eleven-track/artwork music release, including the notification-key binding repair. The original implementation was based on `8c3e0355`; its old full Worker contained the inherited key and must never be uploaded. The current Worker retains `OHANA_PUSH_ENV` and the encrypted-binding lookup, and contains no copy of the former private-key value. Isolated checkout: `task-2/ohana-rummy`, branch `codex/ohana-rummy`. Music's checkout was never edited. Parent released the coordination lane, but automatic approval review then denied the exact main push as described below. The full feature remains local and unpublished; only the separate fictional-preview draft branch was uploaded through the connected GitHub app.

Current `OHANA-DESIGN-RULES.md`, `OHANA-CURRENT-STATUS.md` and `OHANA-LATEST-PRIORITIES.md` were read. No AGENTS.md or checkout `.agents/skills` was present. PuzzleRoom implementation, exports, namespace, storage, lifecycle and wrangler bindings are unchanged.

## Exact proposed rules defaults

These choices are visible in setup and Help. No material unresolved choice prevents implementing these explicitly named defaults. Family preferences can change a future version; existing tables must retain their saved rule version.

- **Regular Rummy:** basic single-deck Rummy, not Rummy 500. Two to six players; 10 cards with two players, 7 with three/four, 6 with five/six. Low aces; no jokers. Sets of 3/4 equal ranks; same-suit runs of 3+. Draw one stock card or the top discard; never return that same discard immediately. Public melds and additions to any existing meld; no removal or rearrangement of public melds. Discard ends the turn; playing every remaining card by melding/layoff also ends the hand. The winner earns all opponents' remaining hand values, even cards that could form hidden melds. A=1, J/Q/K=10, other ranks face value. Going out in the first turn in which the player melds/lays off doubles the score. This allows the UI's successive meld actions within that one turn. First to 100. On empty stock, turn the **whole** discard pile over without shuffling, keeping its physical order. Winner deals next with two players; dealer rotates with more players.
- **Gin Rummy:** exactly two players; ten cards each; low aces; no jokers. Opening upcard offered to nondealer, then dealer; if both pass, nondealer must draw stock. Melds stay private until the hand ends. After drawing, discard one different card and optionally knock with at most 10 deadwood. Disjoint melds only. Zero deadwood is Gin. Defender's best legal grouping and chained layoffs are computed automatically; no layoffs against Gin, and knocker never lays off. Gin = 20 + defender deadwood. Undercut (including equal deadwood) = 10 + difference to defender. Otherwise knocker earns difference. These are the traditional Pagat 20/10 defaults; 25-point variants exist. First to 100, without box/game/shutout settlement bonuses. No Big Gin, Oklahoma, Hollywood or Rummy 500 rules. After a discard leaves two stock cards, cancel the hand for zero points, same dealer. Otherwise winner deals next.
- First dealer is securely random. Each hand pauses for review; the round winner can request the next deal. After a cancelled Gin hand the nondealer can request the next deal. The existing game turn gate enforces this. A new selector choice creates a new saved table; it does not mutate an active table's game.

Sources checked October 19, 2026:

- [Bicycle basic Rummy](https://bicyclecards.com/how-to-play/rummy-rum): basic play, deal sizes, recycling and remaining-hand scoring.
- [Bicycle Gin](https://bicyclecards.com/how-to-play/gin-rummy): two-player structure, opening offer, low ace and distinct knock/Gin scoring. Its prose is ambiguous on layoffs against Gin, so the explicit Pagat no-layoff rule is used.
- [Pagat Gin rules](https://www.pagat.com/rummy/ginrummy.html): disjoint melds, no layoffs against Gin, stock cutoff and traditional 20/10 scoring, with bonus variations documented separately.
- [Pagat Rummy families](https://www.pagat.com/rummy/): basic, contract, knock, meld-scoring and Canasta games have distinct mechanisms.
- [Pagat classified index](https://www.pagat.com/class/) and [alphabetical index](https://www.pagat.com/alpha/): game-family research and exact source player/deck metadata.

## Shared architecture and catalog

`live/shuffle-engine.js` owns standard-card identities, secure shuffle/deal, hands, turns, stock/discard, meld validation, exact disjoint partitions, layoff search, revisions and scoring transitions. `SHUFFLE_RULES` is the allowlist of implemented modes. Mode-specific opening, public/private meld, ending and scoring rules remain explicit. A future trick-taking game needs its own bidding/trump/follow-suit/trick-scoring adapter; this implementation does not pretend Rummy rules implement those capabilities.

`live/shuffle-catalog.json` holds 85 curated **rules-only** entries with direct rules URLs, indexed player ranges, deck quantities and family/implementation notes. These include one full standard pack, multiple packs, jokers and reduced packs. Latin-pack games such as Escoba/Scopa require explicit suit/rank mapping. Aliases are not additional playable games. The catalog has search/deck filters and no Start controls. Only Regular Rummy and Gin are playable on the shared table. Existing standalone Spades is identified separately. This is a representative research catalog, not an exhaustive claim to every card game on the internet or hundreds of implemented games.

`live/shuffle-ui.js` and `live/shuffle-table.css` build the reusable table and selector. Existing Shuffle entrance artwork and the established sky-header asset are reused; no copied cardgames.io artwork/code. Commands are native readable words with touch targets, selected/focus/disabled states; actual card faces are game pieces. Navigation includes Ohana Home, Shuffle, Choose game and Help. Tap-to-select, explicit Left/Right and Alt+Arrow arrangement, optional sorting and private Gin groups are supported.

Manual order is scoped to member/room/table/round and saved locally for reload; new draws append, polling does not sort. Arrangement changes only local presentation, including off-turn arrangement of one's own cards. Server actions require seating, correct room, correct turn, rule phase, own-card membership, current revision, and existing compare-and-save state/turn lease. Hidden stock/order and other players' hands are removed by an explicit response allowlist; a nonseated room member sees counts only until the round's public reveal. No spectators can act. Draw/discard/meld payloads cannot mutate other hands or meld identities.

`tools/sync-shuffle-ui.cjs` regenerates only the marked new inline block in the configured hashed app, sharing the pure meld code between client and server. `tools/integrate-shuffle-once.cjs` documents guarded integration anchors for a fresh checkout; it fails if integration is already present. Do not use old whole-app files to publish over music.

## Evidence and limits

- `node tests/shuffle-engine.cjs`: engine invariants and 60 fictional simulations, including deal sizes, unique-card conservation, atomic rejection, revision checks, low ace, duplicate/foreign card rejection, stock/discard rules, Rummy ending/double score/target, Gin passes/knock/Gin/undercut/layoffs/stock/continuation.
- `node tests/shuffle-api.cjs`: **active** live Worker code with local in-memory SQLite, fictional members/rooms/games. Tests reject unsupported games/seats/bots, preserve invitations, block cross-room/nonseated/off-turn actions, conceal hands, reject stale/duplicate/concurrent requests, resume without redealing and preserve an existing fictional game. Notifications are stubbed; no deployed database or family moves.
- `OHANA_JSDOM_PATH=<installed jsdom path> node tests/shuffle-ui.cjs`: all 28 inline app scripts parse; new selector/metadata, mode limits, tap/keyboard arrangement, poll/reload order, off-turn controls, hidden opponents, state immutability, Help and rules-only catalog checked in DOM. This does not certify browser layout or physical-device touch.
- `wrangler deploy --dry-run --outdir <task output>`: packaging only; not a deployment. Reconciled pass on `0fe53688` completed at **65,065.67 KiB raw / 60,024.73 KiB gzip** (481 auxiliary modules), within the 65,536 KiB / 64 MiB raw limit. Existing duplicate-module warnings remain. The first old-baseline pass attempted log writes outside the sandbox; subsequent passes completed with logs redirected inside the task and no packaging error. Any newer music integration must recheck total size.
- `artifacts/shuffle-preservation-evidence.json`: all preexisting style blocks and the music closure are byte-identical to baseline. 25 of 27 original script blocks are byte-identical; the two intentional changes are the main game registry/setup/render hooks and existing room-category ID list. Worker diff contains only the new type/mode dispatch and creation/bot guards. `wrangler.toml` and PuzzleRoom are untouched.
- `artifacts/shuffle-fictional-review.html` is an API-free fictional visual/interaction artifact generated by `tools/build-shuffle-review.cjs`. It can aid the parent's review; it is not routed or published. It references public existing art only. No screenshot/visual-browser/phone certification has been claimed. Local preview-network restrictions were respected; no alternate localhost/CDP/proxy route was attempted.
- Kevin's exact Library screenshot `libfile_858f2d61bd108191b623ff64a863cca5` was materialized using the Library transfer tool to task-2/reference/1000056371.jpg, confirmed 151,850 bytes, and viewed. Its readable game-name list informed selector usability. The proprietary image is not added to the repo.

After the parent requested browser/visual checks on the repaired baseline, opening the API-free fictional review file was **denied by Browser Use security policy**: the URL protocol is not allowed; only HTTP/HTTPS are allowed. Exact target: `file:///C:/Users/kevin/Documents/Codex/2026-10-19/task-2/ohana-rummy/artifacts/shuffle-fictional-review.html`. The tool explicitly prohibited workarounds, indirect execution, raw CDP/commands and alternate browser surfaces. No alternate local/file/data/CDP/proxy/HTTP-serving path was attempted. Browser visual verification remains blocked; DOM checks are not presented as visual proof. The safe next route is an allowed preview or parent-coordinated same-site publication after music's lane finishes.

Remaining release checks: accepted production authorization, any newer HEAD reconciliation, controlled publication, normal public startup and fictional shared-table browser checks, including responsive phone/landscape layout. Physical iPhone/iPad/Android and assistive-technology operation remain unverified. The draft preview branch is the only uploaded ref; there have been no main pushes, deployments, credential changes or security-setting changes from this task.

## Latest publication attempt and exact blocker

The parent released the sole Shuffle publication lane after music main `ab707d0` / Worker `2de5ee49-527b-4910-889b-a19d33830a9a` was verified Ready 100%. The full feature was rebased to that main and all three test suites passed again. All existing style blocks and the music closure match that baseline byte for byte; no wrangler binding or PuzzleRoom change. The full candidate packaging dry-run passed at **65,089.95 KiB raw / 60,028.12 KiB gzip**, below the 65,536 KiB raw limit.

A separate worktree, `task-2/ohana-shuffle-preview` on `codex/shuffle-hosted-preview`, prepares only a query-gated `/ohana-shuffle-check?fictional=1` route and an API-free fictional HTML fixture. It avoids persistent browser storage and leaves the normal app unchanged. The route injects the existing app's styles in the corresponding order, so a supported same-site preview can expose real cascade/layout problems. Its dry-run passed at 65,056.34 KiB raw / 60,017.32 KiB gzip. Local preview commit `d755cd0d6d07f48e74109a4294d1ecf614e69013` and GitHub review commit `9b169a91169875ab690f17ba955916072a264c47` share the identical tree `a547002a490a79b6893576d2c3c2ca9246e76f44`.

**Denied action, known not executed:** `git push origin HEAD:refs/heads/main`, targeting `kevinfudge911/ohana-home` from the preview worktree. Automatic approval review rejected the action because it updates the default/protected main branch and triggers production deployment, and it did not accept the delegated lane-release message as authorization for that exact production mutation. No main retry, alternate main-writing tool, dashboard deployment or other workaround was attempted.

CLI access limitations also remain: Wrangler's existing session is expired and cannot refresh noninteractively; the local Git credential helper cannot supply a GitHub login noninteractively. No login, token creation, credential rotation or account/security-setting change was attempted. The already-connected GitHub app was used only for the safer draft-review branch, without updating main.

**Draft review artifact:** [PR #1 — Prepare fictional Shuffle preview for browser review](https://github.com/kevinfudge911/ohana-home/pull/1), explicitly draft and unmerged, based on `ab707d0`. Hosted visual verification and the full game release remain pending exact production authorization accepted by approval review. The existing music production release remains the last verified live release; no family game, invitation or progress action was made.

The existing Cloudflare integration automatically attempted a non-production branch preview for draft commit `9b169a9`. It **failed without creating a Worker version**: build `36fa73ae-0f9a-442e-83ea-21e1da127f40` ran `npx wrangler preview`, which requires a `previews` configuration for D1/R2 resources that the repository does not have. The dashboard reports **No URLs enabled** and zero preview bindings. The log also warns that the production Durable Object is not included in suggested preview configuration. No preview URLs, bindings, namespaces, databases, buckets or security settings were enabled or created by this task. Do not point such a preview at production resources or alter PuzzleRoom to get around this blocker. Production was rechecked in the dashboard and remains main `ab707d0`, Worker `2de5ee49`, Ready 100%.
