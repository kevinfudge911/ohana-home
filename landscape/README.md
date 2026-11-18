# Ohana sideways (phone landscape) layout v1

Live on Worker ohana-home version 7e31cda3 (Nov 18 2026, 5:23 PM CT).

The block in `ohana-landscape-v1.html` sits in the app HTML right after
`<!-- OHANA AUTO UPDATE END -->`, between `<!-- OHANA LANDSCAPE START (2026-11-18) -->`
and `<!-- OHANA LANDSCAPE END -->`.

Only acts when the screen is sideways and 500px tall or less (phones). Portrait and tablets are untouched;
everything it set is removed when the phone turns back upright.

- Game header (sign, home, next) shrunk to 60%.
- Bottom bar in games becomes one slim row (players left, buttons right), 56px instead of 117px; Spades gets its own 62px row with name, money and bags.
- Home bottom bar 60px instead of 112px.
- Dominoes hand tray 78% so the whole line of play shows.
- Menu/Hide toggle smaller, Daddy's joke popup sits higher.

The workstation controller (`ohana-workstation-collapse`) rewrites inline styles often; this script re-applies its
values right after (MutationObserver, same frame) and keeps `--game-rail-space` matched to the slimmer bar.
