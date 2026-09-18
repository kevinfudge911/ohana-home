> Correction, September 18, 2026: Kevin explicitly rejected the pillow phrase "Good Games Brighter People". Any approval claim below is an erroneous historical assistant claim, not a user instruction. Follow OHANA-DESIGN-MASTER.md.

# Accessibility and regression audit — September 15, 2026

Implemented keyboard word placement and repositioning, square coordinates and bonuses, checkers selection and destinations, named Tic-Tac-Toe and Memory squares, readable Hand & Foot ranks/suits, focus restoration after rendering, named chat controls, new-message announcements, and a named Mahjong progress indicator. Hidden Memory faces remain undisclosed. Existing scoring, card state, room permissions and session storage were not migrated.

Accessibility & install help is available before sign-in and inside the app. It explains keyboard and screen-reader gestures and platform installation steps, with independent sound-muting and reduced decorative motion preferences. App mute does not control the device screen reader. The dialog uses native modal focus containment, Escape closing and focus return.

The approved cartoon island asset and its Good Games Brighter People pillow were visually inspected. Old photographic welcome/header CSS references now use the same cartoon artwork.

## Automated coverage

All existing regression scripts were executed. Character tests were corrected from 21 to 22 (Eddie) and the expanded roster from 15 to 16. Other checks covered word board surfaces, scoring and mystery bonuses, bots, Hand & Foot rules, Mahjong, invitations, room isolation, profiles, session preservation, push encryption/controls and dialogue variety/mute. Final corrected character tests passed.

`tests/accessibility.cjs` exercises keyboard placement/repositioning, arrows, focus across refresh, intact 225-cell surface, Memory concealment, checkers selection, Mahjong selection, Hand & Foot selection, labels, help focus return, mute and motion settings. Axe checks pass for the six game screens, settings, chat and sign-in. This jsdom audit excludes color-contrast (requires rendered layout) and region/landmark coverage; it is not a WCAG conformance claim.

Run with `NODE_PATH=/tmp/ohana-qa/node_modules node tests/accessibility.cjs` after installing jsdom and axe-core in the test environment. Other JS/Python tests live in `tests/`.

`tools/build-accessibility-preview.py` produces `/accessibility-preview`, a fictional practice surface with no production API calls, service-worker registration or real account storage. It supports selection/navigation checks, not authoritative server game-rule verification.

## Required device acceptance before claiming blind accessibility

Not performed by the cloud browser: TalkBack, VoiceOver, NVDA speech output, operating-system install prompts, actual device push reception, touch exploration/rotor navigation, and simultaneous screen-reader/game audio. Human testing is necessary; no guarantee of trouble-free blind access has been made.

On Android Chrome/TalkBack and iOS Safari/VoiceOver, verify install and reopen; sign in without assistance; navigate Games/Rooms/Chat/Ohana/Settings; choose an avatar and save; locate only joined games; invite a consenting test account; enable/test push; play each game with speech alone; reject an invalid word and dismiss its centered error; verify scores/bonus breakdown; move a draft tile; keep the rack available at zoom; read/send a test-room chat; mute game voices; leave/reopen without losing sign-in. Use isolated test rooms, not the family's live games.

Image-only chat messages currently announce their presence and sender, not an automatically generated description of their contents. Photos therefore still need a text description from their sender.

## References

- WAI keyboard navigation guidance: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- Native modal behavior expectations: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- PWA installation differences: https://web.dev/learn/pwa/installation

## Hosted browser verification

On the hosted fictional fixture, Enter selected a rack F, Enter placed it at row 7 column 11, then Enter/Right/Enter moved it to column 12. The focused square and accessible name followed the moved tile. The intact board and illustrated Hand & Foot table were visually inspected. A help-dialog Tab escape found in the browser was fixed with explicit first/last control focus cycling and an added regression assertion. Live welcome artwork was inspected separately.
