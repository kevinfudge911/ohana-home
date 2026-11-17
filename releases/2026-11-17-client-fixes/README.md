# Mahjong solitaire accessible focus and hints

Five guarded client edits retain focus on the same tile or Hint control during synchronous redraw, announce the coordinates of the existing visible hint pair, and name hinted tiles. Focus restoration stops if the game changes, a modal/new focus takes over, or the target is absent, hidden or disabled. A duplicate legacy toast announcement is removed while retaining visual feedback and the modal-aware status announcer; unrelated turn and chat announcements remain unchanged. Family Mahjong, match payloads and game rules are unchanged.

The app-only recipe preserves the other 145 modules, original MIME types, operational settings, assets and all prior fixes. Public files contain only patches and aggregate fingerprints, not private source, family photos, credentials or a module inventory. The reviewed publisher checks exact input and output; previews never deploy. Only existing main-branch CI can upload. Other publishers must remain paused; final drift checks are not an atomic global lock.

Synthetic renderer and Windows Chrome viewport tests do not establish physical iPhone VoiceOver behavior or full-game accessibility. No real moves are made for QA.
