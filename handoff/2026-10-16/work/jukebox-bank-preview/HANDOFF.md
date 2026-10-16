# Private Ohana TSCMS digital command center

Current release status: NOT PUBLISHED. Root owns publishing. Do not copy this whole private app over future shared updates.

Bounded builder: node work/jukebox-bank-preview/build.cjs <latest-app>
Current base work/bridge-hf-room-release/app.html. Output app.html; only script#ohana-tscms-release-v1 changed. Backend/auth/catalog907 unchanged. CSS and banks.js inject into same existing reader closure. Root preview8841 session52381 uses isolated ACL backend.

Current implemented preview:
- FIRST user reference, Digital Nostalgia computer-size touchscreen direction. Dark backlit teal/coral song banks within walnut/brass cabinet face, all search/playlists/library/transport/filter/volume on same touchscreen.
- No external physical keys or hinges (earlier refs2/4 direction superseded).
- 2-column fixed banks, Titles Prev/Next, no vertical song-list scrolling in listening mode. Mine management retains scrolling. Small bank swipe respects reduced motion.
- Underlying current filter/playlist queue and ACL untouched; only slice rendered titles. Existing Mine/Song+/Playlist+ controls moved together under Library disclosure, handlers preserved.
- Dad cardinal remains free, no frame. Grounded cabinet and music room artwork untouched.

Actual browser checks8841:
- Native986x550 bank1→2→1; Sunday Best97. Original907 before filter.
-390x844 eight titles, overflow hidden and scrollHeight<=clientHeight. All original controls on screen. Final header spacing CSS refinement needs screenshot refresh (previous title overlapped logo; now170px left inset/18px type).
- Add Song opens original form; default Only me; Selected people shows Kenya Sue/Other family member. Canceled, no write.
- Play starts sole #jb-audio, ready4/time advances through844x390 rotation; keyboard Pause stops. Viewport reset.
- Screens digital-desktop.png is latest dark draft before final typography fixes, should regenerate; no claim visual approval. Source CSS last overrides set light titles/transport contrast.

## Latest authorized VIDEO scope — not implemented yet
User explicitly wants SAME music command center with YouTube links, and TV up in MUSIC ROOM corner for selected video. Video visible ONLY while in music room; SOUND CONTINUES throughout other Ohana rooms. This supersedes earlier canceled TV/theater idea. No separate Theater.
- Family members add title+YouTube link via current own-library create/edit/sharing ACL. Everyone retains independent per-listener playback. No channel OAuth/import; channels not connected without URLs/auth.
- Validate strict11-character YouTube video ID from youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...; canonicalize to youtube.com/watch?v=ID. No arbitrary iframe HTML/domain.
- Existing server Suno-only media validation needs bounded canonical YouTube allowance; preserve ownership, optimistic concurrency, room/selected recipient ACL. Current907 Suno catalog untouched.
- Explicitly route YouTube tracks to ONE body-owned persistent player, never audio.src. Start YouTube pauses singleton Suno audio; start Suno pauses YouTube. Do not allow2 simultaneous sources.
- TV iframe stays mounted/body-owned, fixed room-corner position; hide visually outside music room without reparenting/resetting playback or muting. When selected audio replaces video, stop/pause YouTube. Signout stops both. Controls in same reader/Bridge target active source.
- Official docs https://developers.google.com/youtube/player_parameters (iframe min200x200, preserve player controls/fullscreen; enablejsapi+origin ifAPI). Browser autoplay/embedding restrictions can require tap; no unsupported guarantee background YouTube on physical phone lockscreen.
- Actual isolated official sample test still needed, including enter/leave room audio continuity, source switching, no autoplay on merely opening, signout, ACL recipient read denial. No production metadata writes or songs modified.

### Verified YouTube constraint (must resolve before implementation)
Official https://developers.google.com/youtube/terms/developer-policies Additional Prohibitions III.I.9 prohibits background player components when player is not displayed on current page/tab/screen. Therefore requested hidden-TV/continuing-YouTube-sound cannot be promised as supported. Do NOT implement hidden iframe background playback. Root notified. Supported alternatives needing user decision: retain visible>=200x200 player while listening across games, or pause YouTube on leaving Music room; Suno/direct own audio remains independently persistent. No video code applied yet. Official parameters source reviewed2026-10-16: https://developers.google.com/youtube/player_parameters .

Final screenshot digital-phone390.png refreshed after header/contrast refinement, actual390x844. Viewport reset. Header title now separate from canonical logo; compact subtitle below. This is design preview, not user-approved release. Current manifest records exact private SHA and bytes.
