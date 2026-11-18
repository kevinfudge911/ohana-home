# Mexican Train (real rules) + Bergen — Nov 18 2026

Live on worker `ohana-home`:
- **73582e20** 5:51 PM CT — Mexican Train real rules (server + board labels + rules help + "Quick Mexican Train" choice)
- **af7d6d2d** 5:53 PM CT — shorter board labels
- **0997df41** 5:56 PM CT — Bergen added
Built on 15ad6ae8 (slim chat).

## Mexican Train (new tables have `mx:2` in state; older Mexican tables keep their old rules)
- Double-12 set. Engine sits in the middle: 12|12 in round 1, then 11|11 ... down to 0|0 (13 rounds). Lowest total wins.
- "Quick Mexican Train" (game mode `mexican1`) = one round.
- Deal 15 each for 2-4 players, 12 for 5-6, 10 for 7-8.
- Everyone has their own train; the shared Mexican train is always open.
- Play on your own train, the Mexican train, or any train with an open marker.
- No play: draw once; if still nothing, pass and your train gets an open marker. Playing on your own train removes it.
- A double must be covered before anyone plays anywhere else. The player who laid it goes again; if they can't cover it, the next player must (even on a closed train).
- Round ends when someone goes out or nobody can play with an empty boneyard. Leftover pips are added; double-blank counts 50.
- Round starter rotates each round.

## Bergen (state `bergen:1`, game mode `bergen`)
- Double-six set, 6 tiles each. Lowest double leads automatically (a double lead scores 2).
- Make both open ends the same number = double header, 2 points. If one of those ends is a double = triple header, 3 points.
- Draw until you can play; pass when the boneyard is empty.
- Going out scores 1; a blocked hand gives 1 to the lowest hand. New hands deal by themselves. First to 15 wins.

## How it is applied to live
- worker.js: the wrappers `dominoInit/dominoPlayable/dominoMove` from three-games were renamed `...1`, then `mexican-train-server.js` appended;
  its wrappers were renamed `...2`, then `bergen-server.js` appended. (So live chain: Bergen -> Mexican -> Chicken -> original.)
- app.html.gz: `mexican-train-insert.html` inserted after `<!-- OHANA THREE GAMES END -->`; choice lists gained
  `['mexican1','Quick Mexican Train']` and `['bergen','Bergen']`; label maps gained mexican1/bergen; rules help text updated.
- Tests: `node test-mexican.cjs` (210 robot games) and `node test-bergen.cjs` (180 robot games) need the scratch copies of the server files next to them (see file names inside).

Skipped on purpose: Matador (ends must add to 7, the board drawing assumes matching numbers), Sniff/Five-Up (needs a 4-way spinner board).
