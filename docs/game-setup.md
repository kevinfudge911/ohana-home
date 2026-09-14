# Unified game setup

Every game card contains inline buttons for the user's joined rooms and Ohana/computer opponents. Mahjong also has solo play; games supporting more than two humans offer seat counts. Words retains classic/random boards. These controls use no native select menus. Settings survive sync rerenders; creation enters the selected room before making the API call.

All five games accept Easy, Medium and Hard computer play. Hard Tic-Tac-Toe uses exhaustive minimax; Checkers evaluates three plies; Memory retains revealed cards and consistently uses known matches; Mahjong prioritizes opening the stack; Words selects the best visible score from a bounded search of the existing friendly vocabulary. Hard Words is stronger, but not a full-dictionary tournament engine. Hidden mystery squares are excluded from its scoring trials. Easy remains the default.

Existing games keep their difficulty. No saved boards or scores are migrated. Tests cover all 15 game/level combinations, all human continuations against Hard Tic-Tac-Toe, no hidden-card access, backend creation with Hard in a private room, and inline setup selections and room ordering. /setup-preview is an interactive fictional preview with no game writes.
