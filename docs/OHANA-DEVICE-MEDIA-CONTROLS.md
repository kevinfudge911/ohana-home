# Device media controls — published with device limits

Releasebd2de3fc8f77070a9b436258369461bf58d2e6cf LIVE after Cloudflare success and fresh ordinary public Home/music verification. App8a7949626d6f687a25f9c32395b2bf9c40987e46/6310791B; worker4c04306bf8ae95be043415b1da312964d43a46f0/785470B unchanged.929catalog records, approved artwork/layout/sharing, card-facing repair and backend preserved. Exact inverse insertion adds3067Binside existing music singleton, after final queue installation;26script blocks parse. No PuzzleRoom/DO/bindings/lifecycle change.

Optional feature-detected MediaSession integration reports title/artist/Ohana Music album and real playing/paused state. Registers Play,Pause,Stop,Previous,Next,SeekTo,SeekBackward,SeekForward where supported. Routes actions through existing listener queue/play functions. Play while playing is idempotent; no autoplay or new audio element; bounded seeks; clears metadata/state without source/sign-in and blocks device replay after sign-out. Position updates use existing events, timeupdate throttled1Hz. No UI change, database writes or extra network requests.

Source tests PASS API-absent/unsupported-action fallbacks, duplicate install, original renderer return, no autoplay, play/pause/resume, queue delegation, metadata updates, bounded/invalid seeks, unknown duration, Stop reset and sign-out isolation.

Query-gated canary4a3447a5f97a82c54b7d2336358298f162d233c0: normal Home passed; actual native Chrome MediaSession accepted all8registrations. Visible temporary diagnostic read null/none before playback; Monkeys Spinning Monkeys playing1.04sec/ready4, paused2.15sec, then Carefree playing1.03sec/ready4. Actual DOM audio Carefree currentSrc matched at6.882475sec. Sampled errors empty. Normal UI buttons were used; native hardware buttons were NOT invoked.

Final ordinary public release: diagnostic count0; fresh Home loads; Carefree exact currentSrc/time1.037728/ready4/pausedfalse. After closing reader and returning Home audio remained playing at7.796455sec. Returned Music, paused at9.768394sec, restored All playlists and Home. Screenshot live-player-phone.jpg reviewed at phone-size viewport. Canonical updated only afterward. Public preview worker route removed; no diagnostic panel in production app.

LIMITS: This is responsive Chrome/native browser API proof, not physical iPhone/iPad/Android/Safari/lock-screen/Bluetooth certification. Does not prevent OS suspension, battery restrictions, autoplay policies or force-close. Unsupported browsers retain ordinary playback. No promise of uninterrupted screen-lock playback. No YouTube implementation or timed profanity filtering included; all929songs remain unmapped by private manual timing draft.

Standards: https://www.w3.org/TR/mediasession/ ; https://developer.mozilla.org/en-US/docs/Web/API/MediaSession . Sources saved for implementation context, not a claim of universal browser support. Old private/full canary candidates and builders use the former8c6baseline and must not overwrite canonical; regenerate deliberately if needed.

