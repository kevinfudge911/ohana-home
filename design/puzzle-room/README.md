# Picture-led Puzzle Room

User requested a full Puzzle Room layout repair, preserving Antigravity's latest live updates. Source recovered fresh from the live Cloudflare Worker. Only the public app HTML module changed; backend modules and assets remain byte-identical. Do not deploy the stale root Worker or branch snapshot.

Changes: room-image selectors using the same room mapping as Rooms; compact two-column phone picture gallery; real edge-shape previews drawn with existing pzEdge; visual piece-density choices; selection preview; collapsible New puzzle builder retaining its open state during photo changes; album images rendered as actual image elements to avoid global button-background overrides; legible album labels; removal under Options; scoped high-contrast helper text. Existing event handlers and permissions preserved.

Validation: isolated sample-state browser tests at 390x844, 844x390 and 1280x900. No page errors. Picture, count and shape selections update the preview and correct create payload. Room switching, album view/close, photo upload/clear, keyboard expansion/collapse and horizontal overflow checked. Test API intercepted; no family puzzles or messages created/changed. Screenshots contain sample state, not production family data.

Apply apply.py to a freshly recovered public app HTML file. Preserve all other live modules and bindings. Existing PuzzleRoom namespace is SQLite-backed and must remain unchanged. Cloudflare upload metadata must declare the existing PuzzleRoom export with type durable-object, storage sqlite, state created; never delete/recreate its namespace.

Published and verified version e4420cf5-4e5c-492a-8d41-1335fc6895b9 at 100%. Public HTML and all 381 live modules match the tested candidate; existing PuzzleRoom namespace binding is unchanged.
