# Visual wardrobe and additional fitted looks

Request: show all characters together so players can choose by sight, then finish the outfit collection.

Gallery changes: all 43 distinct characters are visible in a scrollable visual gallery with free-standing images and plain names underneath. Tapping a character opens a pictured outfit gallery. Eddie's existing Chauffeur selection is grouped under Eddie while preserving the saved avatar ID. Selection and preview do not write to the account. The selected look is saved only with Wear this look. Back returns to the full character gallery; Cancel and Escape leave the saved look unchanged. Character and outfit names are accessible button names, selected state uses aria-pressed, and loading failures leave the selection controls disabled. Reduced-motion preferences are respected.

Additional artwork is generated from the actual approved character references with the built-in image tool. Each shipped variant is reviewed for face identity, body shape, full-body framing, clothing fit, and transparent background. App images are converted to WebP without altering the artwork. Exact accepted variants are in wardrobe-expansion-catalog.json; generation prompts and references are in wardrobe-expansion-prompts.json.

Scope limitation: this does NOT finish thousands of outfits for every character. Most characters still have only their original look. Do not count personality fields, duplicate entries or uncreated clothing as outfits. Further character-specific artwork and a larger asset-delivery design are needed for the full requested catalog.

Validation uses the actual app scripts and styles at 390px and 961px. Checks cover all gallery image decoding, no portrait boxes/borders/shadows, image-based character and outfit choice, no writes during preview, save/reopen, player name preservation, cancel, loading failure and horizontal overflow. The actual backend handler validates and persists each added outfit in an account-scoped atomic update. Actual Worker image route responses are compared to source bytes. Live authenticated user gameplay is not exercised.

Deployment preserves current live source, inherited bindings and Durable Object exports. Binary assets MUST upload as application/octet-stream; fetched multipart Content-Type is not reliable. Patch baseline dc12b5c4-140a-4df1-8196-7c8d15c2e93d. Root repo app.html remains stale; apply this patch to that live baseline.

Published deployment 99a9a07956254018a6afe63904a511f8: 11 additional fitted outfits (Bandit Doctor/Chef/Everyday/Explorer; Honu Police/Nurse/Firefighter; Eddie Police/Nurse/Firefighter/Chef). All 214 published modules matched tested source bytes. Bindings unchanged.
