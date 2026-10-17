# Printed Bible page verification

Canary a3a66a4c01d97ffae0e025d06810daf540cd3ca5 deployed successfully. It changed the renderer only with ?ohana-bible-preview=1; normal output was byte-identical to the old renderer.

Actual responsive Chrome visual checks passed at 390x844, 768x1024 and 844x390. Both leaves show two printed columns; all eleven existing NKJV selections occur once. DOM Range ink rectangles for paragraph text, book headings, superscripts and selection labels remained inside their leaf bounds at each size. Original Bible/table artwork is preserved. Phone print is miniature scene detail; tapping opens the unchanged accessible reader with all eleven verses at 18px. Reader Back closed correctly.

Evidence: canary-phone-390x844.png, canary-tablet-768x1024.png, canary-landscape-844x390.png. Landscape was scrolled to the book before the final screenshot. One initial screenshot capture was scaled incorrectly; a fresh tab restored correct capture. No CSS/app change was used to work around that capture issue.

Promotion commit 1edbce3f60f8b97d41ceb488c2a5820fa78b841d, app blob b6554e2bdb08ac0e80c3f4868226100f24a61bcd, 6293012 bytes. Cloudflare deployment succeeded; ordinary public Home loaded and showed the new columns without a query flag. The normal reading view still opens all eleven verses.

Scope tests: exact inverse, unchanged eleven-verse array, unflagged output equality, all 28 inline scripts parse. Worker, game engines, native-dialog Back module, music catalog and Nashville Roadhouse photo unchanged. Physical iPhone/Safari and Android remain unverified. This is a selection of verses from different books, not a fabricated continuous Bible passage.

