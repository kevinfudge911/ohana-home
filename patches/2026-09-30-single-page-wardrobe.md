# One-page character and wardrobe selection

The user's 1000055426.mp4 recording showed two independent animal catalogues (Settings buddyPicker and the wardrobe dialog), a gallery-to-detail screen transition, a duplicated large preview, Original-only animals presented as wardrobes, and global runtime button decoration overriding the previous isolated styling tests.

This patch removes the Settings buddyPicker and Open wardrobe button. Settings mounts the wardrobe directly once, outside the separate profile form. News wardrobe links route to this same Settings page. The catalogue stays in place, and selecting a character expands clothing choices after its grid row. No wardrobe dialog, Back screen, duplicate large character preview, or duplicated Original image tile is created. The original look is a text button when alternatives exist. Saving stays on the page; reset restores the saved look without writing.

Each character states its available alternate-outfit count or Original only before selection. A Show characters with outfits available checkbox filters the catalogue to Bandit, Honu, and Eddie. Original-only animals show an honest availability message instead of a duplicate image. Personality fields are optional expandable controls. Existing artwork, game rails, player names, API routes and storage are unchanged.

Validation: used the actual complete production HTML plus its external ohana-scene.js and island-icons.js runtime scripts, with a mocked account/API. At 390px and 961px, checked one Settings catalogue, no old picker or wardrobe dialog/back screen, inline selection, 43 characters, filter to 3 equipped characters, no duplicate preview, outfit counts, unsaved preview, saving, reset, reopening, no horizontal overflow, and computed absence of portrait backgrounds, borders and shadows after the full runtime ran. Both viewport checks had no page errors. Reviewed screenshots. These tests do not assert authenticated live gameplay.

Catalog limitation remains: only three characters have alternate fitted clothing. This change makes the available clothing directly reachable and does not represent thousands of completed outfits.

Patch baseline: 99a9a079-5625-4018-a6af-e63904a511f8. Apply to the live app module, not stale repository root app.html. Deployment must preserve all other modules and bindings; binary images upload as application/octet-stream.

Published deployment: 19da03006b464082b2eba0e3fb32e1e8. Database and puzzle bindings unchanged.
