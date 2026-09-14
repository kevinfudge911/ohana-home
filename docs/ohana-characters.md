# Ohana characters and friendly computer games

Six player choices: Honu (@hon), Splash (@spl), Kiko (@kik), Pebble (@peb), Mango (@man), Sunny (@sun). Four-character IDs preserve the existing avatar column and sign-in contract. Existing emoji choices remain available. Family → Choose my Ohana character saves the authenticated player's avatar; all score and chat renderers share avatarMarkup.

Artwork uses the built-in image-generation tool, with Honu as style reference. Portrait prompt set: one welcoming full-body dolphin, gecko, monk seal, macaw or crab, expressive eyes, warm light, detailed 3D family-animation appearance. Sprite prompt set: same identity, four evenly spaced resting/talking/waving/blinking frames, plain teal background. Dolphin portrait background was corrected to teal after visual inspection. Production assets are buddy-*.webp and talk-*.webp in this repository.

Talking uses illustrated sprite frames while device speech plays. It is not phoneme-level lip synchronization. Voice profiles select available English device voices with character-specific pacing/pitch; named natural voices are preferred where installed. Voice availability and quality vary by device. Muting cancels speech, suspends game audio, persists locally, and leaves captions and points visible. The dialogue generator cycles through 8,000 scoring combinations before repeating a full combination.

All five games support Honu as an Easy or Medium computer opponent. Moves use existing game validation and atomic compare-and-update persistence. Memory uses only revealed card observations (Easy remembers at most four). Words uses a small everyday-word vocabulary, no score maximization and no surprise-square optimization. Mahjong matches available visible tiles. No model API or paid voice service is required.

Checks: tests/bots.cjs; tests/characters.cjs; tests/dialogue-mute.cjs; tests/mahjong.mjs. DOM tests require jsdom via NODE_PATH. /buddies and /mahjong-preview are local-progress public demos, with no family account mutations.

## Expanded roster

15 more illustrated characters: Otto (otter), Pippa (puffin), Lulu (bunny), Hoot (owl), Flutter (butterfly), Rosie (piglet), Koa (puppy), Milo (kitten), Bamboo (panda), Coco (koala), Finn (shark), Inky (octopus), Kai (seahorse), Flora (flamingo), Reef (sea dragon). Total: 21. Each has a four-pose talking/waving/blinking strip and its own device voice profile. The original six remain visible first; the expanded group opens automatically for a selected new buddy.

Generated with the built-in image tool using Honu as style reference. Prompt set specified one new animal identity per strip, matching warm detailed 3D family-animation style, exactly four equally spaced full-body resting/talking/waving/blinking poses on a plain teal background. Each character’s resting frame supplies its portrait. Original masters remain in generated-image storage; production WebP assets are in this repository. All 15 strips were visually inspected before packaging.
