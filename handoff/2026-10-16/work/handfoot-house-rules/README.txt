Isolated Hand & Foot house-rule candidate — not published

Base: work/retry-release/app.html and worker.js. Builder prepare.cjs creates private app/worker only; owner-near-hand.cjs adds the red-three row to existing world-hand relocation list. Guarded transplant.cjs takes latestApp latestWorker outputApp outputWorker and preserves every unrelated byte. Worker gzip deployment source must be recompressed by parent after integration; no config change here.

Black threes: zero value/leftover penalty; still block pickup with held pair. Pure own-side group of at least3 permitted only while playing foot, with an existing clean and dirty book, and all remaining cards except exactly one final discard. Cannot combine this action with other groups. Black threes never count as books or earn book bonuses. Server is authoritative; frontend permits pure selection and shows0selectedpoints. Atomic trial/commit wrapper preserved.

Red threes: existing automatic collection/replacement unchanged. Collected bonus requires owner opening:100each; four1000 per player; no first-player race. Actual reds still in current hand or unopened foot subtract300each. Owner name/count displayed on each public side and own row relocated immediately beside hand area.

PROVISIONAL, MUST BE DISCLOSED: beyondfour currently1000+100each extra; unopened already-setaside reds currently0bonus/no penalty because the−300 request explicitly named actual hand/foot. Those two policies are not settled by the JSON; do not silently publish assumptions. Candidate does not gate on a new rulesVersion; parent must decide applicability to existing tables before production.

Tests: test-engine.cjs12 substantive groups including atomic rejects; test-ui.cjs pureblackselection/no wild/red;25inline scripts parse and ESM worker syntax passes. Actual browser pending root8835. Fixture only is never deployed. No production mutations.

LATEST HF LAYOUT REQUEST (not implemented; after urgent Dominoes): draw+discard immediately above ownhand/turn, ownmelds above those near current approved sample area, ownfoot bottomright near ownhand, opponent opposite side. Preserve approved illustrated meldexamples and ownerred3 placement, reduce phoneverticalscroll. Current root startupfix must be preserved; all HF work remains private, no merge authorized yet.

FINAL ACTUAL BROWSER8839 PASS: combinedprivatefixture localAPI plus fixture-only reconnect-overlay hiding allowed actualMeld control. Three selectedblackthrees0points→Meld→own3-threemeld shown and1Kremaining; reloadpersisted. Ktap→Discard→Gamefinished/autonextisolatedpuzzle. Read-onlyfixtureGET statusfinished foot0, 4x7/5x7/3x3 melds, scores1317/10. The earlier apparentinertbutton was obscured by unrelatedfixture reconnectnotice; productionauth notchanged. Combinedprivate debug/fixtureCSS mustNEVERdeploy. Provisionalred>4/unopenedsetaside policy stillrequiresparentdecision beforepublishing rules.

