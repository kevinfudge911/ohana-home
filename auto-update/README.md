# Auto update + Daddy flies more (live 5b17d0d2, Nov 18 2026 3:40 PM CT)

## Phones pick up new versions by themselves
- **worker-build-stamp.js** is appended to the live worker.js. `/__ohana-build` answers a fingerprint of the app page (hash + length), worked out once when the worker starts. Any future deploy that changes the page changes the fingerprint automatically.
- **ohana-auto-update-v1.html** is inserted in the app page right after the Daddy flyer script. When the app comes back to the screen (after 4+ seconds away) and the fingerprint changed, it quietly reloads to the new version. It never reloads while someone is typing, a dialog is open or speech is playing, and at most once every 2 minutes. Game state lives on the server, so nothing is lost.
- Why: the service worker keeps no cache and the page is served no-cache, so the old screen only stuck around because phones kept the app open since before a deploy.

## Daddy's Cardinal v2 (cardinal/daddy-cardinal-game-flyer-v1.js, same script id)
- Now also flies on the home screen and other rooms where the sign is showing (the old visits flyer is paused with reason `flyer-active` while this one runs, and resumes when it stops).
- Leaves the sign often: perches 0.7-1.8 s at the sign, 1-2.8 s elsewhere (was 2-6.5 s).
- Long roaming flights: 42% of trips are 2-4 legs through open air across the whole screen with no landing in between; 20% fly off screen and come back 1.2-3.5 s later, often roaming in.
- Still all compositor animation, pointer-events none, never perches on cards, tiles, dominoes, chips or buttons (bigger list of class names now; containers bigger than 30% of the screen are not treated as blockers).
- Songs: a little more often (gap 3.5 s, chances 0.5-0.55), same 60 songs. Keep-perched and Cardinal motion settings still stop him.
- Tested live at 390x844: home 9 flights in 30 s; domino game 289 (view only) 8-10 flights in 20-24 s.
