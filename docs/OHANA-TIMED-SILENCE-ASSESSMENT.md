# Current catalog update

Live catalog now916 (Without You and The Almighty added). The assessment below describes its earlier914-track baseline; both new HMG sources are also outside the unchanged Suno-only cue-save validator. All916 remain unmapped, and the fade draft is still unpublished. Current canonical app6298416/worker785002.

# Timed silence — current read-only assessment

Date:2026-10-16. Canonical inspected: `work/final-current-release/app.html`6293012B; `worker.js`784943B. Current app/Bible release commit: `1edbce3f60f8b97d41ceb488c2a5820fa78b841d`; documentation HEAD: `3f8c0cbd8179a7585e75ff85ed9fe2d0b77cb4e6`; app blob: `b6554e2bdb08ac0e80c3f4868226100f24a61bcd` (exact identities supplied by root).

No browser, deployment, audit route, canonical source edit, production song edit or production cue write was performed for this assessment.

## Compatibility evidence

All three app transplant anchors and the worker dispatch anchor occur exactly once in the current canonical. `patch.json` client/API strings equal current `client.js`/`api.js`. This establishes bounded patch applicability, not runtime correctness. Prior engine/API evidence files report unit/SQLite passes; actual editor/browser playback flow is still unverified because the prior local listener timed out.

The current914 tracks are **unmapped and not certified clean**. This includes the original907 and seven public-domain hymns. There is no automatic profanity detection, transcription, word alignment or review of every recording. Manual timings must identify the exact recording/stream, and unmarked passages are unaffected.

## Concrete blockers

1. **No canary gate exists.** `attach()` replaces the singleton audio's `volume` property and `play()` for every listener. Every Play waits for the cue API, so an API outage blocks even an unmarked song. Do not transplant this globally for a trial.
2. **Seven new hymn URLs cannot save cues.** POST uses existing Suno-only `ohanaMusicStream()`. Keep this validator intact. Supporting licensed built-ins later requires verifying the supplied URL against that track's authoritative catalog URL, not accepting arbitrary hosts/URLs.
3. **No actual editor/audio proof.** Existing tone fixture and engine/SQLite checks are useful but not browser/device evidence. No physical iPhone/Android test has passed.
4. **Native-volume timing is best effort.** A20ms JavaScript interval plus80ms ramps and120ms padding cannot guarantee suppression under CPU stalls, timer throttling or all playback rates. Setter readback is not proof of audible gain. Do not promise automatic or complete word removal.
5. **iPhone/iPad remains unsupported.** Known iOS/iPadOS identifiers block marked tracks. A desktop-UA iPad heuristic is present, but UA recognition/readback cannot establish capability on every browser. Real Safari/device verification is needed; do not silently fall back to uncensored mapped playback. Current draft pauses mapped tracks when hidden, which differs from normal uninterrupted music navigation/background expectations.
6. **Cue persistence applies only to the authenticated listener/room/song.** One person's ranges do not clean another person's playback. No family-wide cue review or approved shared cue library exists.

## Smallest safe future canary

Do not add this route now. Future canary should be explicitly opted into by the current authorized user only, with a default-off server feature gate, existing session authentication and room-membership checks, and an explicit configured member allowlist. Never use a public query parameter alone as authorization.

Proposed GET-only `/__audit/timed-silence` serves a self-contained synthetic-tone fixture using the exact runtime/editor and two fixed test track IDs. No family song URLs, private member library, production cue table or production music mutation endpoints. Inject an in-memory cue transport into `attach()` for this isolated page; label saves temporary/test-only. This is the smallest route for editor/runtime behavior and avoids adding a D1 binding/table merely to hear a tone. Existing authenticated API/CAS tests remain separate; real durable canary persistence would require a separately isolated test database/table and additional review.

Return `Cache-Control: private, no-store`; deny unauthorized/disabled access before emitting the page. Use only self-hosted synthetic media with no source-validator weakening, no arbitrary iframe/URL inputs, no autoplay and no writes to existing music rows. No client-supplied member ID or room may override the authenticated identity. Keep the production attach hook absent for non-opted-in listeners.

## Proposed meaningful tests

- Gate disabled/unauthenticated/wrong room/wrong member denied; normal Ohana has no Clean hook/API dependency and retains sole independent player.
- Actual foreground tone playback: no autoplay; fade down before mapped interval; silence within interval; return no louder than desired volume. Verify mute remains held. Record native effective-volume readout alongside audible/device observation, without equating one to the other.
- Paused and playing seeks into/beyond range; rapid Next/Prev/source change and delayed cue responses; shuffled transition; rate changes; pause/resume; overlapping/adjacent ranges; background/foreground transition. No stale cue from a different recording.
- Editor Mark/End/manual pairs, invalid input, Save/Reload/clear, close/Escape/Back, narrow portrait/landscape and rotation, no hidden playback restart.
- Separate SQLite API suite against current914-ID set: authenticated ownership/room isolation, private/selected/revoked/deleted track ACL, revision conflict and idempotent retry, invalid bounds and URL rejection. Explicitly test that a track ID cannot bind timings to a different source URL.
- Real iPhone/iPad: mapped playback safely refused, clear reason visible, unmarked playback not falsely called clean. Do not unlock native-volume fades based only on UA/readback.

All future tests must use synthetic test tracks/cues or isolated storage; no production family songs/cues edited. Catalog expansion and visual design are outside this assessment.

