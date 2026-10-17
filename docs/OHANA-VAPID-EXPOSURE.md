# Confirmed private push-key exposure — unresolved

User supplied GitGuardian alert screenshot for repository kevinfudge911/ohana-home, secret type VAPID Key. Alert authenticity/link destination was not independently checked or clicked. Repository source independently confirms the issue: current live/worker.js contains a literal VAPID private key alongside its public key, used by createVapidJwt. Do not dismiss this as the normal browser public key. No key values are copied into this report.

Confirmed current main content through the GitHub connector, in addition to canonical local worker. The key is in version history and historical app/worker candidates too. Existing local audit script prints lengths/pair-match booleans only, never values. The alert's exact flagged path/commit is not yet known. No evidence establishes malicious use or compromise of puzzle data.

Required remediation: generate a fresh VAPID keypair; configure private key in Cloudflare's encrypted Worker secret; replace literal signing-key code with environment-secret access; serve the matching public key to browser subscription flow; handle old-subscription re-enrollment without deleting family data; test token signing with synthetic keys and no live pushes. Retire the exposed keypair, then address historical exposure/alert using a deliberate repository-history plan if needed. Removing a literal from current source alone does not revoke an exposed key.

No rotation, secret configuration, source deployment, history rewrite, subscription deletion, push message or puzzle mutation has been performed. Browser is unresponsive and Cloudflare CLI installation failed with DNS/network resolution; connector access is GitHub-only. Do not deploy an unconfigured secret-dependent worker or claim remediation complete. Do not print keys, tokens, push endpoints or private family data while investigating.

