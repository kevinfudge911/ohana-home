# Jigsaw without touch dragging

Adds a semantic puzzle dialog with piece browsing, edge information, numeric row/column placement, tray retrieval and explicit release recovery. Optional location clues disclose the selected piece's correct destination only when requested; there is no automatic placement.

Uses existing shared-puzzle locks, drop and acknowledgment mechanisms. Exact action tokens, current puzzle/session identity and dialog state guard asynchronous feedback. Placement is not optimistically claimed as complete; uncertain replies remain uncertain. Existing visual puzzle play, progress, rules, other games and backend are preserved.

Static tests and isolated native-browser QA are not an actual iPhone VoiceOver certification. Real-device assistive-technology testing remains necessary. Private source, user puzzle data, images and credentials are excluded from this public recipe. The content-only publisher verifies all module types, aggregate fingerprints, settings and runtime before and after deployment.
