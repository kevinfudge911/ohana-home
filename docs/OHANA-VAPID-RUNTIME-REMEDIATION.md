# Same-key notification runtime cleanup

Kevin explicitly authorized moving the same existing Ohana notification private key into Cloudflare encrypted Production storage. No key rotation or family re-registration is authorized or required by this change. Existing public historical copies remain exposed; this cleanup does not revoke them or make the old key newly confidential.

## Confirmed configuration and coordination

On 2026-10-19 the signed-in Cloudflare dashboard accepted the single Production-only `VAPID_PRIVATE_KEY` Secret using Add 1 variable and deploy. An independent Settings view confirms the name, type Secret and Value encrypted. DB (D1), MUSIC_FILES (R2), and PUZZLE (Durable Object) remain present. The value was transferred privately from the existing local source and never printed, sent to GitHub, or put into a tracked secret file. No access credentials were created. Music holds its publication lane until the matching source deployment is verified and explicitly released.

The publication baseline is main `d2bf931faba47af787ba5f31acb74d0d92fd0e71`. This patch changes only both Worker source copies, three notification tests, a key-free transformation tool, and this report. It preserves the current app HTML/catalog and all unrelated work.

## Source behavior

Both `live/worker.js` (the configured entrypoint) and the older root `worker.js` import `env` from `cloudflare:workers`. Signing reads only the encrypted `VAPID_PRIVATE_KEY` binding per call, validates its shape and decoded length, and has no embedded fallback, cache or logging. Missing/invalid configuration stops before encryption or delivery and preserves subscriptions. The public VAPID key, browser subscription flow, notification status/retry handling, payload encryption and expired-subscription handling are unchanged.

## Verification

- `node tests/vapid-runtime-secret.cjs`: both actual Worker signing/encryption blocks pass. Synthetic JWTs verify independently; RFC8291 payloads decrypt independently. Missing/invalid binding does not encrypt/fetch or delete saved subscriptions. All delivery is mocked.
- `node tests/push-delivery.cjs`: synthetic signing fixture passes existing signature, payload and urgency assertions.
- `node tests/vapid-same-key-compatibility.cjs`: the existing scalar derives the unchanged Worker/browser public point. No token signing, key output, network, or subscription writes. Code after the signing block remains byte-identical to the baseline.
- Both Worker syntax checks and `git diff --check` pass.
- Fresh merged-main Wrangler dry run passes: 64,989.06 KiB / gzip 60,001.07 KiB, with the existing three resource bindings. No dry-run upload occurred.
- Production application startup and final active Worker version will be recorded in the handoff after the source deployment. Real-device notification delivery remains unverified; no real family notification was sent.

## Prior publication block and remaining exposure

GitHub public main contained this existing private literal in both Worker copies. During the earlier survey preparation, a full Worker blob containing it was uploaded as unreferenced object `4202eaa5346f3d4a0f1c3a8cdfc52079566837c2`; no survey tree, commit, branch, ref update or deployment followed. Automatic review denied the secret-containing tree creation. That operation remains stopped. The current publication uses sanitized final source only, under the later exact storage/source-cleanup authorization. No history rewrite or repository privacy change is included. Historical copies and the earlier uploaded object remain exposed; no evidence of misuse was established.

`tools/remove-hardcoded-vapid.cjs` removes the old definition without containing its value and validates both files before writes. Raw removal diffs can reproduce the old value, so no such diff is exported or printed.

The family survey remains isolated on `survey/family-preferences`, commit `fa30b664a31750213f264888886bace5780a732d`, with implementation `3d8f7c0754f11e8aa4d9b3f8be6b1d6b62c416b1`. It is not part of this notification publication and waits for the parent's lane release after Shuffle.

References: [Cloudflare bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/#how-to-access-env), [encrypted secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [matching Push subscription signing pair](https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe).
