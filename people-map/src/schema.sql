CREATE TABLE IF NOT EXISTS people (
  key TEXT PRIMARY KEY, name TEXT NOT NULL, ohana_member_id INTEGER, limo_driver_id TEXT, jj_member TEXT,
  life360_name TEXT, google_name TEXT, rule TEXT, sort INTEGER DEFAULT 50, hidden INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS feed_positions (
  source TEXT NOT NULL, who TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL, acc REAL,
  place TEXT, since TEXT, at TEXT NOT NULL, PRIMARY KEY (source, who));
CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, kind TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL,
  radius_m REAL DEFAULT 200, source TEXT DEFAULT 'manual', ext_id TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
INSERT OR IGNORE INTO people (key,name,ohana_member_id,limo_driver_id,jj_member,life360_name,google_name,rule,sort) VALUES
 ('kevin','Kevin',5,'c3a62988-2873-49fe-814b-f89f4ee03e6d','Kevin','Kevin','Kevin',NULL,1),
 ('mike','Mike',10,'59fcffb4-3af8-438e-9d96-0547a1b47b87','Mike','Mike','Mike',NULL,2),
 ('ethan','Ethan',NULL,'841e3702-f906-4e8b-b0cb-8b0f0ea28238',NULL,'Ethan','Ethan','firefighter',3),
 ('chris','Chris',36,'a7039531-9ce4-4001-8d6a-d325ff556e11',NULL,'Chris','Chris',NULL,4),
 ('suzanne','Suzanne',6,NULL,NULL,'Suzanne','Suzanne',NULL,5),
 ('logan','Logan',7,NULL,NULL,'Logan','Logan',NULL,6),
 ('mom','Mom',9,NULL,NULL,'Barbara','Barbara',NULL,7),
 ('amber','Amber',13,NULL,NULL,'Amber','Amber',NULL,8),
 ('jeremy','Jeremy',10045,NULL,NULL,'Jeremy','Jeremy',NULL,9),
 ('jennifer','Jennifer',10046,NULL,NULL,'Jennifer','Jennifer',NULL,10);
;
CREATE TABLE IF NOT EXISTS family_share (member_id INTEGER PRIMARY KEY, sharing INTEGER NOT NULL DEFAULT 0, lat REAL, lng REAL, acc REAL, at TEXT, changed TEXT);

CREATE TABLE IF NOT EXISTS art (name TEXT NOT NULL, part INTEGER NOT NULL, type TEXT, data BLOB, at TEXT, PRIMARY KEY(name, part));
CREATE TABLE IF NOT EXISTS member_life360 (member_id INTEGER PRIMARY KEY, key TEXT NOT NULL, status TEXT, at TEXT);
CREATE TABLE IF NOT EXISTS member_feed (owner_id INTEGER NOT NULL, source TEXT NOT NULL, who TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL, acc REAL, place TEXT, since TEXT, at TEXT NOT NULL, PRIMARY KEY(owner_id, source, who));
