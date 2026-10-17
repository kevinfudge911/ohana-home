# VAPID exposure remediation — private candidate, NOT rotated or deployed

No credential values are included here or in patch metadata. Candidate worker removes the exposed private/public declarations; candidate browser removes its fixed old public-key declaration. Historical copies and Git history are NOT rewritten. Generated test credentials exist in memory only and are not persisted. Canonical source, Cloudflare secret configuration, actual subscriptions and push delivery unchanged.

## Actual chain repaired

`notifyMembers` / `notifyTurnIfAway` receive explicit request environment, through every call site. `sendPush` passes environment into `createVapidJwt`. Signing reads `OHANA_VAPID_PRIVATE_KEY` and matching `OHANA_VAPID_PUBLIC_KEY` from environment, validates lengths/format and verifies its signature with configured public key to reject a mismatched pair before send. Missing secrets fail closed; no fallback to exposed credentials, no subscription deletions for configuration failure. Existing encryption, provider origin/audience, payload and expiration behavior preserved.

Authenticated GET `/api/push/public-key` validates the pair and returns **public key only**, no-store. No private key/JWT returned. Browser fetches it through existing authenticated api helper before subscription work. Setup detects stale/missing applicationServerKey and displays reconnect instruction without automatically unsubscribing. User Enable fetches configuration before touching existing subscription and uses current public key. Registration includes public key so stale cached browser cannot mark an old-key subscription ready. No bulk deletion/migration of database rows; ordinary existing404/410 expiry cleanup remains.

Nine synthetic source/function tests pass, including actual P256 signing verification, claims, malformed/missing/mismatched key rejection, client current-vs-old matching, explicit env propagation, credential removal and unchanged PuzzleRoom class. Syntax passes. No real network, pushes, family subscriptions or data changes; no physical/browser confirmation.

## Safe configuration / publication sequence

1. Restore a supported Cloudflare management route. Current browser is unavailable and CLI installation failed due to DNS; **do not deploy this candidate unconfigured** and do not bypass network restrictions.
2. Generate fresh production P256 keypair in a trusted local process, with private material sent directly to Cloudflare encrypted Worker secret input. Never print it, put it in command arguments, files, Git, handoff, terminal logs or ordinary environment configuration. Configure both named values as encrypted secrets to avoid secret-bearing source/config files; public material is safe to expose only through the endpoint. Never reuse synthetic keys or exposed pair.
3. Merge these source changes against latest app/worker, preserving all newer work and imports. Deploy once secret names are configured for the same worker/environment. If secret management changes the live worker version, verify ordinary startup between steps. No PuzzleRoom bindings/lifecycle/storage/class changes.
4. Confirm normal public startup; authenticated public-key endpoint returns public-only response and correct current key. Verify missing/mismatch configuration gives unavailable, not private details. Re-enable a designated owner's device using normal UI, then authorized single test push; physical-device delivery still requires confirmation. Do not send family-wide notifications as a test.
5. Tell members their device may need “Enable notifications” once because security keys changed. Old subscription provider associations cannot be rebound server-side. Preserve family records, puzzle state and user preferences. Do not bulk delete subscription data as a shortcut.
6. Record fresh-key setup/deployment confirmation without values. Then address GitGuardian alert/history exposure separately, with deliberate approved history plan if needed. Removing source literals does not itself retire the old provider associations; subscribers re-enroll with new application-server key. No evidence established abuse or access to puzzle data.

## Files

`build.cjs` reads original credentials only in memory while replacing the declarations; it never serializes/prints their values. `worker.js` and `app.html` are sanitized private candidates. `key-config.js` and `client-key.js` are small integration helpers. `scope-proof.json` contains hashes and operation names only. `check.cjs` generates fresh in-memory synthetic test keys; `evidence.json` records outcomes only. Do not transplant old whole app over root's newer repairs.

