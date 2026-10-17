# Latest verified checkpoint — menu Back repair

Release0391a400f1ea7221fa8e496ad6ef4a0e4a11853b is live after Cloudflare build success. App blob111d4f9fd707eca3ec12280374b25cae5b32b67f,6289940 bytes. Worker remainsd801db4e65e0b64f67314acd0bc797c0aa0e3211 (784943 bytes), including72-hour reminders. Canonical app/worker: work/final-current-release/. All914 songs and Nashville Roadhouse photo preserved.

The focused native-dialog Back repair is enabled for everyone; no test query is required. Menus gain history entries, Back closes the current menu before the existing game route handler runs, existing Home controls avoid an extra Back step, Shadow DOM editors are tracked, native form closes are consumed, and stale closed entries are skipped. Late-added existing Home controls remove injected duplicates. Closed tracked dialogs are explicitly hidden because old Settings CSS otherwise rendered the closed menu over the game. Home clears stale Memories state and URL.

Actual canary and ordinary-public browser checks at390×844 passed: Bridge Back and Settings Back return to the exact same Dominoes board/hand/status; no tiles or moves changed. Final closed Settings has open=false and computed display=none. Bridge header has one original Home and no injected duplicate. Existing Home returns to the porch with zero open native dialogs and root URL. Canary Music editor Back returned to the reader without saving; editor Home exited Music. Memories guide Home removed the iframe and restored root URL. Sampled public error logs empty. Screenshot: work/android-back-repair/live-back-to-game-390x844.png. Returning can briefly re-fetch the current game; do not claim zero loading flash.

Physical Android Back/gesture and iPhone/Safari remain unverified. Browser Home boundary is not trapped. The broader nonmodal Prayer/ColorBook/Puzzle route-history replacement remains PRIVATE; it was not included. Existing route-history script, artwork, game engines and worker were preserved; inverse scope and28 inline-script syntax checks passed. Do not apply old full candidates over this release.

The first scheduled reminder invocation is now visible as Success in Cloudflare Cron events at2026-10-17T03:00:01Z (17.201ms CPU). Evidence: work/game-inactivity-reminder/live-first-cron.png. This proves invocation status only, not that any eligible phone received a notification. Local localhost/file preview access remains denied. Cloudflare public version URLs are disabled and were not enabled; gated tests used the existing authorized site.

Remaining: physical-device/full audit, nonmodal route history, Bible printed columns, further Christian country/contemporary/kids/comedy catalog, timed fades, exact Invite obstruction and red-three scoring question. Outfits remain last.

The earlier checkpoint/history follows.

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

