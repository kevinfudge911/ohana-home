# Mango announcement rollout handoff

Base: `156357165962be9f40fd3258f2c63fda0372aa88`, verified GitHub main when this task began. This source-only rollout patch is unpublished. Publication is managed by the existing sole publisher. No shared Chrome, real notice send, broadcast, persisted test acknowledgment, microphone, recording, new voice research or sample work was used.

## Result

The existing `showAnnouncement(a)` flow now mounts Mango immediately after its original dialog opens. Existing authenticated arrival/polling, announcement eligibility, announcement IDs, media renderer, OK acknowledgment, image-seen receipt, private response handlers, retries and read-state bookkeeping are unchanged. The old short beep is replaced by the presentation hook. Ordinary updates remain ordinary cards; no update, entry, voice event or preview calls a send endpoint.

Mango displays the exact saved announcement text in a bubble beside one clipped portrait. The unchanged four-frame `talk-mango.webp` is shown through a 104×133.25 viewport, at the original 256×328 frame aspect ratio. Mouth frames and gentle movement run only during speech; reduced motion keeps the portrait still. The approved corrected owner preview independently passed 56 checks before this production conversion; that is prior UI evidence, not a claim that the new arrival branch has fresh native-device certification.

For a real incoming announcement, the presentation makes at most one automatic speech attempt when the visible page has already received user interaction (`navigator.userActivation.hasBeenActive === true`). It uses only an explicitly reported local English device voice, with the previously reviewed parameters. Fresh unactivated entry, no local voice, a hidden page, busy speech or browser policy retains captions and Play. There is no timer/voice-change automatic retry or autoplay-policy override. Composer previews never attempt automatic speech. Play/Replay requires a trusted pointer/keyboard click and calls speech synchronously. No paid/remote default voice, clone, recording or voice call is introduced.

Mute stops owned speech and remains in memory for this page, including subsequent announcements; no setting or token is written. Unmute does not speak. Native video playback stops Mango; explicit Play Mango pauses an already playing video. Text/media and OK remain usable regardless of audio. OK stops speech before its existing asynchronous acknowledgment completes. A failed acknowledgment keeps the dialog available for the original retry. Speech completion, timeout, media play, mute, preview close, sign-out and context teardown never acknowledge. Speech cancellation clears callbacks/animation/timers on close, token/account change or page exit.

The prototype-only owner ID, loopback/query gate, history action, recording/message demos and capability contracts are not installed by this patch. The existing personal Mango, cardinal and TEN owners' worktrees were not edited.

## Validation and limits

`tests/mango-announcement-rollout.cjs` runs actual current announcement helpers and dialog handlers with synthetic state and a mock speech engine. Its 47 checks cover normal authorized incoming rendering without an owner/query gate, all 300 saved characters, original media nodes, unactivated/activated/blocked/hidden/unsupported/remote-voice entry, trusted-control guard, mouth state, replay, page mute, preview no-ack, exact existing OK/media-seen receipt, immediate stop, failed ack/retry, storage/same-page token teardown and stale callbacks. Its exact byte inverse proves all original application/TEN/normal-update/cardinal/personal-Mango content is unchanged outside the one beep-to-Mango hook. Worker, media module, configuration and original sprite bytes are also compared with the requested base.

Existing synthetic `megaphone-media`, `megaphone-legacy-compat`, `session-preservation` and `home-room-order` suites pass. They cover Worker/SQLite fixture privacy and atomic media sends, composer/media/reply compatibility and session behavior; fixture data is synthetic and SQLite is in memory. No family API was contacted.

The historical `ten-content-bounds-preservation` test pins an older CSS-only release and rejects any later announcement hook; it is not a current-head Mango acceptance test. The rollout's exact current-head inverse proves TEN bytes unchanged. The old lossless test was first run before regenerating gzip and correctly rejected the stale package; final validation regenerates and compares the complete source/gzip bytes directly. Do not report those historical assertions as passing.

Fresh native-browser arrival/audio acceptance remains publisher/reviewer work. No new native voice probe or sample was run because voice research/sample work remains canceled. The reviewed local-voice fallback and source/fixture tests do not certify audible quality, physical iPhone/Safari behavior or every browser's sticky-activation policy. When speech is blocked, reading and OK remain available. Review the rollout with an explicit silent/mock speech engine for automated visuals; do not turn it into a voice-sample experiment.

## Packaging and publication

Apply this patch only to the specified base or port the single hook deliberately if the publisher's head has advanced. After all concurrent merges, run:

```powershell
node scripts/package-main-html.cjs
```

The Worker imports the matching long-name `live/*-app.html.gz`; include the regenerated gzip in the reviewed release. The source patch omits that binary. Verify gunzip equals the merged HTML, run the focused suite and the existing media/session suites, and check that the emitted Worker dependency graph remains unchanged. No bindings, credentials, permissions or database migrations change.

Before publishing, independently review the new real incoming branch, ACK retry/read-state behavior and exact package. Never test by sending a real notice or persisting a family acknowledgment. If cardinal/TEN change first, retain their exact source and port this bounded hook/module onto that head; do not replace the publisher's newer application wholesale. This worker performs no publication.

The standalone implementation lives in `mango/announcement.js` outside the Worker module collection. Its exact bytes are embedded in the runtime HTML and checked by the focused suite; it is not attached as an unused Worker module.

Current-head integration preserves published cardinal/TEN baseline b5ea2817eed02446ce561a74a7cd9774becb01d1 byte-for-byte after reversing only the reviewed presentation block and one hook. All 12 affected suites and fresh silent/mock phone/desktop UI checks passed. Existing worker dependencies, assets, configuration and packaging are unchanged. Screenshot capture timed out; no audible-device or physical-device certification is claimed.
