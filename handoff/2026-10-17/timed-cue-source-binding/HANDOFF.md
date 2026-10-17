# Timing draft browser retest — 2026-10-17 05:50 UTC

Production music remains929selections; baseline app8c6b2a950df14e272c864108f4bece1ff487bdfe,worker4c04306bf8ae95be043415b1da312964d43a46f0. Query-only synthetic canarye66927cfc5717b8ba2769e18d961290efa751bf3 passed Cloudflare deployment and ordinary public Home startup.80086Bfixture,866126Btemporary worker. No family song/account data, production cue API/D1 changes or PuzzleRoom/bindings changes. CSP blocks network connections.

Actual responsive Chrome browser checks: before activation optedInfalse,cueRequests0. Saved1.50–2.50 and BOTH outer/editor statuses read Temporarily saved1marked ranges, correcting the earlier stale status. Continuous generated-tone playback observed time2.244/pausedfalse/desired1/effective0 then time2.847/pausedfalse/desired1/effective1 in one conditional DOM observation. Paused and deactivated: time3.238/optedInfalse/pausedtrue/desired1/effective1. Sampled browser errors empty. Earlier immediate post-click read showed stale100msdiagnostic; fresh snapshot and conditional read confirmed completed opt-out, not a runtime failure. Native volume diagnostics are NOT audible suppression proof. No physical iPhone/Safari/Android test.

Private source binding regenerated deliberately against929canonical songs and22external recordings across St.Peter,HMG,Incompetech. Exact map98839B; private worker888260B,delta102790B. Actual SQLite source tests PASS22external exact originals plus swapped/modified URLs, custom ACL/revocation/deletion/source changes and owner isolation. Global normal song-source validator unchanged. Filename external20.json is historical and now holds22. No API deployment.

This cleanup commit restores verified baseline worker and removes the synthetic query page. Require deployment success/fresh normal Home startup before declaring cleanup live. Canonical files remain baseline929app/worker. All929songs remain unmapped; no automatic profanity detector or whole-library clean claim. Manual timing feature still not in production. Remaining audible/device/mute/background/rate checks and real opt-in integration are unfinished. Older manifests/full candidates are superseded, never copy over canonical.

Historical implementation notes follow; current counts/bytes above supersede them.

# Exact recording binding for manual cues — private source draft

Canonical source inspected: app6306082B / worker785386B,927 built-in songs. Exact authoritative927 ID→stream map generated from decoded canonical jb-tracks catalog; worker built-in ID set parity checked.20 external recordings accepted (original7 St.Peter hymns +2 HMG +11 added St.Peter hymns).

Map module98,583B. Private worker887,920B; delta102,534B (map plus cue API/dispatch). No canonical files, browser, production DB, source media, Durable Object, bindings or migrations edited. Global ohanaMusicStream remains exactly unchanged and still rejects non-Suno URLs for normal track creation.

Cue POST: built-in ID must use exact catalog URL; custom track must be readable to authenticated member in current room, nondeleted, and requested URL must exactly equal that DB row's stream_url. No arbitrary host acceptance or URL normalization. Matching built-in external streams work without weakening global track validation. Owner remains authenticated listener; request-supplied owner/member IDs ignored. Changed-recording idempotent request conflicts409 instead of returning stale recording as a successful retry. Existing revision/range protections retained.

Files: builtin-streams.json / builtin-map.js / external20.json / map-manifest.json / api.js / source.js / patch.json / worker.js / scope-proof.json / evidence.json.

Reproduce source draft:
1. node work/timed-cue-source-binding/extract.cjs
2. node work/timed-cue-source-binding/build.cjs [current-worker] [catalog-app]
3. node work/timed-cue-source-binding/check.cjs
4. node --check work/timed-cue-source-binding/worker.js

Build fails if catalog app hash or worker built-in IDs differ from generated manifest; regenerate/review when sources change. Exact inverse removes only dispatch insertion plus appended map/API and restores full input worker.

Actual existing music API + real SQLite tests PASS: all20 external recordings, Suno built-in, swapped official song URLs, modified same-host URL, junk/nonstrings/unknown ID, auth/membership/owner isolation, custom private/selected/room/revoked/deleted access, changed custom recording, stale idempotent recording request, range bounds. Node syntax passes. These are source/API tests, not browser/audio/device verification.

Still private: no default-off allowlisted runtime canary or acoustic timing proof added here. All927 recordings remain unmapped/unverified; this does not detect or remove profanity automatically. Cues remain listener/room/song scoped. Existing ACL checks are request-time checks; concurrent source/ACL changes between read and write are not claimed transactionally atomic. Client must continue matching cue stream to current recording before playback.

