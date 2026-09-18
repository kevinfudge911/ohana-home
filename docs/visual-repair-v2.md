# Ohana Home visual repair, September 18, 2026

Kevin rejected the first skin: pale panels did not match the approved Spades artwork, and card clarity had regressed.

This repair replaces the first skin with illustrated gold lettering, a generated koa-wood material, gold-edged turquoise tables and jewel controls. The living scene, original character assets, card silhouettes, rules, voices and notifications are preserved. Character source bytes are unchanged.

Card readability: bold opaque rank text; no character filters; larger non-overlapping round cards on phones; separate wild labels that fit inside hand/foot palms; readable discard rank and suit. Settings and game-list text contrast repaired. Mobile game headers compacted.

Only app.html and the scene presentation module were changed in the recovered production package. Backend and all artwork modules are byte-identical to the previous release. No DB changes.

Validation: local Chromium at 390px and desktop, Games/Rooms/Settings/Words/Hand & Foot/Ohana 10; no page errors or horizontal overflow on navigation screens. Distinct hand/foot paths and round card geometry verified; round-card selection works. Inspected full card-hand screenshots to correct wild-label overflow. Ten discard-opening engine regression tests passed. This is fixture UI testing, not a live multiplayer session.

Apply tools/apply-visual-v2.py only to a newly recovered multipart source package; the original main-branch Worker is stale. CSS embeds the two small generated materials, preserving all runtime routing and bindings. Never commit the recovered Worker, which includes private push-signing material.

Generated assets: assets/ohana-wood-v2.webp (warm koa material, no objects/text); assets/ohana-logo-v2.webp (transparent gold OHANA HOME wordmark and hibiscus). Built-in image-generation tool. Original approved porch and character art retained.
