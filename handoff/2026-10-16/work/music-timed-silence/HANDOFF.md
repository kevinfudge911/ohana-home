# Timed silence — private draft

Prepared against final-current-release/app.html and audit-visual-release/worker.js. No deployment or source media changes.

## Proven
- check-engine.cjs: padded timed fades, desired volume/mute preservation, seeks/pause/rate changes, hidden-tab pause, unsupported-device block, stale recording/track races.
- check-api.cjs: actual existing music API with SQLite; authentication, room membership, owner isolation, private/selected/room/deleted/revoked custom-song ACL, bounds, revision conflicts, idempotency, stream URL validation.
- transplant.cjs exact inverse restores both supplied baselines. Only three app insertions and authenticated music cue route/new additive D1 table. No Durable Object/binding/migration edits.

## Not yet proven
Actual editor/playback browser flow awaits root-started `node work/music-timed-silence/server.cjs` on8880. No physical Android/iOS test. Unit tests are not physical audio testing.

## Important limits
These are manually checked timing ranges, saved for the authenticated listener, room and song. No automatic profanity detection/transcription. All907 unmapped recordings remain unverified. Native volume fades are limited to foreground supported browsers; mapped tracks pause when hidden and are blocked on known unsupported iOS devices. No WebAudio/CORS modification. No claim every device's native-volume behavior can be detected solely by setter readback.

## Apply only after review
`node work/music-timed-silence/transplant.cjs <latest-app.html> <latest-worker.js>` produces latest-app.html/latest-worker.js and scope-proof.json in this directory; it never overwrites inputs. Re-run checks and actual UI after latest integration. Original production stream validator remains Suno HTTPS only; fixture-only adapter permits local tone URLs.

## Latest actual audit
- Root-started8880 listener was attempted once in Chrome; ERR_CONNECTION_TIMED_OUT. No Clean editor/browser playback proof. Do not publish as fully verified.
- Live ohanahome.app native read-only Bridge check passed: cardinal opens, Help matches current controls, Okay closes guide, My games lists26 ongoing games/opponents/turns, Go opens selected existing O10 with Memaw/Logan, Bridge Escape returns same table, Home returns porch. No game moves, messages, invites, or new games.
- Screenshot live-bridge-native.png. Native dialog width equals viewport1036; heading right1026 within viewport. Controls below player require Bridge scrolling, consistent with guide.
