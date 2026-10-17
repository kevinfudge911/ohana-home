# Nashville Roadhouse — verified live

Release: 7c9ca4603f2956cca0938dea28911366bb33624a. Cloudflare Workers build succeeded. App blob: 5a5e0d6bad9cdeb2aa956628f6f78f6876364d6d. Worker unchanged.

The original 1280×960 JPEG is preserved exactly, without cropping or recompression. SHA256: 5b383827f10e633bc04095a93c2ec1e809aa1154103144b4b536d41d57738204. All 907 catalog records are unchanged.

Live responsive Chrome checks passed at 390×844 and 844×390:
- Home loads normally; Music shows the photograph in a wood frame at the existing upper-left wall-picture position. Original room artwork and four musicians remain visible.
- Tapping the frame opens the complete original photo with a readable Nashville Roadhouse caption. Portrait caption is 20px; landscape is 18px. Home and Close remain visible, with 48px-high controls. No horizontal overflow.
- Close, Escape and browser Back close only the photo and return to Music. Photo Home returns to the porch. Reopening Music shows no stale viewer.
- Opening the photo preserves ongoing playback: Dear best friend by Fudgiepie reached readyState4, duration323.2, time2.79 and remained playing. Playback was paused again after the test.
- Expanded library Song+, Playlist+ and Mine targets now measure44px high. No catalog additions, account writes or song edits were made.
- Sampled browser error logs were empty.

Evidence: live-room-390x844.png, live-viewer-390x844.png, live-viewer-844x390.png. Screenshots were visually reviewed.

These are responsive browser checks, not physical iPhone/Safari certification. The broader saved iPhone audit and pending work remain in docs/OHANA-IPHONE-AUDIT.md and docs/OHANA-MASTER-HANDOFF.md. Private localhost and file previews remain unavailable under session policy; this release was source-reviewed and then verified through the authorized public deployment.

