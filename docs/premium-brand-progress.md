# Ohana Home premium cartoon branding — first implementation

Approved reference: bright Ohana Spades cartoon beach concept. Preserve hand/foot silhouettes, round Ohana 10 cards, house rules, shared chats, voices, notifications, characters, scene motion, and scripture.

Implemented: new high-quality porch illustration retaining the pillow and object positions; honey headers, aqua/coral controls, bright panels, rooms, profiles, chat dialog, game surfaces, and preserved card silhouettes. The animated scene keeps its existing Central Time lighting and motion.

IMPORTANT: production browser HTML is newer than main (de06f85). It has Ohana 10 and shared chat changes absent from the saved backend. Do not deploy this branch's worker.js. design/premium/app-current-styled.html is recovered current public browser HTML with a CSS-only addition, not a recovered full Worker.

Apply tools/apply-premium-brand.py only against the matching current source after recovering it. This script guards current feature presence, preserves all scripts, and creates local backups. Existing app.html and Worker on main remain unchanged in this patch branch.

Validation: exact byte comparison confirms all production script blocks and existing markup preserved before CSS insertion. Local Chromium screenshots exercised home, Rooms, Settings and Words at 390px; those views had no document-level horizontal overflow. This is visual/fixture QA, not live multiplayer, notifications or complete game-engine testing. Spades gameplay is not implemented by this branding patch.

Blocked: automatic approval review rejected using the Drive Cloudflare all-project master token to read the current Worker and settings, citing broad credential scope and insufficient specific authorization. No Cloudflare change or deployment attempted after rejection. User approval needed for that specific Ohana-only access and publishing workflow.
