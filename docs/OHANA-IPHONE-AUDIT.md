# iPhone-size audit — October16

This is a responsive browser audit, not physical iPhone/Safari certification.

Verified:
- Fresh signed-out signup at1024x768: Join previously below1062 with document768 and no scroll; published0a2 makes document1581 scrollable. Join44px, reachable616–660. No account created.
- Signup390x844 portrait: no horizontal overflow; Join44px, visible692–736 after scrolling, own-center hit.
- Signup844x390 landscape: no horizontal overflow; Join44px, visible238–282 after scrolling, own-center hit.
- Authenticated Home390 and430: entrance artwork loaded, no horizontal overflow.
- Journey/Shuffle/Tile390: original full artwork preserved; scenes359x202/359x239; no horizontal overflow.
- TicTacToe setup and Words setup/back navigation; Words844x390 fits, Home44px. No games or moves created.
- Bridge guide0a2: Home/Okay visible on390x600; Okay534–578, own-center hit; Okay→Bridge; Home→porch.
- Screenshot review caught illustration/instruction overlap. Correction8272 deployed successfully; final geometry check still pending.

Remaining before full pass:
- Other guides need always-visible exits and visual checks.
- Browser/Android Back full navigation draft unverified/unpublished.
- Real iOS keyboard/safe-area/pinch/audio/background behavior cannot be certified from Chrome responsive sizing.
- Bible new printed-columns preview still visually unverified.
- All-game rules/state/playthroughs and every music track were not exercised.
- Existing music smoke test passed but additional family tracks/fades are pending.

Evidence: outputs/signup-ipad-fixed.png; outputs/bridge-guide-phone-fixed.png (first fix BEFORE overlap correction); work/iphone-entry-audit/proof.json; work/music-live-preshow-audit/AUDIT.md.

## Later verification

8272 and da7823 both deployed successfully. Actual public Bridge and Blessings guides passed phone portrait/landscape: image precedes instructions by16px; Home/Okay/More visible; exit actions correct. Updates landscape follow-up and music library touch target polish are prepared for publication; public check pending. FullphysicaliPhone and allgameplay audit remains unproven.
