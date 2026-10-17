# Digital jukebox consolidation — private draft

The user's latest phone report is that the display still looks like words in boxes. Current public app remains0854ba63c7ec925d7bf16c3b8b6dbe8887358f9c. This draft is NOT published, browser verified, or a completed visual audit.

The current music Shadow DOM contains readerStyle, digitalStyle, slipStyle, bankStyle and digitalRepairStyle layers. Shared document menu styling cannot cross this boundary. This draft removes the three later competing song-slip/cabinet/repair layers and replaces them with one screen.css. Earlier structural reader styles remain. The original room scene, media engine, catalog, sharing, editor handlers, member permissions and backend are unchanged. No audio played. No PuzzleRoom changes.

The proposed face uses a single inset dark glass surface, unboxed numbered song rows, plain text actions, search/collection controls, paged titles, Library and transport controls inside the screen. It retains visible focus/selected/disabled states and a readable cardinal caption. Portrait and landscape rules are proposed, not visually certified. Editing dialogs still need separate visual review. This source work alone does not establish that the user's requested polished appearance is achieved.

Build with node work/jukebox-screen-consolidation/build.cjs against the guarded current source. scope-proof.json records exact CSS-only inverse reconstruction and26parsed script blocks. app.html is a disposable generated draft; source patch and screen.css are the handoff. Never replace current production files with it without completing the next checks.

Next: recover the supported browser connection, check actual phone portrait/landscape and tablet visuals, long titles, current-song highlight, Mine/Share/Edit rows, expanded Library, credits, cardinal caption, keyboard focus, all returns/Home and no overflow. Keep music silent while user rests. Verify the real phone layout rather than claiming CSS source checks are visual evidence. Preserve user-confirmed Chat behavior. Publish only within the latest user authorization and explicitly distinguish hosting success from visual/device verification.

