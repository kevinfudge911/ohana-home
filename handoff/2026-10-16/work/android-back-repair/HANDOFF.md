# Android Back navigation — PRIVATE DRAFT, NOT RELEASE READY

Confirmed source gap: `ohana-screen-history` wraps only openGame/openGranny/grOpen/grNew and its snapshot only stores game/granny/record/tab. Most modal overlays do not create browser history entries. Consequently Android/browser Back can leave the app instead of closing the visible overlay. Nonmodal ColorBook/Puzzle also lack complete route snapshots.

Private appended module registers each opened dialog once, adds canonical Home only when absent, closes only top overlay on Back, consumes ordinary Close entries, skips closed stale overlay entries, and does not intercept Back at Home. No engine/worker/music changes.

`node check-model.cjs` PASS for nested Back, no rerender duplicate, Close, stale entries, Home boundary. This is mocked lifecycle evidence, NOT Android/browser proof.

`node prepare.cjs <latest app>` regenerates app.html/patch.html/scope.json. Exact inverse scope restores baseline. Do not publish without actual normal-boot tests. Root preview command `node work/android-back-repair/server.cjs` port8881.

Remaining: actual browser Settings/Help/profile/category/setup nested overlay test; visible canonical Home dimensions; Back after Home without trapping. Nonmodal Prayer/ColorBook/Puzzle route snapshots need separate safe handling. User's exact missing-Home screen remains unidentified.

Timed-silence candidate remains separately frozen in work/music-timed-silence; no related changes here.

## Continued work
Nonmodal route handling now implemented as replacement of the existing screen-history script, not a second competing route listener. Semantic render snapshots include Prayer/tab, personal ColorBook page, existing Puzzle ID/lobby, game and Granny. Same-route renders do not add entries. Home's two-phase render is coalesced. Back uses existing read/local handlers; no create/invite/move API was added. Existing puzzle disconnect only closes local connection/clears timers and queue; worker/DO remains untouched.

`node check-routes.cjs` PASS Prayer/Color/Puzzle routes, re-entry via existing handlers, rerender dedupe and Home. All inline scripts parse. `route-patch.json` contains exact original/replacement script. `patch.html` is appended overlay module/style only. `scope.json` exactInverse is true.

Status: browser-ready private draft. Real normal-boot browser check and physical Android Back validation remain required. Do not claim the unnamed live screen fixed without that validation.
