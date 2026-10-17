# Updates reachable exits — private follow-up

Live390×844 Close was visible;844×390 Close345–393 was partly outside viewport and dialog bottom360. Scroll-and-click worked but no Home existed.

Draft preserves original picture/copy/input/Previous/Next/Close nodes and handlers. Adds canonical Home header, scrolling count/story body, fixed checkbox and44px navigation footer. No preference defaults changed. Existing remember behavior remains on page change and close.

Run prepare.cjs or transplant.cjs with fresh latest app; writes private output only. Exact inverse scope passes. check-semantics.cjs executes actual modified function in mock DOM and checks checked-state roundtrip, Previous/Next, original copy, Home close. Actual browser fixed layout remains unverified. No deployment/worker/broad Android history changes.

Home cleanup revised per root: closes existing Bridge, uses existing music-leave event and Memories-shell close, then porch. A Home-only flag skips remember() on close, so merely returning Home does not save current optout. Normal Close and Previous/Next keep existing remember behavior. Updated actual-function mock checks pass all cleanup calls, no Home save, normal Close save and unchanged checkbox roundtrip. Exact inverse transplant passes.
