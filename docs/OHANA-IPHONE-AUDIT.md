# iPhone-size audit — October 16, 2026

The screenshot repairs are published and verified. This audit used responsive browsers, not a physical iPhone or Safari.

## Passed on the live site

- **Signup:** the iPad form now scrolls to Join and Sign in. At1024×768,390×844 and844×390, Join is reachable,44px high and receives taps. No account was created.
- **Room entrances:** Home, Journey, Shuffle and Tile load their original artwork at normal proportions. Phone, tablet and landscape checks found no horizontal overflow. Setup Home/Back controls worked; no game was created.
- **Bridge and room guides:** Home and Okay stay visible; pictures and instructions no longer overlap. Bridge and Blessings were checked in portrait and landscape. Okay returns to the room; Home returns to the porch.
- **Updates:** Home, Previous, Next and Close are visible in both orientations. Page changes preserve checkbox state. Home closes Updates and Bridge correctly.
- **Jukebox:** search, banks, filters, brief real playback, pause, next/previous, shuffle, mute and volume passed the earlier live smoke test. The new empty-Mine explanation is visible.
- **Other navigation:** Bible reader opens all11 saved verses; Memories loads photos and turns pages; Memories, Blessings and Granny return Home.
- Sampled browser error logs were empty.

## Still open

- Two library buttons remain40px high because a later style overrides the intended44px rule. A small correction is staged.
- The full Android/browser Back repair is a private draft and is not published.
- The Bible's denser printed-page design remains unpublished and visually unverified.
- Additional family songs and timed profanity fades are not live. The existing907 recordings are not certified clean.
- Physical iPhone keyboard, safe-area, pinch, audio and background-play behavior remain untested. Chrome sizing cannot certify them.
- This was not an exhaustive playthrough of every game, every song or every account-write operation.

## Release and evidence

Verified application release:3b756472ad607de91c45ed663a535dc1e92267f2.
App blob:6515cd9af067208c9bc4c29b3c8d228d91c6cebd.
Worker unchanged during these screenshot/audit fixes.

Local evidence is saved in outputs/signup-ipad-fixed.png, work/iphone-entry-audit/, work/bridge-guide-exit-repair/, work/all-guide-exit-repair/, work/updates-exit-repair/ and work/music-live-preshow-audit/.

No production accounts, invitations, messages or game moves were created during these checks.
