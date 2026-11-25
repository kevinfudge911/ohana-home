Release job for Ohana Home (Cloudflare Worker "ohana-home", ohanahome.app): clean Ohana Memories album with sharp photos. Run only after the owner's own Yes to putting it live.

1) Read the newest ohana-home handoffs in AI HQ (folder 1eQUsB6_1Jmvn_fM4pncgisnwQtj86xdD), including "HANDOFF - Ohana Memories easy add, edit, delete, albums (Nov 25 2026)" (1PbD8A2T32__MKJf6WYGWLcKG-41ROTMmI3bFtPq4vMQ).
2) Download the NEWEST live ohana-home worker (all modules, bindings, settings). Note the live version id for rollback. If the dark-hall fix is live, patch on top of it; never roll it back.
3) From GitHub kevinfudge911/ohana-home branch claudine/memories-easy-20261125: node memories-easy/apply-to-worker.cjs <live worker.js> <new worker.js>. Stop on any error.
4) node --check <new worker.js>. Upload with only worker.js replaced; keep everything else exactly as live, including the MUSIC_FILES R2 binding (full-size photos live there). In the same step, put the release on GitHub too, as the deploy doc in AI HQ (1BWwl8u1VSxbrtAE8te5Qp4mwty3i3sPBguYJo6P49L0) says. Keep the add-on as its own small files; don't fold it into one big file.
5) Check live: /memories has id="ohana-memories-easy-v1"; POST /api/memories/photo/00000000-0000-0000-0000-000000000000/edit answers 401 when signed out, and GET .../original never returns a photo when signed out. Signed in as CodexTest, add one test photo: the big view must show the full-size copy; then delete it. Look at /memories at phone size (expect and inspect). If anything breaks, roll back at once.
6) Append the result (new version id, rollback id) to the handoff doc above.
Rules: test only with CodexTest (10042); never family accounts; never delete or change family photos; message no one; never type passwords; do not touch Ohana Town art.
