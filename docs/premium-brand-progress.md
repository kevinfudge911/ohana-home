> Correction, September 18, 2026: Kevin explicitly rejected the pillow phrase "Good Games Brighter People". Any approval claim below is an erroneous historical assistant claim, not a user instruction. Follow OHANA-DESIGN-MASTER.md.

# Ohana Home premium cartoon branding — first implementation

Approved reference: bright Ohana Spades cartoon beach concept. Preserve hand/foot silhouettes, round Ohana 10 cards, house rules, shared chats, voices, notifications, characters, scene motion, and scripture.

Implemented: new high-quality porch illustration retaining the pillow and object positions; honey headers, aqua/coral controls, bright panels, rooms, profiles, chat dialog, game surfaces, and preserved card silhouettes. The animated scene keeps its existing Central Time lighting and motion.

IMPORTANT: production browser HTML is newer than main (de06f85). It has Ohana 10 and shared chat changes absent from the saved backend. Do not deploy this branch's worker.js. design/premium/app-current-styled.html is recovered current public browser HTML with a CSS-only addition, not a recovered full Worker.

Apply tools/apply-premium-brand.py only against the matching current source after recovering it. This script guards current feature presence, preserves all scripts, and creates local backups. Existing app.html and Worker on main remain unchanged in this patch branch.

Validation: exact byte comparison confirms all production script blocks and existing markup preserved before CSS insertion. Local Chromium screenshots exercised home, Rooms, Settings and Words at 390px; those views had no document-level horizontal overflow. This is visual/fixture QA, not live multiplayer, notifications or complete game-engine testing. Spades gameplay is not implemented by this branding patch.

Published after Kevin explicitly authorized the saved key for Ohana Home only. Recovered the exact active multipart Worker and settings; changed only app.html, the island image, and the scene image URL for cache refresh. Worker module SHA-256 remained unchanged. Original D1 binding preserved; no database changes.

Active version: e792c4ac-b165-4e1e-ac8e-38e924f9616f (100%). Live HTML, WebP and scene script matched local tested bytes after publishing. Public live page loaded in Chromium at 390px with no page errors or horizontal overflow. Local fixtures also verified distinct hand/foot paths, round card shape, and round-card selection.

Raw recovered backend contains deployment credentials and must not be added to GitHub. Keep the frontend patch separate; future deployments must recover and preserve the matching live Worker. This patch does not add Spades gameplay.
