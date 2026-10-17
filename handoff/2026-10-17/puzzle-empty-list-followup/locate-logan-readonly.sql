-- Read-only D1 metadata lookup. Does not invoke PuzzleRoom or archive-capable APIs.
-- Do not infer room identity or restore/reset anything before examining these rows.
SELECT id, room_id, name, cols, rows, cols*rows AS pieces,
       status, created_by, created_at,
       CASE WHEN image LIKE 'data:%' THEN 'private family photo' ELSE 'named image' END AS image_kind
FROM puzzles
WHERE lower(name) LIKE '%logan%'
ORDER BY created_at DESC
LIMIT 30;

-- Execute separately only if the existing table is present; no CREATE TABLE fallback.
SELECT puzzle_id, room_id, name, pieces, finished_at
FROM ohana_journey_memories
WHERE lower(name) LIKE '%logan%'
ORDER BY finished_at DESC
LIMIT 30;

