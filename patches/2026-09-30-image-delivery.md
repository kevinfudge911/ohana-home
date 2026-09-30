# Critical deployment correction: binary image modules

Cloudflare downloaded multipart source reports every part as text/plain, including binary assets. DO NOT reuse downloaded Content-Type as upload module type. Doing so imports WebP/PNG as strings and corrupts Response image delivery even when downloaded source bytes match.

Upload worker.js as application/javascript+module; .webp and .png assets as application/octet-stream; imported textual assets as text/plain. Keep Durable Object exports and inherited bindings. All 122 binary images retain their original bytes. No layout, identity, character selections or artwork changes.

This HTML patch versions 121 WebP references with asset=binary2 so browsers request fresh artwork instead of cached corrupt responses. Inline scripts compile. Public-site fetch from execution environment is blocked with HTTP403, so live tablet rendering cannot be claimed. Verify deployment packaging and module bytes separately; source-byte checks alone missed this regression.

Baseline HTML: 733e5f1a-01cc-4dbe-af22-6eca7fb2b0cc. Binary packaging initially repaired in 07567018-137f-4f74-96f8-180d3bf87a91. Apply to current live source, not stale repository root app.html.
