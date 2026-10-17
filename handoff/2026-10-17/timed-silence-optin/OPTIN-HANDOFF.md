# Private opt-in synthetic timed-silence draft

Prepared2026-10-16 against current canonical app6306082B/worker785386B with927songs. No canonical edits, browser actions, deployment, cue API/D1 writes, user/auth changes, source-validator changes or source media edits.

## Files and behavior

- `client.js`: exact editor/runtime now requires explicit `attach(player,shadow,{optIn:true,transport,identity,temporary:true})`. Default attach returns disabled before touching audio or contacting a transport. No fallback to global api/S. Activation pauses current playback and requires another Play. Duplicate attachment returns the existing active instance.
- `state.disable()`: removes own UI, closes editor, invalidates pending work, clears timer, restores original own/native Play/volume property and desired volume; stale event callbacks do nothing. A delayed GET success/failure after disable resolves without pausing or modifying subsequent normal native playback.
- UI uses **Timed silences**, not a misleading Clean label. Temporary fixture saves explicitly disappear on reload and do not touch family songs/account timings.
- `memory-transport.js`: two exact synthetic IDs only, exact known recording URLs, in-memory Map, revision/idempotency checks, bounds, defensive copies. No fetch/network/durable storage. This is an isolated testing adapter, not production authentication.
- `build-isolated-page.cjs`: creates `synthetic-6s.wav` (48044B, mono8-bit8000Hz,440/660Hz), `isolated-test.html` (80131B) and `isolated-page-proof.json`. The exact current client/editor is embedded. Two IDs use that fixed synthetic source. Activate/Deactivate, tone selection, native audio controls, temporary editor and native effective-volume diagnostic are exposed. No family IDs/URLs, no actual cue endpoint calls.
- `patch.json` and old global transplant outputs are **STALE**. `transplant.cjs` now refuses a source/manifest mismatch before writing outputs. They must not be used until the refactored client, separately-reviewed authoritative-source API, opt-in integration and teardown are combined intentionally.

## Mechanical tests passed

`node work/music-timed-silence/check-engine.cjs`: default native player unchanged/zero cue requests, no autoplay, padded fades, desired volume/mute preservation, paused seek, rate changes, pause timer cleanup, hidden mapped-track pause, known unsupported iOS mapped-track refusal, unverified unmarked state, changed-source guard, stale track-read race, disable restoring descriptors/native play/desired volume, late GET resolve AND reject not pausing later normal playback or restarting timers.

`node work/music-timed-silence/check-memory.cjs`: initial zero requests, two fixed IDs, save/read, idempotent retry, isolated stores, copies, foreign family IDs/URLs rejected, stale revision and invalid timing rejected. No network/production storage.

These tests are not browser or audible/physical-device verification. Native getter diagnostics prove only mechanical volume values, not audible word suppression.

## Future browser steps — no deployment performed

1. Pure synthetic static page can later be exposed through a separate explicitly chosen query/test page; it needs no family-data/auth expansion or protected account route because it contains no private data and cannot save remotely. Root decides deployment and package budget. Normal app927catalog and playback must remain untouched.
2. Before activation, native Play/volume works and cueRequests stays0. Activate pauses; marked editor remains user-triggered. Confirm temporary warning, narrow/landscape controls, keyboard/focus/close/Escape behavior.
3. Mark1.50–2.50, Save temporary, Play. Observe diagnostic desired/effective values and actual audible tone separately. Seek inside/outside, change volume/mute, change tone rapidly, pause/resume, background/foreground. No autoplay or stale cue use.
4. Deactivate during a marked interval: native volume/play restored, no timer. Deactivate while delayed transport GET resolves/rejects, then native Play: stale work must not pause or modify it. Mechanical tests already cover these races; browser proof pending.
5. Reload: maps vanish. Separate tabs/listeners do not share maps or playback.
6. Real iPhone/iPad: mapped playback must refuse clearly; never label unmarked playback clean. No physical device pass exists.

## Unchanged limitations

Manual exact-recording timing only; all927production tracks remain unmapped/not certified clean. No automatic detector/transcription.20ms JS timer,80ms ramps and120ms padding are foreground best effort; CPU stalls/throttling/rate changes can leak audio. Known iOS devices refuse marked playback. No global/family shared cue review exists. Native setter readback is insufficient to certify audible capability.

Root review 2026-10-17 04:50 UTC: corrected a residual post-save Clean label to Timed silences so manually marked ranges never imply whole-song filtering. Regenerated 80,131-byte fixture; engine and memory checks pass again. Still no browser, audible, device or deployment proof.

