# Latest verified checkpoint — friendly72-hour reminders

Release d3b43e03559006c88aeb10cd32a6239e61abee1c is deployed successfully. Worker blobd801db4e65e0b64f67314acd0bc797c0aa0e3211,784943 bytes. App unchanged: blob285db680a3a80e33c929423d028a2af6a46819fd,6284113 bytes,914 tracks. Canonical files: work/final-current-release/app.html and worker.js.

The old24-hour per-game reminder is replaced by the requested gentle72-hour message, one attempt per member per inactivity period. Human moves reset the timer. Only opted-in members with a still-waiting human multiplayer turn and room membership qualify; bot-game reminder exclusion is preserved. Legacy accounts seed their initial timestamp once from last known visit/creation. Delivery is best effort, not guaranteed receipt.

Fifteen actual SQLite scenarios pass, including repeat/concurrent checks, multiple games, timer resets, committed-move races, opt-out, room removal and delivery failures. Independent review found no release-blocking defect. All worker bytes outside the reminder module, scheduled handler and successful-human-move activity hook remain identical. PuzzleRoom code/storage/bindings/lifecycle are untouched.

Cloudflare production Settings visibly confirms Every hour, next run2026-10-17T03:00:00Z. Live Home finishes loading; sampled browser error logs are empty. No forced production notifications or game moves were sent. Actual scheduled execution and physical phone receipt remain unobserved. Evidence: work/game-inactivity-reminder/live-hourly-trigger.png and test.cjs. At a later heartbeat after03:00Z, inspect the observed cron events page /86e18b73222d2807ad14e2e89bcef365/workers/services/cron-events/ohana-home/production in Cloudflare; do not infer delivery from configuration alone.

Still open: Bible printed columns, full Android Back/Home, further Christian country/contemporary/kids/comedy music, timed fades, exact Invite obstruction, red-three scoring question, physical iPhone and remaining full audit. Outfits stay last.

The earlier checkpoint/history follows.

# Latest verified checkpoint — seven family hymns

Release bbbcd8a73e7fda68b49fbdbeafeb788d07a78205 is live after a successful Cloudflare build. App blob285db680a3a80e33c929423d028a2af6a46819fd (6284113 bytes); worker blob8bedc1d7130636d2ff0c033b6b8a2ee3502a176b (781456 bytes). Canonical local files are work/final-current-release/app.html and worker.js. Use these newest files for future guarded transplants.

Seven public-domain St. Peter Hymns For Life recordings are published. All seven passed official source playback and actual Ohana audio checks at390×844 (readyState4, elapsed time progressing). Traditional Hymns has7 selections, Family & Kids has2, Sunday Best104, Radio810, total914. All original907 catalog records are preserved. The built-in-ID list is the only worker change; PuzzleRoom storage, bindings and lifecycle are unchanged. Nashville Roadhouse photo and module are preserved.

Playback restored to paused, all-song filters restored, Home loads normally and sampled error logs are empty. Evidence: work/licensed-catalog-expansion/live-playback-proof.json and live-hymns-390x844.png. These are responsive Chrome checks, not physical iPhone/Safari certification or complete audition of every recording.

Still pending: country Christian/contemporary worship/clean comedy expansion, timed profanity fades, Bible printed columns, full Android Back/Home,72-hour reminders, exact Invite obstruction, red-three scoring question and remaining full audit. Do not claim the whole library is censored or certified clean. Outfits remain last.

The earlier checkpoint/history follows.

# Latest verified checkpoint — Nashville Roadhouse

Release7c9ca4603f2956cca0938dea28911366bb33624a is live. App blob5a5e0d6bad9cdeb2aa956628f6f78f6876364d6d,6293214 bytes; worker unchanged. Canonical local app is work/final-current-release/app.html.

The user's original Nashville Roadhouse photograph is framed on the Music room wall, with tap-to-enlarge. Live390×844 and844×390 checks passed for image containment, Home, Close, browser Back, Escape, reopening Music and uninterrupted audio. The library target cascade repair is also live: Song+, Playlist+ and Mine are44px high. All907 catalog records are unchanged.

Evidence and limits: docs/OHANA-NASHVILLE-ROADHOUSE.md. Physical iPhone/Safari remains untested; the full saved audit still lists unfinished features. No new songs or profanity filtering were published in this batch. Local preview access is still denied; do not repeatedly retry or bypass session policy.

The earlier checkpoint/history follows.

# Latest verified checkpoint

The screenshot repairs and responsive audit are verified live through3b756472ad607de91c45ed663a535dc1e92267f2. App blob6515cd9af067208c9bc4c29b3c8d228d91c6cebd, worker unchanged. Canonical local app: work/final-current-release/app.html. Read docs/OHANA-IPHONE-AUDIT.md for passes and limits.

Signup scroll, original category artwork sizing, reachable guide Home/Okay, guide text flow, and Updates navigation pass live browser checks. Library Mine wording works; two library targets are still40px. targets-cascade-fix.cjs is staged, not published.

Remaining chores: physical iPhone verification; full Android Back repair; Bible printed columns; family audio catalog; timed profanity fades;72-hour reminders; exact Invite obstruction; red-three scoring choice; remaining full gameplay audit. Do not claim all songs clean or all features complete. Outfits may resume only after every other chore is completed and published.

User authorized15-minute progress/publish checks. Heartbeat finish-and-publish-ohana-repairs is active. Notify only meaningful changes, failures or necessary user input. Current session denies local network connections; public browser and GitHub work. Do not repeatedly retry denied loopback requests.

Pending guarded patches are saved in handoff/2026-10-16/work. Apply them to the latest app; do not overwrite it with old full candidates. Never change PuzzleRoom Durable Object storage, bindings or lifecycle. Preserve early bootstrap helper order and compressed assets. The app is imported under its long hashed filename; never add a duplicate live/app.html.

The history below contains superseded checkpoints.


# Current authoritative checkpoint — October16 iPhone-size audit

Live confirmed: da7823 (common room-guide exits) follows8272 (Bridge contentflow),0a2 (signup reachability),cf88 (original game-scene sizing). Public checks: signup iPad1024x768 andphone390x844/844x390 scrollto44pxJoin; Bridge390x600/844x390 image andinstructions separated, Home/Okay visible andwork; Blessings390/844 Home/Okay/More visible andwork. Home/Journey/Shuffle/Tile entries normalart/nooverflow; jukebox907 smoke test passes. This is responsiveChrome, NOTphysicalSafari certification.

Next audited follow-up accompanying this handoff: Updates visibleHome/Close/Previous/Next with original optoutsemantics, plus44px libraryactions/clearMineemptytext; sourcechecks pass, publicdeployment mustbeverified. Currentcandidate work/licensed-catalog-expansion/polished-app.html6111878bytes. Mainapp filepath MUSTremain hashedworkerimport, NOTlive/app.html. DO/workerunchangedthisfollowup.

UserrequestsfulliPhoneaudit afterrepairs, immediatepublicationofverifiedfinishedwork,15minute checks(activeheartbeat), outfitsONLYafterallotherchorescompleted/published. Neverchangeapprovedroomart/designs justfixsizing. Unfinished: Bibleprintedcolumns(11NKJVunchanged, visualunverified), broadAndroidBack(private testedmodels notbrowser), timedmanualprofanityfades(private engine/APIpass, editorunverified;907unmappednotclean),7PDhymns/kids+licensedworship/country/comedycandidates(notlive),72hreminder(notimplemented; existing24hhandlerfound),exactInviteobstruction,red3scoringchoice,otherfullgame/deviceaudit. Backgroundaudio ordinaryliveHTMLaudio notpausedonlock; newmanualfadesmustpaus emappedtrackswhenhiddenforsecurity. PhysicalAndroid/iOSlock/pinch/audionotproven. LocalnetworkconnectionsEACCES; publicbrowser/GitHubworks. Do not repeatedlyretryblockedlocalhost.

Pendingguardedsourcepatches mirroredunderhandoff/2026-10-16/work inthiscommit; theyareNOTallpublished. See reportsandevidence. PreservePuzzleRoomDO/bindings/storage/lifecycle andearlyboothelperorder/gzipassets.

# Verified live and active work — October16 follow-up

5046ca4 deployed successfully; public Home completes startup, printed Bible present, new digitaljukebox opens. 8d5bd4 saved display-size guard deployment alsoSUCCESS, exactpublicDOMstillneedscheck. Current canonicalapp work/final-current-release/app.html includesguard, worker work/audit-visual-release/worker.js includes additive sharedcoloringAPI. Avoidduplicate live/app.html: worker imports hashedappfilename; wrongduplicate causedfailed28a34ff package.

Activehelperassignments: porchlayout investigating mobileShuffle/gameentry500%appearance, guard12casespass butuserexactcauseunconfirmed. Jukeboxhelper sourcing Christian country,worship,gospel,oldhymns,cleancomedy,funchildrenssongs usingpermittedplayablesources; noneimportedyet. Dominohelper timedmanual profanitycues/fades: noexisting907wordtimings; safeAndroid/desktopvolumeengine, iOSnotcertified, neverclaimallclean. 72hourfriendlygamereminder requestednotbuilt. Preserve DO, allACL, currentcatalog, existingprivateaudio.

# Current release checkpoint — October 16

Ready deployment: app 6099743 bytes, blob 1822a9055477588bfd33c23be2165ab8ecd6c475; worker 781217 bytes, blob 4a82cca3152665ea4d8cb2c596f72642243a7772. Includes printed Bible leaves/readable reader, integrated digital jukebox, Bridge ordering/navigation/My Games/guide, gold Journey/setup controls, shared coloring isolation, compact landscape workstation. Combined normal startup, Bible opening, Bridge order passed; individual evidence preserved in work folders. Deployment must be verified before calling live.

Previously confirmed live: 6b42aa7 header, card placement and gestures. Physical Android pinch/pull-refresh needs device confirmation. Remaining: exact covered Invite dialog, physical record-player button polish, red-three scoring choice for eight reds, friendly 72-hour inactivity reminder (not built), member upload sharing defaults, Christian radio, YouTube, timed profanity fades, remaining full-site gameplay/device audit. Tara automatic switching remains resolved by user. Outfits paused. Never change PuzzleRoom Durable Object storage/bindings/lifecycle; preserve bootstrap helper order and compressed assets.

# Ohana Home — master handoff, October 16, 2026

## Current audit checkpoint after usage reset

The user applied one free reset; read-only account check showed 0% used and two resets remaining at that moment. Medium reasoning was selected by the user. Prior 1%-remaining notes are historical. Keep work efficient. User requests a full review, saved status, and prompt publication of verified repairs.

The application release accompanying this checkpoint is 6,158,495 bytes, Git blob d4def021c2af1fbb9580d99f52c505c42dc9ac5e. It adds the tested shared room/game headers, HF full-red-three display beside own foot, correctly attached discard/book labels, and native card-gesture repair. Worker is unchanged. Logic tests and actual isolated390px HF/O10 selection/reordering, ownership, normal startup, game header geometry and Home return passed. Real Android multitouch/pull-refresh still needs the user's confirmation; do not guarantee a physical-device result from browser/CSS tests. Verify Cloudflare/public hash before calling this particular release live.

Immediately preceding confirmed public app: cc5b759,6149681bytes,f4356b5017764ed21f2324d0d809f423fb45c856. Git main134d84c was handoff-only. Current local candidate work/audit-followup-release/app.html; canonical work/final-current-release/app.html changes only after root publishes.

Latest new Bridge requirements: record player → Room+Volume together → Chat → Games/tools. Remove redundantClose; preservecardinaltoggle returning SAMEGAME, Homegoesporch. AddMyGamesallongoinggames/opponents/turns. Recordplayer/lidopensmusicselector/editor; physicalcontrolsinsidefrontplate, visuallyintegrated notoldseparateboxes. Home/Bridge headingssamebrand/readablesize. Invitescreenmustnotbehindcardinal; determineactualinternaldialog ratherthaninventnewflow. Music audit found full-screenmusiclayer coverscardinaland Homecleanup mustclosemusicproperly. Navigation/orderprivatepatch in progress, NOT in this release. Invite wasn't clicked on production because it maysend/shareactualroom invitation.

User reconfirmed DIGITALjukebox interior must lose genericblue/whiteboxedpanels, redundantOhanaTunesheading/overlap and clippedcardinalcaption; keep integratedprofessionalcabinet andexistingsearch/filter/playlist/Add/Share. Journey innerlibrary/studiocreamboxes/genericbluecontrols needscopedgold/illustratedstyling; privatepatchnotyetverified. Bibleprinted-leafprototypeusesexisting11verifiedNKJVversescompletewithinoneleaf, plus tap-readableview; artunchanged, testingnotfinished. Do notcallanyofthesecompleted.

Fresh read-only public audit: Home finishesloading, correct8roomorder, Memoriesloadsphotos andHomeleft/titleRightmeasured+Homebackworks; GrannyloadsSavedandHomebackworks; Blessingsfamilywallloads (no prayer/reaction posts). Fullend-to-endplaythrough/deviceorientationauditofeverygame is STILL NOT COMPLETE. Current review in docs/OHANA-CURRENT-STATUS.md deliberatelydistinguisheslive/active/pending.

Tara automatic-next issue remains CLOSED/userconfirmedworking. Outfits alonepaused. Redscoringchoice/YouTube/radio/sharedcoloring/censorwordtimings/Bibledesignremainasrecordedbelow. NeveralterPuzzleRoomDO/storage/lifecycle. Preserveearlyboothelperordering andgzipassets/packageheadroom.


## AUTHORITATIVE CURRENT STATUS — latest handoff

Historical pre-reset checkpoint: user then had 1% usage remaining. Preserve this record in GitHub; minimize additional work. All previously verified finished changes are LIVE. Do not describe pending patches as completed. Only outfits are paused. User authorized publishing finished repairs, not speculative candidates.

CONFIRMED LIVE commit cc5b759a7b0e93e092b479532343387ec8271368. Public app 6,149,681 bytes, Git blob f4356b5017764ed21f2324d0d809f423fb45c856; Cloudflare success and normal signed-in Home loading verified. Worker unchanged: 772,457 bytes, blob83b9a39281f677b99b05685de91086b53cc58f6a. Local canonical work/final-current-release/app.html. This supersedes older deployment status below.

Live includes Home room ordering/grouping; digital song-bank jukebox; owner Share buttons for songs/playlists with Everyone/OnlyMe/SelectedPeople, tested recipient access without edit rights; Bridge individual icon+label light pills, no full cream panel, legacy icon suppression, transparent record-player labels and scroll reset fix; HF compact layout and restored original 8/9/10 rank positions; initial native-touch repair; BLACK-three house rules; removed duplicate OhanaHome crest below Bible. Earlier repairs remain. New Share does NOT change privacy defaults or bulk expose anyone's songs. User wants their own new songs shared to everyone and all members able to share; per-member upload default remains pending.

TARA ANDROID AUTO-ADVANCE: USER CONFIRMED WORKING. Investigation CLOSED; user explicitly said stop messing with it. No speculative auto patch. Earlier issue is not an outstanding blocker now.

PENDING, NOT LIVE:
1. work/card-native-gesture-repair: root overscroll suppression for pull-refresh, 350ms hold+slide reorder for HF/O10, quick swipe native, second finger cancels drag for pinch. Logic/25-script parse/exact inverse tests PASS; latest actual browser/physical Android check incomplete. Do not call fully verified or automatically publish. Existing live initial touch repair did not solve user's pull-refresh/delayed pinch report.
2. work/header-standard-repair: Home top-left/current Ohana room name top-right across rooms. Candidate put game Home back in header (legacy dock moved it bottom) and revealed O10 title, but inherited inline44px width squeezed logo. Latest fallback UNTESTED. NOT READY. HANDOFF.md gives apply steps.
3. HF real phone visual problems: full red-three cards stacked beside OWN foot bottom-right labelled Red threes (not tiny box in hand); discard count directly under discard pile, not below unrelated line; Clean/Dirty labels attached to each neat realistically overlapped book. NOT IMPLEMENTED. See work/PORCH-HANDOFF-2026-10-16.md. Scoring unchanged for this visual task.
4. Bible still REJECTED by user. Research exists, but latest redesign not implemented. Keep approved book/table art; use real printed-page serif scripture, margins, gutter, inline verse numbers/headers and correct perspective/clipping. No giant HolyBible/cross on open pages, fake filler or silently changed translation. Existing 11 NKJV snippets cannot fill continuous chapter pages. User supplied four references; accuracy research already saved. Do not spend duplicate research credits.
5. User rejects generic blue/white box UI, especially Journey inner cards and music screens. Wants consistent illustrated/gold controls; remove redundant OhanaTunes heading overlapping category and fix cardinal caption clipping. These are pending; no broad CSS replacement published.
6. User reported some Bridge buttons (Home/Invite) fail, Puzzle works. Not reproduced/resolved yet; earlier open/close checks are not proof all destinations work.
7. Red-three scoring still pending (black-three change live). Desired +100 after owner's opening meld; each player who gets four gets1000 total for those four; caught hand/unopened foot -300 EACH. Unanswered: eight red threes=2000 per four-set or1400 one bonus+extras. Do not silently choose. Display owner by own side.
8. YouTube NOT BUILT. Original plan TV corner of existing Music, same sharing, no new Theater now. YouTube must visible min200x200; cannot hiddenbackground/audioextract through API. Official policies already researched. User now wants future conversion of ORIGINAL OWNED VIDEO FILES to audio, not YouTube ripping. Record for another day. External player/pause choice remains unsettled. No channel URLs/auth supplied; don't claim connected.
9. Christian music request: large shared selection of old hymns, modern Christian, country Christian, worship/gospel; independent listening. Researched KLOVE, MoodyPraiseWorship, ChristianCountryGospel. Need supported/authorized streams or official players; current backend supports Suno links only, radio not built. Do not rip or promise mass licensed music imports.
10. Shared coloring final phone/personal-fill checks, profanity timed fade prototype needing real word timings, Checkers sand, remaining audit/backlog below remain pending.

NEXT AGENT: read this first, then pending helper handoffs and guarded transplants mirrored under handoff/2026-10-16/work. Use latest app from live path, apply bounded scripts sequentially, never replace entire app with old candidate or fixture. Preserve startup helpers BEFORE api() and gzip coloring imports/hosting margin. No production game moves/messages for tests. DO NOT TOUCH PuzzleRoom DO storage/bindings/migrations. Validate normal startup, not only seeded fixtures. Existing historical notes below remain useful but this section wins on status.


## Read this first

The user wants finished, tested work published promptly, with honest separation between generated, staged, pushed, and verified live. They now have about 1% usage left and report a reset on October 22. Avoid duplicate research, repeated broad tests, unnecessary image generation, and unrequested extra features. Only outfits are paused. Other features were NOT cancelled. Keep progress concise and do not interrupt conversations with Mike, Chris, pets, or other devices.

Production: https://ohanahome.app . Repository: kevinfudge911/ohana-home . GitHub main auto-deploys the Cloudflare Worker ohana-home. Do not change or delete PuzzleRoom Durable Object storage, bindings, SQLite exports, migrations, or lifecycle. Never play a production move or send a family message just to test.

Local workspace: C:/Users/kevin/Documents/Codex/2026-10-14/ohana-local-browser-verification . Local work/ paths below are private test/staging files, not automatically present in a fresh GitHub checkout. Pending text patches are mirrored under handoff/2026-10-16 in GitHub with this handoff. No test databases, credentials, or private photo files belong in that mirror.

## Deployment and recovery

Last confirmed live before the release accompanying this handoff: commit 6cd0c67ca9584370d22db1c78109324bb6430a9c, app 6,020,509 bytes, Git blob 42779e1dbb99da512650f01632bb2e323b884ac8. Public response AND actual signed-in Home loading were verified. It includes the music library ACL, section updates, new category artwork, printed-text Bible attempt, tablet Tic-Tac-Toe shoreline, skip-cycle repair, shared automatic-turn repair, Memory reveal pacing, and large Dominoes rack scrolling.

The pending combined release saved with this handoff has app 6,112,686 bytes, Git blob bd331892f746c5d4941bc946cd9c351617cdcedf; worker 772,457 bytes, blob 83b9a39281f677b99b05685de91086b53cc58f6a. It adds the NEW Home order and game grouping, NEW Bridge phone layout/guide, compact Hand and Foot layout/scores, BLACK-THREE-only rules, and the tested digital song-bank selector. Verify deployment/public bytes before calling this live. The red-three scoring changes, YouTube, new Bible design, and shared coloring are not part of that combined release.

App remote path: live/5e56a1670589dcba0b60713f79c86ac150466cca-d975c2c4ca11dd0e62f2534a9e5dddeea065a1f8-3bf844cb8c9c2a87e301a8616088ba6047d9ab5e-app.html . Worker: live/worker.js . Static imports use Wrangler no_bundle. Do not blindly upload all local live/ files: local folders contain old plain SVGs and audit files absent from current Git.

Two incidents this morning:

* First deployment ccaacb8 failed Cloudflare validation 10027: actual package exceeded the 64 MiB uncompressed limit even though raw tree bytes were just below it. Wrangler/module overhead matters. Losslessly gzip-compressed the remaining 22 coloring SVGs, added their names to the existing gzip route set, and replaced the corresponding Git modules. Saved 864,185 bytes. All original Git hashes, gzip round trips, and actual 22-page browser rendering passed. Originals are recoverable in Git history/local backup. Do not restore the plain modules into the deployment accidentally.
* Release bb5be23 initially hung Home at Loading. New api() turn-watch hook called helpers in a later script before their declaration script executed. Rolled back with d1493ba to the exact last working 33488 tree, verified Home, then fixed helper ordering. The helpers now live BEFORE api() in the same initial script; typeof guards also remain. Corrected release 15a8a537 passed normal startup and reload, then public signed-in Home. Preserve this fix. Seeded fixtures had hidden the original bootstrap failure.

Local evidence/backups: outputs/ohana-full-audit-2026-10-15.txt, outputs/rollback-live-33488-2026-10-16, outputs/retry-release-2026-10-16, outputs/coloring-lossless-backup-2026-10-16, work/normal-boot-proof/EVIDENCE.md . Old rollback app blob fd8c1639d05ebad8f0ac973e786a9f97e368e120, tree eaf26150211b66eba7d9cc764317e1d10492f04a.

## Current priorities and exact requirements

### Home organization — latest instruction supersedes earlier order

Keep Play now plus waiting-turn count at the top, opening an existing waiting game directly. Main entrance order: **Music, Memories, Blessings, Granny, United, Journey, Shuffle, Tile**. Granny stays a separate main entrance. Journey, Shuffle, Tile all stay on Home.

Move individual active games INTO their matching rooms. Inside each room show existing games, opponents, scores/status, and whose turn; preserve original game cards below for starting games. Shuffle: Ohana 10, Hand and Foot, Spades. Tile: Chess, Mahjong, Words/Wordfeud, Dominoes. Journey: coloring, Tic-Tac-Toe, Memory, Checkers. Our Ohana people can remain below room entrances. Opening rooms must not create games; existing setup/settings/invite flow remains.

Home repair is tested in work/home-category-repair: normal boot/reload, exact eight entrances, restored Granny, Play now, matching active lists, Back/Home, and opening an existing Memory table without playing a move. Original nodes and their handlers are reparented/restored. A MutationObserver loop was caught and fixed; preserve the guard that moves Our Ohana only when it is not already in the correct place.

### Bridge — ready in combined release

User phone screenshot showed duplicate old glyphs alongside new artwork, wrapped words, hard-to-read controls. Above record player: ONLY Ohana Home and Ohana Bridge title. No Commands or Music tabs. Below player: one light cream backing that includes BOTH symbols and labels, Chat, Help, sound and tools. Ordinary family Chat visible; AI Chat hidden from menu but existing background function preserved. Labels whole, targets at least 44px, one meaningful icon each. Bottom cardinal always accessible and toggles back to the same game without Home trip.

work/bridge-phone-layout-repair/build.cjs followed by finish-guide.cjs makes bounded changes. Guide version 2 uses an actual current portrait screenshot with instructions underneath. Phone/landscape Chat/Help/Close and physical Play/Pause passed; one audio singleton preserved. Some semantic automation clicks miss skewed physical button geometry, so use visible physical hit testing when appropriate.

### Hand and Foot layout — ready in combined release

Use EXACT actual playing-card renderer/art for meld samples, not a different demo design. Overlap cards like a real hand, keeping every rank/number/A/K/Q visible. Compact samples together. Draw and discard immediately above own hand; melds above those piles. Own foot at bottom right, near hand. Opponent on opposite side. Red threes on owner's side, own near own hand, with visible owner/count. Workstation score UNDER player name so names/scores remain readable on phones.

work/hf-compact-layout is layout-only. Actual phone hand shrank from about 304px to 204px, no horizontal overflow; all nine sample rank corners exposed, Ace tap shows 20 points, foot/draw/discard positions checked. Scores measured below names on both players. No red-scoring inference is included in the layout patch.

### Hand and Foot rules

**Black threes:** always ZERO in hand, foot, or meld. They block discard-pile pickup, even if another black three is held. May meld at least three pure black threes only in final foot after required clean and dirty books, when they are all remaining cards except ONE final discard. No wilds/red threes in that meld; no book qualification/canasta bonus. BLACK-ONLY repair is included in the pending combined release. Ten engine test groups and an isolated actual browser black-three Meld → final discard → finished round passed. Invalid melds rejected atomically. work/hf-black-only has guarded transplant and evidence.

**Red threes requested, NOT yet published:** +100 each only after that player's opening meld. Any player who gets four earns 1,000 total for those four, not only the first player. Red threes caught in hand or unopened foot at round end cost -300 EACH. Auto set-aside/draw replacement stays. Red threes visibly stay beside owner.

One question is still pending: eight red threes — 2,000 for two sets of four, or 1,400 from a single four-card bonus plus 100 per extra? User has not answered the presented choice. Full staged rules currently provisionally use one bonus +100 extras; do NOT silently publish that assumption. Unopened, auto-set-aside reds are provisionally zero because bonus needs an opening meld; distinguish those on table from actual hand/foot penalty. BLACK-only patch explicitly leaves current red scoring unchanged. Full provisional patch: work/handfoot-house-rules . Isolated full-flow proof work/hf-combined-private . Do not carry fixture-only reconnect-overlay hiding into production.

### Bible — user says highest priority after current repairs

Current published typography attempt is REJECTED by user. Do not call it fixed. Preserve approved Bible/table artwork. User supplied four Bible/cake references for page/text appearance; use dense real-print geometry from first/third, not cake decoration.

Research completed: all eleven existing NKJV verses match verified source (retain 1 Peter 5:7 lower-case continuation; no paraphrase). Current implementation splits a SHORT verse arbitrarily across leaves, stretches justified spacing, has excessive blank paper, and can put lower book behind workstation. These are concrete defects.

Proper approach: dark near-black regular serif; coherent paragraphs/poetic lines and small verse numerals; small book/chapter running heads, equal outer margins and larger inner gutter. Each page plane independently follows perspective/curve; clip ink to paper. Keep complete short verses together. Fit whole book above workstation on phones; an optional tap-open readable book view can solve scene-scale limits. No giant Holy Bible heading/cross pasted onto open pages. No fake/repeated filler Scripture.

Content constraint: eleven short NKJV quotations cannot honestly imitate a full continuous printed Bible spread. Options are accurately labelled selected passages, or verified contiguous text obtained appropriately. Do not silently change translation or fabricate surrounding scripture. No new Bible implementation has been made from this research yet.

Research: work/bible-research-2026-10-16/verse-checks.json and recommendation.txt; work/bridge-phone-layout-repair/bible-research.txt . Cambridge actual NKJV samples are PDF pages 24–26, printed 19–21: https://www.cambridge.org/ca/files/2614/0500/2026/9781107924260Web.pdf . Thomas Nelson sample: https://cr-assets.localretailconnect.com/preview/9780785259480.pdf . These document paragraph/verse-number typography and margins. Do not substitute decorative quote panels again.

### Music — latest direction

Live catalog has 907 original tracks, independent per-listener playback, search/filters/playlists, shuffle bag without repeats until exhausted, carry between rooms and Memories. Original catalog is immutable. Family contributions live: supported direct Suno audio URL metadata, own edits/removal, Only me default / My Ohana / Selected people. Three-member actual browser + 23 SQLite ACL checks passed. Playlists cannot grant access to private underlying songs. Known provider-public media URL remains external; app ACL protects Ohana catalog access, not a copied provider URL.

Current cream scrolling selector REJECTED. User supplied five jukebox references, then explicitly chose FIRST digital Nostalgia touchscreen style. Desired: professional dark/backlit DIGITAL command center inside Ohana jukebox, songs/genres/adding/editing/playlists/playback ON SCREEN. Not extra physical key rails/hinges/buttons. Vintage examples guide cabinet visual quality, not interaction. Fixed title banks/pages instead of a vertical listener song-list scrollbar. work/jukebox-bank-preview has the bounded music-module-only implementation. Actual 8841 phone bank paging, filters, sharing-form access, and playback through rotation passed with the isolated ACL backend. This tested selector is included in the combined release, with no YouTube implementation yet.

**Newest video scope supersedes cancelled corner TV / separate Theater plan:** add television in MUSIC ROOM corner; chosen song's YouTube video shows there. Video only needs to be visible in music room, while sound can continue throughout other rooms. Reuse existing controls, sharing choices, and persistent player. User and Fudgy Pie and other members can add YouTube links. No channel URLs/auth have been provided; do NOT claim channels are connected or all uploads auto-imported. Minimal link-based playback first; no new Theater room now. Separate outdoor Ohana Theater is later if wanted.

YouTube playback is NOT built yet. Current backend only accepts supported Suno URLs; must add strict validated YouTube source handling and explicit iframe playback, never send YouTube page URL to audio.src. Keep one effective playback source (pause audio when video begins; pause video when audio begins), preserve ACL. IMPORTANT research constraint: YouTube Developer Policies III.I.9 prohibit hidden/background player playback (https://developers.google.com/youtube/terms/developer-policies). The user's requested hidden TV picture with continuing YouTube sound outside Music therefore needs a supported alternative decision: a visible small player during games, or pause YouTube when leaving Music. Ordinary direct audio can continue as before. Do not promise hidden YouTube audio. Official docs https://developers.google.com/youtube/player_parameters require usable player dimensions and original controls/fullscreen. No arbitrary iframe URLs. No direct file-upload implementation exists; adding links is not uploading files.

Profanity fades: user wants timed brief fade/mute on explicit words, then restore volume, not a generic clean-song review gate. Prototype work/music-censor-preview passed timing/seek/mute tests but songs have NO word timings. Accurate cue mapping/source CORS/phone behavior still need integration. Do not claim all songs are automatically censored.

### Shared coloring — staged, not published

Ohana Journey contains shared family coloring table above original personal pages. Additive API/DB, operation log, polling/outbox retry, owner/admin page change/clear, own-only undo. Existing personal pages stay private/local as before. Actual two-member fill/marker/eraser sync, own undo preserves other member, host change prompts guest Join new picture, reload and personal selection isolation passed. work/journey-shared-table/transplant.cjs is bounded. Phone layout and final personal-fill persistence roundtrip still pending; global viewport overrides conflicted across workers. Do NOT claim physical phone proof. No production writes performed.

### Remaining and later

* Full-site hands-on audit AFTER current started repairs, including phone/tablet portrait ↔ landscape; shorter landscape workstation so board stays visible; no progress/cards/pieces lost on rotation.
* Checkers directly in sand, remove old raised/table look; lower priority, preserve gameplay.
* Memory smaller playful kid-friendly art/table redesign remains separate from now-live timing/rapid-second-card repairs. Original wrong-index bug was not reproduced in tested fixtures; user clarified immediate AI moves and ignored rapid second selection, now repaired.
* Automatic switching is live but still needs user's physical-device confirmation. Proven defects fixed: production POST lacks .next, capped sync may omit older current game, direct Chess/Mahjong submissions bypassed old hook. Authoritative GET and shared accepted-move watcher with rejection/new-turn guards, Memory reveal wait. Preserve startup-order fix.
* Next respects skip cycle/oldest waiting rather than immediately returning to skipped game. Manual and automatic transition guard prevent double-open.
* Game rule introduction Don't show again is per member + GAME TYPE, not each table; account preferences, manual Rules reopen. User wants actual variant, partner names, scoring explanation.
* Game setup Go windows' oversized blue controls need cohesive Ohana redesign LATER. Don't disrupt functional setup/invite flow.
* User's NEW later request: hide excessive internal turn/action narration (especially Ohana 10); keep useful turn state but don't display computer processing instructions.
* Recipient invite popup is live. Actual test invite requested but not sent: existing test profile credentials unavailable; do not guess/reset PIN or change user's current session.
* Draw Dominoes scores at round end; zero during play is expected, All Fives is different. Do NOT impose a hand-size cap based on user's joke/large drawn hand. 35-tile rack scrolling was real and repaired.
* Spades partner was Eagle for Pe-paw; MomFudge and Memaw other team. Existing character cards must be preserved.
* Journey new main artwork shows her with ALL children's activities; old coloring-only artwork becomes Ohana Color inside. Chess belongs Tile, Checkers Journey. Shuffle/Tile original new illustrated entrances are live.
* Old Canasta voice line 'those were supposed to be mine' remains unconfirmed; two possible Pogo clips only. Do not claim found.
* Five outfits saved and PAUSED: Eddie Doctor/Gardener, Honu Doctor, Otto Gardener, Pippa Gardener. Full wardrobe expansion not done. Do not publish/resume without user instruction.
* Brother's ZIP was delivered; eight explicitly disposable test tables were cleaned previously. No further cleanup authorized by that alone.

## Verification discipline

Use actual browser via the approved CUA API. Normal bootstrap tests must preserve script order; pre-seeding S/render/openGame hid the startup issue. Isolated local fixtures use fake members/tokens only; do not ship those scripts/databases. Local ports are often occupied; root starts listeners under session network permission, then delegates checks. Global viewport override can race between helpers; serialize and verify actual innerWidth, reset afterward. Resized Chrome is not a physical phone/tablet test.

Publish with fresh expected Git main SHA, no force. Keep rollback snapshots and exact app/worker Git blob hashes. Check Cloudflare build AND public response, then actually open/reload Home before telling user everything works. Passing parse/tests does not establish usability. Keep untested feature prototypes separate. Future agents should read this handoff and current Git state before resuming.

## Latest small repair release (Oct16)
Pushed cc5b759a7b0e93e092b479532343387ec8271368; app6149681 bytes Gitblob f4356b5017764ed21f2324d0d809f423fb45c856. Worker unchanged. Card8/9/10 ranks restored25percent/23percent in original handshape, touch pointer avoids drag capture, observer skips identical CSSwrites; actual390 tap/rank checks passed but physical pinch freeze needs user retest. Visible owner Share for songs/playlists passed isolated ACL tests. Duplicate Home crest removed. Current script source work/final-current-release/app.html. Await public confirmation before calling live.
Tara Android automatic switching CONFIRMED WORKING by user; stop investigation. No speculative patch. User wants own music available everyone but Share privacy defaults still unchanged; no bulk exposure. Newblueboxes/musicheading/cardinalcaption/Bible remain pending.

