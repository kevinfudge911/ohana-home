-- Keep score-review acknowledgments independent of mutable game state.
CREATE TABLE IF NOT EXISTS score_reviews (
  game_id INTEGER PRIMARY KEY,
  payload TEXT NOT NULL
);
