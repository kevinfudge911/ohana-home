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

