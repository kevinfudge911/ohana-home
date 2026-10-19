# Music playlist controls - October 19

Baseline main: 8c3e0355e9fdf49916eb4740707078c2dff5b7de, freshly cloned and checked through GitHub. Cloudflare dashboard confirms that commit as the current Ready production release before publication. Rummy writer has a separate branch and the parent has reserved music's first publication lane.

The previous queue re-resolved the current browsing selection on each Next. It could silently move a listening session into a newly browsed playlist or category. Initial Play without a loaded source also chose the first filtered song, overwriting the restored selection. There was no explicit Play All action.

The music-only revision adds a prominent free-flowing Play All beside the selected playlist name/count. Play All captures the full selected playlist independently of search/pagination, varies its starting song, and ignores repeated taps within 650 ms. Pause/Resume and Next operate on the active listening session. Browsing does not change that session. Last track loops within the same playlist; the UI states this. Manual song choices remain authoritative. Signed-file requests can be cancelled by Pause, and late requests cannot replace newer choices. A completely failed queue stops rather than retrying forever. The current song, position and queue are saved locally per member/room; reload waits for a Resume tap. Existing shuffle, category, volume and library preferences remain intact.

Repeated turntable placeholder tiles are replaced by explicitly typographic title artwork. Existing source-supplied song images remain supported and are shown in the current-song area. No new scraped artwork is added or represented as original album art. By/For's official album-art page was investigated; recording rights do not automatically resolve the rights of the referenced underlying painting. New third-party artwork is held pending that evidence.

`node tests/music-playlist.cjs` passes isolated tests for selected playlist snapshots, browsing independence, explicit playlist changes, repeated taps, varied starting songs, manual choice, pause/resume time, last-track loop, shuffle coverage, reload seek without autoplay, return rendering, all-failed queue stop, pending private-file cancellation, late-response ordering, empty playlists and revoked tracks. All 29 inline scripts parse. These mocked transport tests do not establish audible playback or device behavior.


Publication and served-browser verification are recorded in the task result. Physical iPhone/iPad/Safari, Bluetooth, lock-screen playback and audible listening remain distinct from responsive Chrome and native media-state checks.

GitHub publication checkpoint: main fast-forwarded without force to 002eb455a413778f719c53be1c7e38bcbac9d67a. Public git ls-remote independently confirms it. Cloudflare's connected main build has not appeared; last active version remains a57aaf1c for 8c3e035. No hosting settings were changed. Served verification is pending the build trigger.
