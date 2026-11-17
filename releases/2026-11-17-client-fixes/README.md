# Chess square state and synchronous focus

Three guarded client edits name selected squares, available destinations or captures, and a king in check, and retain focus on the same square during synchronous board redraw. Restoration avoids newer focus, open modals, hidden targets and changed games. It uses the existing legal-move computation and public board. Move handling, rules and promotion behavior are unchanged.

This app-only recipe preserves 145 other modules, original MIME types, assets, settings and previous accessibility fixes. Public files contain generic patch code and aggregate fingerprints only. The reviewed publisher checks exact baseline/output and fails closed on drift. Previews do not deploy; only existing main-branch CI can upload. Other publishers must remain paused; final checks are not a global atomic lock.

Renderer and synthetic Windows Chrome tests do not establish physical iPhone VoiceOver behavior. Promotion remains separately unaudited and is not fixed here. No real moves are made for QA.
