# Puzzle sorting tray growth

Patch against current live app HTML. Root repository app.html predates the live application; do not deploy it over production.

Removed the fixed one-row inline height. Compact and enlarged trays wrap pieces into rows and grow naturally, capped to available table space with vertical scrolling. Header keeps its height; trays re-clamp after pieces are rendered and preserve scroll position across updates. Piece sizes, game logic and other modules unchanged.

Chromium checks at 360, 768 and 1200 px: height grows 78 → 128 → 228 px for 1 → 8 → 24 pieces; 200 pieces produce bounded vertical scrolling. Verified shrinking, scroll preservation after an added piece, zoom, enlarge, dock and restore, and bottom/right boundaries.

Base live version: be16bf4e-46d2-44e8-9bd4-2b1944fda6a7
Base HTML SHA256: 16a5fd661b9c84817aaf942acd95f21edc51b047b49ffd52385fe7620d86abaf
Updated HTML SHA256: fcfe1b982cd5956229da3c727259a505613e2fdfa5d9fc567bc0073cd09ff630
