CREATE TABLE rooms(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,owner_id INTEGER,invite_code TEXT UNIQUE,created_at INTEGER NOT NULL);
CREATE TABLE room_members(room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,PRIMARY KEY(room_id,member_id));
INSERT INTO rooms(id,name,created_at) VALUES(1,'Ohana Family',0);
INSERT INTO room_members(room_id,member_id) SELECT 1,id FROM members;
ALTER TABLE games ADD COLUMN room_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE messages ADD COLUMN room_id INTEGER NOT NULL DEFAULT 1;
CREATE INDEX games_room_updated ON games(room_id,updated_at);
CREATE INDEX messages_room_id ON messages(room_id,id);
CREATE INDEX memberships_member ON room_members(member_id,room_id);
