# Held saved-games code-only release recipe

LOCAL CANDIDATE, NOT APPROVED OR DEPLOYED. Independent review and sole-publisher authorization required.

Apply Granny and Journey listing patches to exact existing client; patch existing MOM server routing; add saved-game read adapter. Preserve every other existing module including worker and chat-v2. No database or schema operations in publisher. Upload uses content-only endpoint, preserving operational bindings/settings/runtime.

`node release.mjs offline <private-export-directory>` verifies pinned private export and generated output without network. `check` reads existing deployment. `deploy` additionally requires existing main-branch Workers Builds CI environment and rechecks exact baseline, deployment, settings immediately before content PUT. Postwrite verifies aggregate, settings, runtime, and sole100%version. No source, private inventory, identifiers, or credentials from live exports belong in this directory or Git. Only this recipe directory is potentially shareable after review; its parent contains private exports.

Expected baseline146 modules, output147. Two changed (client and MOM server);144 existing modules byte/type preserved; one new module added only if name absent. Exact aggregate includes every name, type, and content hash. App52 inline scripts and both changed/added server modules syntax checked. No automatic rollback; after any attempted upload inspect current state before retry.
