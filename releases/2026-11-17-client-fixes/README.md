# Character-anchored chat presentation

App-only speech bubble and inline reply adapter. Uses verified sender IDs, preserves original private/group scopes and server authorization. Replying never acknowledges the incoming message. Uncertain sends reuse a client identifier; stale sessions and mention rosters are rejected/cleared. Existing controller/backend and all other modules remain unchanged.

Requires independent privacy review and full-shell private native visual/focus QA before main promotion. Existing content-pinned publisher retains baseline, MIME, settings, runtime and main-only deployment guards. No real messages or acknowledgments in QA. No private messages, credentials, artwork or member data are included in this recipe.
