# Granny crossword device-keyboard option

Adds an explicit device-keyboard toggle within the visible crossword area. Device mode enables text input and bypasses the custom letter-key interceptor, retaining the original crossword input, answer and advance handlers. Existing custom keyboard remains available. Read-only and disabled cells cannot be edited through the custom handler. No game rules, persistence endpoints, schemas or other games change.

Tests cover mocked input/capture/focus/redraw safeguards and synthetic native browser interaction. This does not certify actual iOS keyboard behavior or VoiceOver accessibility. The content-only publisher pins exact aggregates, module types, settings and runtime; no private full app, saved answers, family photos or credentials are published in this recipe.
