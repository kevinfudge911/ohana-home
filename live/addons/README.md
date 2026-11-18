# Live add-ons injected by worker.js (Nov 18 2026)

The live Worker (ohana-home) adds these to the app page at the end of `<body>`.
In the live worker.js the chain is:

```
function ohanaAddJoke(...a){return ohanaAddODL(ohanaAddOCF(ohanaAddHF4(ohanaAddJoke0(...a))))}
```

`ohanaAddJoke0` is the original joke pop-up add-on (Nov 18 7:35am CT, 90aabb4d).
`ohanaHF4Css()/ohanaHF4Js()` and `ohanaOCFCss()/ohanaOCFJs()` return the files below as strings.

- `hf4-table-seats.*` (live 09a54556, 9:51am CT): Hand and Foot with 3-4 players. Opponents sit left, top, right in turn order, each a small seat with hand/foot count and one mini card per meld with the count underneath (clean red, dirty black, gold when a book). Draw and discard stacked in the middle with counts underneath. Tap a seat to open that player's full laid-down cards; tap again, the X, or outside to close. 2-player layout unchanged.
- `ocf-card-faces.*` (live 5d27abf0, 9:59am CT): card faces in every card game get a light hologram fill; the harvest art layer (cross, pumpkins) is faded to a watermark (card backs untouched). Spades: big rank and suit, a soft gold cross with warm light behind the animal, and the hand fans to fit the screen with no arrows or scrolling.
- `odl-domino-board-low.js` (live ca1aa26f, 10:05am CT): dominoes. The played tiles sit at the bottom of the board, right above the player's workstation (hand tray), instead of starting up under the header. Uses the CSS `translate` property inline with !important, measured from the tiles, so it grows upward as tiles are added.

CSS note: the live styles sit in `@layer ohanaApproved` with `!important` and very high ID specificity (up to 17 IDs). Overrides must go in the same layer with a higher-specificity `:is(#x...,*)` prefix (30 IDs used here).

Note: repo live/worker.js is a formatted copy that does not yet contain the joke add-on or these hooks; the live script is minified and is the source of truth.

## oan-game-motion.js (live in 857c026a, Nov 18 2026 10:24 CT)
Light animation for games that had none, wired as `ohanaAddOAN` (outermost in the ohanaAddJoke chain), script id `ohana-oan-js`.
- Card hands deal in with a soft stagger when a game opens or a new round is dealt (Spades, Shuffle, Ohana 10, Hand and Foot).
- Spades: played cards slide into the trick. Shuffle: drawn cards rise in, discard drops, new meld cards slide in.
- Memory: cards flip when turned over or back; matched pairs give a small pop.
- Checkers: the moved piece slides from its old square; captured pieces fade out; kinging pops.
- Tic-tac-toe: new marks pop in. Every game: the end-of-game box bounces in (skipped where it already animates).
- Uses the Web Animations API with the individual translate/scale properties, so it never fights existing transforms. Honors reduced motion.

## ocf-card-faces.css update (857c026a)
Ohana 10 cards get the same light hologram face and big, haloed numbers (draw pile back left alone).
The end-of-game box (`#game .winbox`) sits above the board, so Memory's "It's a tie! / Play again" box is no longer hidden.
