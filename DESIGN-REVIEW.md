# Ohana Home visual upgrade

A warm family game room: ocean teal, honey-colored wood, cream tiles, and a softly lit welcome scene. The house-and-heart mark represents belonging. Larger labels and stronger contrast help players of different ages.

## Changes
- Custom welcome artwork and consistent styling for joining, game lists, all four games, family, and chat.
- One scores/chat panel below the board in normal scroll flow. Back and game title stay above the board. No move-history duplicate.
- Correct 15-column board sizing includes gaps and frame; rack fits narrow screens; pinch zoom is enabled.
- Chat drafts, focus, and game scroll survive game-state rerenders.
- Repository deployment config now points to the existing root worker and imports its HTML and PNG. Existing D1 binding is unchanged.

## Verification and release status
- Cloudflare Wrangler dry-run passed, with the existing DB binding and artwork included (about 2 MB compressed).
- JavaScript parsing and whitespace checks passed.
- DOM checks passed for all four game screens, 225 word cells, single bottom panel, rack selection/placement/recall/swap, chat draft/focus preservation, local sample chat send, Back, and waiting screen.
- NOT visually browser-tested: the cloud browser blocked local preview URLs. Live multiplayer, authentication, production chat, and touch gestures have not been retested. Do not describe these as physically verified.
- Not deployed to production. Review on a phone and desktop before merging/deploying.

## Local design review
Run `python tools/preview.py` from the repo. Open `http://localhost:8765` for a 390 × 844 framed preview or `/app.html` for full width. This uses fictional sample data with local stub responses. It does not contact or modify production family records. It is for visual review; game-rule validation is not simulated.

## Artwork
`ohana-welcome.png` was created with the built-in image generator. Prompt: a realistic, welcoming ocean-side family-home porch at blue hour, glowing open doors, string lights, walnut game table, letter tiles, mugs, empty chairs; warm amber and deep teal; quiet space on the left for HTML text; no people, text, or logos.

## Living porch — September 14, 2026

Preserve BOTH foreground wicker chairs and pillow words **Good Games Brighter People** with red hearts. Do not remove, rephrase, or replace them when revising artwork. Header title stays one small line; the welcome phrase stays subtle in the sky; the verse stays along the bottom edge. Word scores share the tile-count row, never duplicate them in the chat panel.

Production scene lives in ohana-scene.js; copy to ohana-scene.js.txt after editing (Wrangler Text module). Four porch WebP assets were generated with built-in image generation and visually inspected, then encoded as WebP. Prompts: preserve the supplied porch, both chairs, table geometry and original pillow words; restore pillow and two sodas; make identical-camera midday and starry-night lighting variants; make a second game state with both chairs pulled back, changed checker positions and half-finished sodas.

Clock follows America/Chicago, with decorative dawn/day/dusk/night transitions (not local weather or astronomical sunrise). Water distortion is clipped to water. Clouds vary with timestamp/date; base paintings recur, so this is not an infinite library of unique photographic skies. The second furnished state currently transitions around dawn/dusk, when its lighting matches. Motion pauses offscreen and with reduced-motion preference; a pause button is available. /porch provides a public, data-free scene view.

Validation: inline scripts parse; DOM check verified 225 board cells, two compact player scores, one chat panel and preserved chat draft; Wrangler bundle check passed. Authenticated multiplayer visual verification still requires a signed-in family session.

Login and invitation pages now use the same living porch with compact readable controls. Live login visually inspected September 14: both chairs, pillow, small title and verse, fields, avatar selection and submit button visible without overlays. This did not submit credentials or create a test family member.

## Playful buddies and interactions
48 named emoji buddies use the existing avatar storage format. Twelve choices show initially; the rest expand under Meet all game buddies. Selecting a buddy updates its introduction and gives a brief bounce. Chat avatars, current-turn avatars, tabs, tiles and game-card art gain restrained interaction feedback, respecting reduced motion. No database or game-rule change. DOM checks cover all 48 unique choices, selected-state and preview updates, and the existing board/chat checks.

## Inside the game — warm family table
Game header uses a subdued porch sky; a compact character turn greeting replaces the old plain status. Wood frame, cream tiles, rack, compact score badges and illustrated action labels match the welcome palette. Around the table chat has readable cream/sage bubbles and a small 1 Corinthians 16:14 line. Existing board cells, actions, scoring rules and chat draft preservation remain intact. /game-preview is a read-only appearance sample rendered with fictional Alex/Jamie data, contains no credentials or game API calls, and must never be confused with a playable game.

## Movable draft tiles, light and scoring
Unsubmitted word tiles now use pointer drag from rack OR board. Drop on an empty square to move, on the rack to return; invalid/cancelled drops keep the draft intact. Tap a placed tile then an empty square also repositions it. Submitted tiles remain fixed. Tests cover blank identity/value preservation, invalid drops, cancellation and tap movement.

Turquoise/gold perimeter glow stays outside letter faces and respects reduced motion. Existing speech and scoring celebrations are retained; a Voice toggle controls voice/sounds. Last-play panel persists with per-word points and mystery notes for existing history. New history records letter scoring, word multipliers and ordered bonus/mystery adjustments without changing scoring rules. Tested DL/DW plus gift then jackpot: 18 word points +20 gift +38 jackpot =76. Voice celebrations include mystery notes.

## Honu and the ocean playroom
New custom transparent Honu turtle artwork (honu.webp), generated with built-in image generation and visually inspected. Prompt: a premium 3D green sea turtle with plumeria, waving flipper and glowing wooden H tile, isolated on transparent background. Game buddy picks are preserved; Honu is an additional tap-to-speak host. Ocean-glass empty squares replace beige squares; placed letters retain bright cream faces and familiar DL/TL/DW/TW labels. Mystery squares display small animated golden chests. Last-play panel includes an opening chest, rising reward and animated actual score, with Replay the magic; the persistent accounting remains below. New submitted word plays run the reveal and bring it into view. Voice respects the existing mute control; reduced motion uses static effects. Preview allows only host/reward interactions, not gameplay or API writes.

## Turn notification dispatch
Worker fetch now receives its execution context and passes it into the API in a request-local environment object. Existing env.ctx.waitUntil notification calls were previously skipped because fetch never supplied ctx. Test verifies context propagation, task scheduling and no shared-env mutation. Browser push notifications do not expose a custom sound URL; a Stitch notification tone is not implemented by this fix, and physical device delivery still needs end-to-end confirmation.
