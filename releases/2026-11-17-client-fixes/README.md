# Separate games may share players

The shared standard-multiplayer invitation flow no longer treats playing or being invited at another table as a global reservation. A deliberate new-game invitation may include the same person in different groups or game types. Completed-send UI cache no longer permanently blocks a fresh deliberate send after refresh failure; pending and uncertain sends retain retry/request protections.

Same-table duplicate invitations, seated-recipient checks, capacity/seat rules, room membership, child policy, recipient deduplication and atomic sender/room/request uniqueness remain enforced. Existing game rows are not edited. MOMopoly's separate shared family-board flow is unchanged and is not made into independent boards.

This recipe changes the packed app and Worker entry only, preserving the other 144 modules, MIME types, assets, settings and all prior fixes. It contains generic patch code and aggregate fingerprints, not a private app, family photos, credentials or module inventory. Exact baseline/output and configuration checks fail closed; previews never upload, and only the existing main-branch CI can deploy. Other publishers must remain paused; the final check is not an atomic global lock.

Tests use synthetic data, actual extracted handlers and isolated SQLite. Native dialog checks make no real invitations. These tests do not establish every game's behavior or full production concurrency under arbitrary failures.
