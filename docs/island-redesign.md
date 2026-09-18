> Correction, September 18, 2026: Kevin explicitly rejected the pillow phrase "Good Games Brighter People". Any approval claim below is an erroneous historical assistant claim, not a user instruction. Follow OHANA-DESIGN-MASTER.md.

# Island design and expanded chat

The September 14 redesign coordinates the welcome form, Game Nook, rooms, game setup, Words and Mahjong tables, game chat, score receipts, and navigation. Ocean blue, mint, coral, lavender and warm sand replace dark enamel and heavy gold edges. Text uses dark ink on light controls. Original character portraits lead game setup and the signed-in header. Reduced-motion support remains, including a static alternative to the turn diamond glint.

No authentication, membership, scoring, game-state, or notification backend changes. Existing sign-ins and room privacy remain intact. Board SVG still paints 225 squares with 225 independent hit areas.

Game chat's + button and room chat's smile button open the same 350+ emoji picker. Eight categories and 24 locally remembered recent choices. Picking inserts into the draft at the cursor; it does not send. Input length limits and room/game context are checked before insertion.

Validation: game-setup, game-nook, private-rooms-ui, ohana-invitations, board-surface, emoji-picker, session-preservation, dialogue-mute, and drag-score checks passed. Browser visual inspection covered the welcome screen, phone-width Game Nook, game setup, Words board/receipt/chat, and Mahjong.

## Artwork applied after Kevin’s instruction

Kevin subsequently supplied the same illustration and explicitly asked to apply it. `assets/ohana-island.webp` is an encoding conversion of `assets/island-illustration-draft.png`; no composition or wording edits. The live porch, page backgrounds and game header now use it. The canvas uses Central Time tints, date-seeded clouds and stars, and ocean refraction. Photographic lighting frames no longer overlay the cartoon. Both chairs and the supplied pillow are retained.

`island-icons.js` supplies original SVG illustrations for navigation, room symbols, invitation, sound, notification, camera and game action controls. It preserves text labels and uses mutation observation to handle existing dynamic renders. Board/rack tiles, player avatars and chat emoji are excluded. The 350+ emoji picker stays intact. Preview pages load the same icon module. `tests/island-icons.cjs` verifies label preservation, repeated voice updates and exclusions. Browser checks covered the applied illustrated porch, compact Game Nook, game actions and chat. Session and board-surface checks passed.

Final generation prompt:

> Use case: illustration-story. Create a production background illustration for Ohana Home, a joyful Hawaiian island family game app. Wide landscape panorama, 1536x1024. Closely capture the hand-drawn 2D animated Hawaiian island atmosphere of Lilo & Stitch: curved expressive shapes, ink outlines, lush gouache tropical backgrounds, bright turquoise curling surf, warm coral pink hibiscus, teal palms, lavender distant Kauai mountains, fluffy stylized clouds and golden sunlight. A welcoming beachfront lanai game table in lower foreground with TWO wicker chairs, a cozy bench with a small cream pillow reading exactly 'Good Games Brighter People', wooden letter tiles and mahjong pieces, two soda glasses, tiny plumeria blossoms. Keep the central sky and upper middle ocean open, uncluttered to place live UI headings above it. A cute small hand-drawn smiling sea turtle peeking beside the lower left chair and a playful gecko near the hibiscus on right. Whimsical animation background, unmistakably CARTOON not photo, no 3D render, no photoreal textures. Polished illustrated game world, inviting family warmth and playful mischief. Do not draw interface buttons, no app title, no watermark. Landscape composition with all chairs and table visible. This is new artwork inspired by island animation, using original animal characters.
