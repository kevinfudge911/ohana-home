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
