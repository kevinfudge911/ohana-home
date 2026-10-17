# Background audio — source review, not device certification

Reviewed current verified app ef141a326a13d3558869c4fcd218260ad5d35ea5 (6306082 bytes,927 tracks).

The live app does not pause its ordinary music player in visibilitychange/pagehide handlers. Existing visibility handlers flush Granny progress, refresh chat and restart game/sync polling when visible. The music player remains a single HTMLAudioElement when leaving the Music room; earlier actual navigation checks established that room changes do not deliberately stop it. No custom Media Session metadata/lock-screen action handlers are implemented. The private timed-fade draft has a different hidden-page pause rule; it is not live and must not be confused with current playback.

This establishes app intent only. It does not prove iPhone/iPad/Android background execution, Bluetooth continuity, battery restrictions or behavior after force-closing the app. Physical device testing remains required. Do not publish an untested background-audio patch based only on this source review.

Minimal device retest: start an ordinary song with a tap; leave Music for a room and confirm it continues; lock the screen for30seconds and confirm through the vehicle speaker; unlock and verify same song/time; separately switch apps without force-closing Ohana. Record device/OS/browser and the exact step where it stops. Do not test while operating a vehicle. Closing the browser/app completely is a separate case from locking the screen.

No application, permissions, account settings, music rows, playback preferences or PuzzleRoom data were changed by this review. Remaining work stays in the master handoff; outfits remain last.

