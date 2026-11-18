-- One game alert per player per hour (applied to production D1 on Nov 18 2026).
CREATE TABLE IF NOT EXISTS play_alerts(member_id INTEGER NOT NULL, from_id INTEGER NOT NULL, last_at INTEGER NOT NULL, PRIMARY KEY(member_id, from_id));
