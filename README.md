# Ohana Home — Family Game Hub

Existing Cloudflare Worker for ohanahome.app. Root `worker.js` imports `app.html` and `ohana-welcome.png`. `wrangler.toml` retains the existing Ohana D1 binding.

Build check: `npx wrangler deploy --dry-run`

Deploy after review: `npx wrangler deploy`

See `DESIGN-REVIEW.md` for changes, verification limits, and local preview instructions.
