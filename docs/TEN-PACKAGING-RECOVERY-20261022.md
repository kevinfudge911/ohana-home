# TEN packaging recovery

The reviewed TEN/Home-order tree was committed to main as `7416644167cd2462f814018ea69744f202bdf0a5`. Cloudflare build `3e8e47d3-dc6f-4428-88b4-94579c715098` passed its dry-run build, then rejected deployment with10027: uncompressed Worker size exceeded63.9MiB. The preceding puzzle deployment stayed live.

This correction packages the exact approved main HTML as gzip. The existing nodejs_compat Worker decodes it synchronously once at module initialization; all response handlers continue using the same APP_HTML string. The raw HTML stays in Git for editing and review. The Text module rule explicitly lists the other existing HTML modules and disables default Text-rule fallthrough, so the raw source is not uploaded as a redundant second module. All other rules, bindings, routes, compatibility flags and storage remain unchanged. Future HTML modules must be included in this list when added.

Raw HTML6634764bytes becomes3272363bytes of lossless gzip, saving3362401module bytes. Decompressed output has the exact reviewed SHA256 `4c109000699e2eb329fa25d666685d6e105b60c6a0f16b8930265d381d7f70d9`; all JavaScript, TEN art, card faces and Home order are byte-identical. Worker changes are limited to the import and decoding statement. No engine, auth, data or gameplay changes are included.

Dry run: total upload62456.26KiB (about60.99MiB), below63.9MiB with roughly2.9MiB headroom. All482 statically required modules exist; the emitted package is checked byte for byte against its sources, with the raw main HTML absent and gzip present. Local workerd startup passed. GET /, /index.html and fictional invitation/room paths returned the exact6634764 approved HTML bytes. The extracted wood image remained available and unauthenticated /api/sync returned401. Tests used local isolated storage and made no production or family writes.

Run `node tests/ten-lossless-packaging.cjs` with Git available in PATH or OHANA_TEST_GIT. Set OHANA_PACKAGE_OUTDIR to a completed dry-run output directory to validate every emitted module. The prior TEN UI, engine, navigation and responsive review remains applicable because its HTML is unchanged.
