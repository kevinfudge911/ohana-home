# Reviewed Ohana client patch recipe

Independently reviewed client and response-fix publishing recipe. The owner approved public disclosure of the technical verification fingerprints, publisher code, documentation, fix code and cartoon artwork on 2026-11-17.

This package contains public presentation code, generated cartoon room artwork and one-way aggregate integrity fingerprints. It does not contain account IDs, deployment/version IDs, the private module inventory, exported application source, family photographs or credentials. Private live modules are obtained and checked in memory by the existing account's build job. A fingerprint cannot be decoded into an inventory.

The target account must come from the existing Workers Builds `CLOUDFLARE_ACCOUNT_ID` environment. The existing `CLOUDFLARE_API_TOKEN` authenticates only to that account's Cloudflare API. Missing account or credential stops the job; this recipe does not obtain, store, broaden or print credentials. Availability of those environment variables in the actual build is still unverified.

The worker name is the already-public `ohana-home`. Each private module's name, original content type and byte hash contributes to a sorted aggregate fingerprint. The approved baseline fingerprint must match before patching. The exact candidate fingerprint must match afterward, so neither unrelated modules nor original types may change. Operational settings and full runtime metadata are separately pinned through aggregate hashes. The only ignored settings field is the descriptive `annotations["workers/message"]`, which Cloudflare replaces on code upload; every other field remains checked. No identifier or private inventory is logged.

Commands: `node release.mjs check` is read-only; `node release.mjs offline PRIVATE_EXPORT_DIRECTORY` checks a local private export. `deploy` is allowed only in the existing main-branch Workers Builds environment. It uses the code-content endpoint, not a stale full Wrangler deployment, and checks the private result after upload. The MOMopoly server response also corrects one CSS selector to show its existing administrator-only New game control. It does not change the R2 object, authorization, or the existing two-tap archival action. No game moves, database/schema changes, family-room actions or asset-namespace replacements are included.

The upload is not atomic compare-and-swap. Coordinate other publishers, recheck immediately before write, and reject drift. Post-upload checks require an unchanged observed deployment during verification. Browser interaction and static-asset checks remain necessary; automated API fingerprints are not physical-device certification.

Preview builds run read-only checks. Advance main only after the exact staged recipe passes checks; production publication must then pass verification.
