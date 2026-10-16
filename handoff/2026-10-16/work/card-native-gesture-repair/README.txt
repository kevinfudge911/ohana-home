Native pull-refresh / card-touch repair — bounded private patch

Base work/final-current-release/app.html6149681. Root body already had overscroll:none, but documentroot did not; adds html:root overscroll-behavior-y:none and appcontain without touch-action:none. Intended to suppress browser pull-refresh at root boundary while preserving nativepan/pinch. Android physicalconfirmation required.

Prior data-cid touch bypass was HF-specific. O10 uses data-o10-card, so that predicate did not directly disable O10. Shared pointer/nativegesture conflict remained. Bothhands now use explicit touchlongpress: hold350ms then slide to rearrange, quickswipe staysnative, secondfinger cancelsdrag and permitsnativepinch. Separate passive touchstart/nonpassive touchmove only cancelsmovement AFTER hold armed. Mouse and Altkeyboardreorder unchanged; tapselect unchanged. Nativepointertouch path yields to these touchlisteners, preventing duplicate gestures. Holdgets brief existing-style glow asfeedback.

check.cjs PASS BOTHattribute paths: quickswipenoprevent, heldslideforwardsreorder, secondfingercancelswithoutpreventDefault, exactinverse.25scriptsparse. No worker/rules/artchanges. Physical Android multitouch unavailable through currentbrowser tools; no guarantee claimed fromCSS/unitchecks alone.

Apply transplant.cjs latestApp outputApp. Preview rootcommand node work/card-native-gesture-repair/server.cjs work/card-native-gesture-repair 8845 . Do not ship privatefixtures/server. Root owns review/publishing.
