# Ohana Home interface audit — 2026-09-16

Scope: all five navigation tabs; four game shelves; sign-in, invitation and waiting screens; all six games; shared chat, help, audio, character selection and game controls.

| Area | Finding and repair |
|---|---|
| Bottom navigation | Unified illustrated five-button dock, legible labels, distinct colors, selected underline/outline, turn badge, safe-area padding. |
| Games shelves | Content-sized cards, two columns when space permits, no nested hero, room chat beside heading; preserve scores, last play and cross-room navigation. |
| Start game | Compact setup spacing, inline choices, consistent raised actions; retain room, opponent and difficulty options. |
| Chat | Compact composer and reactions; conversation remains the main content. No messages sent during testing. |
| Ohana | Compact member rows with character, presence, biography and direct invite; external invite retained. |
| Rooms | Compact welcome and door cards; actions wrap instead of filling separate rows; private room membership unchanged. |
| Settings | Compact preference/device tools; profile and character selection retained; accessibility near top, sign-out still confirmed. |
| Join/invites/waiting | Shared button styling and readable fields; retain invitation context and member invitations. |
| Words | Remove 600px surface limit; full-width option; rounded Fredoka letters with dark coral Nunito point values; preserve 225-square SVG surface and hit targets. |
| Checkers | Remove 420px limit; character medallions on colored pieces, king badge retained. |
| Memory | Remove 360px limit; illustrated Honu backs, hidden card identities unchanged. |
| Tic-Tac-Toe | Remove 330px limit; scale marks with board width, retain high-contrast X/O. |
| Mahjong | Remove 680px limit; compact progress/tools/scores; instructions available in Help. |
| Hand & Foot | Remove 760px limit; compact felt/actions; preserve staged melds, foot and round rules. |
| Shared game controls | Remember Wide/Fit preference; accessible help dialogs; keep Sound and Next game controls. |

## Verification
Functional suites: game-nook, game-setup, private-rooms-ui, profile-settings,
settings-organization, next-game, ohana-invitations, session-preservation,
dialogue-mute, emoji-picker, ohana-repair-ui, board-surface, mahjong-ui,
handfoot-rules, accessibility. Automated accessibility covers all six games,
Settings, Chat and Sign in; it is not a substitute for testing with actual
TalkBack/VoiceOver users. Simulated zoom confirms the rack remains in the visual
viewport. Fixtures use fictional players and isolated storage; live family games
and accounts are not used for test moves.

Visual verification is performed against the published fictional preview, including
all games and navigation screens. Limitations and any remaining findings should be
recorded before sign-off.

## Visual findings and final status
All six game surfaces and Settings, Chat, Ohana, Rooms, Start game and Sign in
were inspected in the cloud browser using fictional previews. The home shelves
were also inspected in the preceding compact-layout audit.
Found and corrected a low-contrast room-creation heading and over-expansion on
large desktop screens; desktop starts in Fit mode, phones/tablets up to 1000px
use Wide mode unless a preference is saved.
Hand & Foot cards now scale up to 116×174px, with larger ranks/suits and wrapping
spacing. On narrow screens cards scale between 65×98px and 88×132px.
The final enlarged-card revision passed DOM/gameplay and accessibility checks,
but its Cloudflare upload was rejected by automatic approval review. It is saved
locally pending explicit destination authorization and final live visual review.
The prior shared style revision is deployed as f713b54c-4278-46c0-a6ea-8d4486c74d95.
No real screen-reader device test or exhaustive real-device viewport test has been
performed; the browser preview and automated checks do not establish those claims.

## Approved deployment — 2026-09-16
User explicitly approved the pending GitHub push and Cloudflare deployment.
Revision f81e46c is on main and deployed at 100% as Worker version
17883149-6dcb-4ff8-9bac-68d6388847fd.
Live fictional Hand & Foot preview visually checked: cards measured 116×174px;
rank/suit artwork and action row remain readable. Wide/Fit persistence passed
the DOM interaction test; cloud browser click/keypress delivery timed out, so
that specific live click is not claimed as verified.
