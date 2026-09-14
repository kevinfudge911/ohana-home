CREATE TABLE IF NOT EXISTS game_invitations(game_id INTEGER NOT NULL,member_id INTEGER NOT NULL,sender_id INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at INTEGER NOT NULL,PRIMARY KEY(game_id,member_id));
CREATE INDEX IF NOT EXISTS game_invitation_inbox ON game_invitations(member_id,status);
