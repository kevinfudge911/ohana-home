-- Idempotency receipts for explicit individual/group invitation sends.
-- No existing games, invitations, membership or permissions are changed.
CREATE TABLE IF NOT EXISTS invitation_batches (
  sender_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  request_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  codes TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (sender_id, room_id, request_id)
);
