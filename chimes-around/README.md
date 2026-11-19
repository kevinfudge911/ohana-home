# Wind chimes all around (live ae90cb7f, Nov 19 2026)

Why they stopped at the entrance: the nine V6 chime designs (renderer, art, scene contract) were built and are
served by the worker under /wind-chimes/, but the app hookup was left switched off ("V6 ABSENT; LISTENING GATE
CLOSED") waiting on a design okay, so only the entrance chime ever showed.

What this adds (inserted in app.html right after `<!-- OHANA MESSENGER CHAT END -->`):
- Loads /wind-chimes/renderer-v6.js and hangs two designs from the top corners of every screen.
- Each tab (games, faith, family, rooms, settings), each category room and each game type gets its own pair.
  Home = "In Memory of Daddy" + garden bells.
- Gentle sway with a gust every 9 to 23 seconds. Still if the phone asks for reduced motion.
- Pointer-events none; moves inward or shrinks if a button is under it, hides rather than cover one.
- Sits behind game tables (z 60); above a category room dialog (z 76) only while that room is open.
- Visual only; the entrance ring sound is unchanged.
