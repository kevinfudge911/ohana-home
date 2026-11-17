# Reviewed scoped chat release

The patch adds persistent sender-character bubbles with recipient-specific OK, private and group composition, and recipient-snapshot-protected history. Source contains public code and approved aggregate fingerprints only, not exported app source, family messages, private assets, account identifiers or credentials.

The exact existing DB binding is resolved privately from live Worker settings. Preview `check` performs schema PRAGMAs only. Both planned tables may be absent while baseline code is old; a partial or incompatible schema stops the release. Main `deploy` first validates code and settings, executes the exact hash-pinned additive SQL only when both tables are absent, then verifies exact schema types, columns, nullability, defaults, keys and nonpartial sender/client uniqueness before publishing code. No tables or rows are dropped, replaced or deleted.

An interrupted migration leaves the old Worker serving and retains any new tables. Inspect a partial result rather than deleting or silently repairing it. Source/settings are rechecked after migration. Missing D1 permissions stop the job; credentials are never broadened. An exact already-live release requires verified schema and performs no upload.

The output changes only main app and Worker plus five new chat modules, preserving139other modules, original types, bindings, static assets and runtime metadata. The descriptive workers/message annotation remains the only settings normalization. Publication is coordinated but not atomic compare-and-swap.

Once v2 messages exist, never roll back to a Worker without recipient-snapshot history filtering. Use a separately reviewed privacy-preserving fix-forward/rollback, retaining message and delivery state. Do not send production family test messages or alter games for verification.
