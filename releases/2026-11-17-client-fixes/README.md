# Reviewed porch and game-list repair

This release updates presentation code only: it preserves the My Games expanded state during background synchronization, lists supported active games in which the signed-in member participates, and improves the MOMopoly turn display. Separate Classic and puzzle lists use existing authorized GET endpoints and existing guarded navigation. The puzzle endpoint retains its existing automatic archival of completed puzzles. No new game-move, invitation, reset, database-mutation or R2-write endpoint is added; publication changes code, not active game state.

The source package contains public patch code and owner-approved aggregate verification fingerprints. It contains no credentials, family photographs, live participant data, exported application source or private asset inventory.

The existing GitHub-to-Cloudflare build runs the content-pinned publisher. Preview runs are read-only. Main may replace only the exact reviewed client module while preserving every other module and original MIME type. Operational settings and full runtime metadata remain pinned. Only Cloudflare's volatile descriptive `annotations["workers/message"]` is excluded from the settings comparison.

Missing existing build credentials, changed source, changed settings or mismatched output stop the release. An exact already-live release exits without uploading. Publication is not atomic compare-and-swap: coordinate other publishers and verify before and after. Future fixes require a fresh reviewed recipe; never fall back to stale full Wrangler deployment.
