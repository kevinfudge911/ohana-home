# Explicit wild-card choices

Requested by Kevin: selecting a wild card must let the player choose the card it represents, and add it to a chosen eligible pile.

Hand & Foot: per-card rank chooser, editable assignment buttons, pile tap assigns all selected wilds to that rank, and the meld payload groups wilds by the chosen rank. Multiple wilds can target different ranks in one Meld action. Existing natural-card ratios, maximum three wilds, points, and final-foot discard rule stay enforced.

Ohana 10: per-card number/color chooser, editable selections, explicit pile selection, server-side identity validation, and chosen values displayed on played wilds. Wilds retain physical wild status and 25-point score; assignment does not turn them into natural cards for discard-pile matching or an all-wild opening.

Updated How to Play. Tests: ten discard-opening regressions and seven wild-choice cases, plus 390px browser tests of both choosers, different assignments, tap-to-target, and submitted payloads, with no page errors.

Apply fixes/wild-choice.py only to a freshly recovered multipart Worker package. Do not deploy stale main or commit raw recovered backend (contains private push material). Preserve settings and original modules when publishing.
