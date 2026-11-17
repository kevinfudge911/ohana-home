# Puzzle initial picture fit and camera controls

This client-only patch opens the whole puzzle at the largest fit within its actual canvas, instead of shrinking it to include distant loose pieces. Fit puzzle, zoom in/out and the separate all-pieces view are camera-only. Automatic fit follows resize until manual camera interaction. In short landscape, the existing puzzle header and scrollable workstation move into a left rail so the canvas keeps usable height; portrait restores the prior layout. Saved piece positions, puzzle progress, server code and game rules stay unchanged.

The existing content-pinned GitHub-to-Cloudflare publisher checks every module byte/MIME type, operational settings and runtime metadata, changes one packed app and preserves145 other modules. No database or schema calls. Preview runs check only; main runs check then deploy, with drift checks and exact post-release verification. This is coordinated, not an atomic global lock.

Only generic patch code and aggregate fingerprints are public. No private app export, family photos, credentials, account identifiers or private module inventory are included. Held Granny/Journey and the separate private-only Spades landscape changes are excluded.
