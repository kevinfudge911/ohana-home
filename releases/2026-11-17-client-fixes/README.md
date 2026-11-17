# Full-size profiles and grouped character selection

Profiles open as full-size dialogs. Owners can edit their existing name/about fields; other members remain read-only with the existing visible fields and actions. Character selection is grouped by habitat and animal/name, with each animal's available outfits together and a nearby Wear control. Preview is not an implicit save.

Client save handling retains owner/session/navigation guards, serializes outstanding saves across dialogs, and reconciles confirmed same-account results even after the dialog closes, without stealing later focus or updating another account. No real profile data is changed for QA.

The Worker change is limited to the existing authenticated profile endpoint: a nonempty avatar exactly equal to the owner's current stored value may remain unchanged even if absent from its older picker list. Unknown changed identifiers still fail validation; name/about limits, duplicate names, SQL owner keys, authentication and other avatar routes are unchanged.

The recipe changes only the app and Worker entry, preserving 144 other modules, MIME types, assets and operational settings. Public files contain generic patches and aggregate fingerprints, not private app data, family photos, credentials or a module inventory. Preview checks never upload; only established main-branch CI deploys. Exact input/output and configuration drift fails closed. Other publishers must remain paused; the last recheck is not an atomic lock.

Synthetic Chrome/native viewport and mock-save tests do not certify physical iPhone VoiceOver behavior. No new permission to edit other members or expose additional fields is introduced.
