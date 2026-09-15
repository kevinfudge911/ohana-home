# Ohana repair: Hand & Foot and zoom

Compared incoming Claude commits through cb3f84a against 8273daf. Preserved existing game records, membership, authentication and original island art.

- Moved word rack out of the scrolling game and anchored it to the visual viewport, including zoom scale and viewport offsets. Kept the 225-cell board renderer and pending-tile interactions.
- Rebuilt Hand & Foot with illustrated Eddie, readable real card ranks/suits, compact player scores, ocean deck artwork, meld selection and matching controls.
- Fixed active-foot cards, meld index zero selection, stale card selection between games, selection loss on rejected actions, and repeated move submissions.
- Computer candidates are validated on copied state; easy/medium/hard choices remain bounded and use only their own cards. Fixed invalid opening meld loops and states with no legal final discard.
- Added concurrent-state protection for Hand & Foot, rejected black-three melds, and supported valid going out by melding.
- New accepted human and computer moves record lastPlay; cards show exact local date/time. Older games show Last activity, not an invented historical move time.

Validation: UI checks for 225 cells, seven rack tiles, 2x viewport position, active foot and meld zero, rejected selection retention; nine simulated bot games across all three levels; profile, session, invitations, Game Nook and private-room regression checks.

Zoom reference: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport

Real-device pinch zoom still needs Kevin's confirmation; mathematical viewport positioning is covered in automated checks. No user game moves were submitted for testing.
