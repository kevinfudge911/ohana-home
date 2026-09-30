# Ohana character and wardrobe release

User-authorized scope: introduce Bandit on the home wall, create about 25 additional freestanding animal characters, then begin a wardrobe with professional, everyday and fun outfits that fit each character and let players build a personality.

Release implemented: Bandit plus 20 new animals; fitted Bandit original, police, nurse, firefighter and aloha looks; preview-and-save wardrobe; optional character nickname, personality trait and saying. Player names are never changed. Profile selection, home wall and in-game avatar rendering use the existing artwork/layout paths. New friends use their still portrait for speech until proper talk sprites are made.

Important limitation: this is the FIRST fitted wardrobe release. Thousands of clothing options across every character are NOT completed. Do not claim that count from personality choices or count unbuilt assets. Expand only with character-specific fitted artwork; do not use floating generic garment stickers, global hue shifts that recolor fur, circles, boxes or framed nameplates.

Next production work: fit police, nurse, firefighter, EMT, doctor, teacher, chef, builder, postal worker, farmer, professional driver, casual, formal, beach, explorer and playful/fantasy collections to each body shape; add compatible color/accessory variants and saved favorite looks. Validate ears, wings, paws, tails, collar/neck and body occlusion per variant before inclusion. Scale to thousands only from visibly distinct, compatible clothing combinations.

Validation: authenticated handler tests invalid avatars/lengths/traits, account-scoped settings, atomic avatar/personality save and reload. Browser tests preview, selecting fitted outfit, preserving player name, save/reopen, Cancel, load errors, mobile/tablet overflow. Image decoding and live-module integrity checks supplement these. Live authenticated user gameplay is not exercised.

Deployment requirements: worker.js as application/javascript+module, WebP/PNG as application/octet-stream, other imported text as text/plain. NEVER trust downloaded multipart MIME (all parts report text/plain). Preserve Durable Object exports and inherited bindings. Repository root is stale; apply patch to live baseline 1d0f538b-0511-4fb2-9122-89fb00f3b98b.

Published deployment: dc12b5c4140a4df181967c8d15c2e93d. All 203 modules matched downloaded production bytes after upload; inherited bindings unchanged. 25 image routes tested against actual Worker code.
