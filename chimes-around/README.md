# Wind chimes all around (v2 live ef2cd28b, Nov 19 2026)

v1 (ae90cb7f) hung two chimes from the top corners of every screen. Kevin: they covered buttons, sat up in the
control panel, and there were two in one window. v2 fixes that.

What v2 does (block in app.html between `OHANA CHIMES ALL AROUND START` and `END`):
- ONE chime per area, never two in the same window. Visual only: no chime sounds added anywhere
  (the entrance ring sound in Ohana Gathering is unchanged).
- The big cardinal chime ("In Memory of Daddy", memorial-study) hangs only at the main entrance (home).
- The other designs are spread out: faith crystal-cascade, family garden-bells, rooms bell-quartet,
  settings crystal-duet; each game type its own (spades crystal-cascade, hand and foot garden-bells, etc.);
  category rooms get one picked from the rest.
- Hangs low (30 to 42 percent down the screen first) in a window of the scene art. A spot is only used when every
  sample point looks down to the big background without hitting a button, a pointer, words, a picture or a panel.
  If no window spot is open (busy game tables, rooms filled by a card picture), the chime simply doesn't show.
- Gentle sway with a gust every 9 to 23 seconds; still if the phone asks for reduced motion.
- z 60 (z 76 only while a category room is open); pointer-events none.
