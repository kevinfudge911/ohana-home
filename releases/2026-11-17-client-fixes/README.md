# Spades replay on the existing table

This isolated client-only patch keeps card and trick replay animation inside the normal seated Spades table instead of creating a separate brown screen. First entry renders the existing table under the busy gate. Missing or replaced replay hosts interrupt safely without marking an unseen event complete. Existing gameplay, scoring, winners and server code remain unchanged.

The existing main-branch GitHub-to-Cloudflare publisher performs content-pinned checks of every module byte and MIME type, operational settings and runtime metadata. It changes one packed client and preserves 145 other modules, including the privacy-filtered chat worker. No database/schema operations or game moves are performed. Preview runs check only; main runs check then deploy. The other saved-game branch is not included.

The recipe contains public patch code and aggregate fingerprints only, never the private app export, family images, credentials, private module inventory or account identifiers. Deployment checks for drift immediately before upload and verifies exact output afterward; coordination is not an atomic cross-service lock.
