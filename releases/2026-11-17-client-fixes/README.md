# Optional new-game Mahjong claim window

This reviewed Git-triggered recipe changes only the app and Worker entry. It preserves all other modules, MIME types, bindings, assets and operational settings. It does not migrate game state or edit active games.

New Mahjong setup and invitations offer explicit relaxed-claim modes with a 120-second maximum response window. Existing classic and eight-round choices retain their 15-second default. Existing pending claim deadlines are not rewritten, and responding players still allow the normal early resolution. Invitations disclose the selected accommodation. No automatic selection of the relaxed mode occurs.

The public package contains patch code and aggregate fingerprints, not a full private app, family photos, credentials or private module inventory. The publisher reads the private baseline in memory, validates it and the exact deterministic result, and permits deployment only from the existing main-branch Workers Builds workflow. Preview/check mode never uploads. Drift fails closed. Other publishers must remain paused; the final recheck is not an atomic global lock.

Offline and synthetic/native-browser tests are not evidence of real iPhone VoiceOver behavior or a complete accessibility audit. No real games or invitations are created for QA.
