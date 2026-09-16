# Hand & Foot audit — September 16, 2026
Sources: https://bicyclecards.com/how-to-play/hand-and-foot and https://www.pagat.com/rummy/handfoot.html

There is no universal ruleset. Ohana offers individual play, not partnerships. Its published rules use 11 cards in each pile, two draws/one discard, no all-wild melds, at most three wilds with more naturals than wilds, one clean and one dirty book to go out, and a final discard. These choices are explicitly stated in the in-game guide.

Fixed: atomic multi-group opening; displayed staged combined value; correct 8/9 values; seven-card books; natural-pair/immediate meld discard pickup, the entire discard pile (Kevin’s house rule); unopened foot is face down and visible as a separate pile; final-hand discard passes the turn, while melding the hand away allows continued foot play; foot red threes replaced; insufficient stock ends the round; action failures cannot mutate cards or draw flags. Computer players can combine natural groups.

New games: players + one standard decks, two jokers per deck; valid initial discard; four rounds, opening requirements 50/90/120/150. Round scores and room chat preserved between deals. Existing games retain dealt cards and scores, and their original single-round/score-based opening arrangement. No historical scores were recalculated.

Coverage: multi-group success and invalid pair rejection, rollback, card values, foot continuation vs next-turn pickup, hidden cards, whole-pile pickup with immediate meld, four rounds, chat preservation, nine bot simulations at three difficulties, UI staging after rejected requests, and accessibility suite.

Variant differences: partnership permission and shared melds, 13-card deals, all-wild books and alternate book requirements are not implemented. These are not silently claimed as universal rules.

House-rule update: pickup now takes every discarded card. Cards join the current hand before hand-to-foot progression is checked. Invalid pickups roll back the complete operation. Existing deals and scores are not modified.
