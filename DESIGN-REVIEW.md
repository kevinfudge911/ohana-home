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
