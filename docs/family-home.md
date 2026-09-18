# Family home correction and continuation

September 18, 2026. Kevin corrected the assistant: Ohana Home is about family, and the pillow saying Good Games Brighter People was never approved. The assistant recovered September 14 user objections confirming the earlier wording was wrong. Kevin subsequently resolved the wording explicitly: "nobody gets left behind or forgotten". That exact text is now embroidered on the pillow in the final asset.

## Implemented

A cozy illustrated family room opening onto the island: sofa and quilt, framed childlike drawings, a wall cross, two wicker chairs and glasses of soda. The rejected lettering is removed. The cream pillow now carries Kevin’s approved wording above its embroidered flower. This replaces the default main-home scene and ordinary welcome-scene source, while garden/cove room identities remain.

The home table now includes the actual current room members, excluding the signed-in person who already has their near seat. Up to five members are displayed with See everyone linking to the existing Ohana screen. Selecting Save a seat opens the existing game-invitation dialog for that member; it does not automatically send an invitation. No fabricated presence status or membership is added. The familiar welcome text is visible above the game tabs. House rules, special card shapes, chat and game handlers are preserved.

## Validation

Browser tests passed at desktop and phone sizes: current-room member display, correct person in the invitation dialog, cancellation, Ohana navigation, more-than-five-member layout, no horizontal page overflow, Start a game and Room chat. Tests used local sample state, sending no invitations or messages. The live Worker differs only in one static import and route, verified by removing those lines and comparing it with the recovered original. Earlier engine tests remain applicable because engine source is identical.

Apply tools/apply-family-home.py to a fresh recovered package of the illustrated-details release. Never deploy the stale root worker.js or main. Current HTML, scene and screenshots are under design/premium. Screenshot people/game data are local samples.

## Artwork file and final edit prompt

Built-in image-generation tool. Final production asset: assets/ohana-family-home-v2.webp. This uses the corrected image, not the earlier rejected text-bearing draft.

Edit this game background. REMOVE ALL LETTERING from the cream pillow on the left sofa: the words 'Good Games Brighter People' are explicitly rejected. Leave that pillow cream fabric with the small red embroidered flower only. Do NOT invent any replacement saying. Keep the rest of the room's cozy premium cartoon art, sofa, quilt, wall cross, drawings, warm wood, ocean doors and open central floor. Restore a SECOND matching wicker armchair beside the right-hand seating area further back near the bookcase, so there are TWO clearly distinct wicker armchairs and the sofa, with realistic furniture scale. Add two small glasses of soda with ice on a small side table between the wicker chairs. Keep the large central floor clear for the live game table. Do not add any new words anywhere. Preserve the illustrated aesthetic, warm color palette, lighting and composition as closely as possible.


## Approved final lettering edit

The earlier unlettered-pillow step was temporary and is superseded. Final built-in image edit prompt:

Edit ONLY the cream pillow on the left coral sofa. Add the user's explicitly approved saying in neat, very legible dark brown embroidered lettering, with exact wording: 'nobody gets left behind or forgotten'. Arrange across three or four balanced lines to fit naturally on the pillow, maintaining the pillow fabric and its small red embroidered hibiscus. Text must spell every word correctly and remain large enough to read. Do NOT use 'Good Games Brighter People'. Preserve everything else in this image: both wicker chairs, two glasses of soda, quilt, wall cross, drawings, furniture, open central floor, warm wood, beach view, lighting, rich premium cartoon illustration, landscape framing. No other changes.

## Publication status of lettering

Published and verified on 2026-09-18. The live pillow reads exactly: “nobody gets left behind or forgotten”. Public HTML references ohana-family-home-v2.webp, and the public image bytes match the approved production asset. All 73 live Worker modules match the prepared package. Version a565bb8c-19ec-4cf9-8c99-528285724fbc is active at 100%, deployment af40b182-3312-4ac1-b294-2c302e345a3f.

This publication changes only the home artwork and its references; all game source remains unchanged. The old v1 asset route also serves the approved image for cached clients. The prior publication blocker was resolved through a normal authorized retry after the user renewed the instruction to publish using the saved Drive key.
