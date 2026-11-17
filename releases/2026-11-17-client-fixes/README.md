# Rummy accessible control labels

Two client-only label changes identify the top discard (or empty pile) and each public target meld by owner, number and card names. Existing controls, disabled conditions, hands, scoring and game actions are unchanged. All other 145 modules and operational settings remain pinned and preserved, including the optional Mahjong timing implementation.

The public recipe contains patch code and aggregate fingerprints only. No private app, family photos, module inventory or credentials are included. The existing content-only publisher fails closed on baseline/output/configuration drift; previews check without deployment, and deployment is limited to the established main-branch CI workflow. Other publishers must remain paused; the last check is not a global atomic lock.

Synthetic native-browser and renderer tests do not establish actual iPhone VoiceOver behavior or full-app accessibility. No real moves are made for QA.
