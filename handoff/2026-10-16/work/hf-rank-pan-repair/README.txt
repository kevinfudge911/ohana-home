HF actual-card rank + native-pan repair — bounded private candidate

Base work/final-current-release/app.html6148332. Three guarded replacements plus scoped touch-policyCSS, no worker/rule changes. Original footprint64x96 and overlap unchanged. Reverts compact rankleft10px override to original25%palm/23%foot;18px textfits inside actualplayingcardshape. Physicalphone screenshot complaint matches that accidental facegeometry override.

Nativegesture handling: HF touch no longer enters shared card-rearrangement pointercapture/ghost path. Singlefingerpan/pinch stays browser-native; tap selection preserved. Mouse dragging and Alt keyboard reorder retained. Touch dragging to reorder is intentionally yielded to nativepan. This is a tradeoff, not a claim that allgesturefeatures remain. Table-edge observer now avoids redundant CSS writes, reducing resizefeedback work; no measuredproof of priorloop, so this is a bounded prevention rather than provenfreeze rootcause.

Actual8844 resizedChrome390: visually8/9/10/A/K fully inside originalpalm and readable through overlap; actual9tap1selected10points. Rerender remainsresponsive. Computed touch manipulation supportsnativepan/pinch. No physicalphone multitouch toolavailable, so realdevice pinch/freezefix requiresKevin retest. Viewportreset. Evidence ranks-phone390.png. Unitcheck covers touch no capture, mouse capture, Alt reorder and exactinverse;25scriptsparse.

Use transplant.cjs latestApp outputApp. Optional cumulative app-without-duplicate-home.html adds root's separate work/remove-duplicate-home.cjs hunk only; do not copy stalewholeapp over other edits. Parent owns merging/publishing.
