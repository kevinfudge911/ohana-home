-- New namespace only. No changes, copies, or visibility expansion to legacy history.
CREATE TABLE IF NOT EXISTS chat_v2_messages (
 id TEXT PRIMARY KEY, scope TEXT NOT NULL, sender INTEGER NOT NULL,
 text TEXT NOT NULL, image TEXT, created_at INTEGER NOT NULL, client_id TEXT NOT NULL,
 mentions TEXT NOT NULL DEFAULT '[]', UNIQUE(sender,client_id)
);
CREATE TABLE IF NOT EXISTS chat_v2_deliveries (
 message_id TEXT NOT NULL REFERENCES chat_v2_messages(id),
 recipient INTEGER NOT NULL, acknowledged_at INTEGER,
 PRIMARY KEY(message_id,recipient)
);
CREATE INDEX IF NOT EXISTS chat_v2_pending ON chat_v2_deliveries(recipient,acknowledged_at,message_id);
