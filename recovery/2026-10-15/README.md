# Ohana Home recovery staging — October 15, 2026

**STAGING ONLY: not a deployable build. Do not merge this branch or deploy it to Cloudflare.**

This branch proves the connected GitHub write path and stores the tested Phase 10 illustrated Meld-help repair as a source patch at `recovery/2026-10-15/meld-only.diff`. The production source is not yet synchronized into this GitHub branch.

Source of truth at preparation: Cloudflare version `3702bf24-826c-4407-b731-f2241041c4f7`, observed from Kevin's own worker export on October 15. The matching saved baseline contains **455 modules**. This repair changes exactly one app.html module; the other 454 module bytes are unchanged. These statements concern the saved source and local testing, **not an independent current Cloudflare API read**.

GitHub `main` was observed at `bed9d9ccb269d471ab39fddcef384d4a7ae66538`, the older September 30 source. Never deploy it over the newer Cloudflare version.

Previously prepared local recovery commits (not present on GitHub main at staging time): `db648420f4f219aedbabd2ca2fd41425ab0a06f7` (baseline sync) and `d40c038cf456e39e1356a68db395beb42287ba01` (one-module repair).

Verified local tests: 120 phone Meld scenarios across ten phases, ten engine examples, syntax checks, and additional workstation/regression cases recorded in the AI Bridge. Physical phone and signed-in live game behavior have not been verified.

Before a push or deployment: obtain fresh Cloudflare deployment/version evidence, compare with saved baseline, back up latest live source, restore *all* current modules to GitHub without replacing newer data, and test public/private family behaviors with permissioned test accounts. Cloudflare deploy is **not included** in this staging step. No credentials or private family data belong in the public repository.
