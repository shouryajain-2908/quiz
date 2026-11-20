/*
# Create quiz_scores table (single-tenant, no auth)

1. New Tables
- `quiz_scores`
  - `id` (uuid, primary key, auto-generated)
  - `player_name` (text, not null) — name the player entered on the start screen
  - `score` (integer, not null) — number of correct answers
  - `total_questions` (integer, not null) — total questions in the quiz
  - `category` (text, not null) — quiz category the score belongs to
  - `time_seconds` (integer, not null) — total time taken, in seconds
  - `created_at` (timestamp, defaults to now)
2. Security
- Enable RLS on `quiz_scores`.
- Grant SELECT + INSERT to `anon` + `authenticated` (no sign-in in this app; anyone can view the leaderboard and submit their own score).
- Policies: public read of all scores (leaderboard), public insert of own score. No update/delete needed.
3. Notes
- This is a single-tenant, no-auth app. `USING (true)` / `WITH CHECK (true)` is intentional and safe because the data is a shared public leaderboard.
*/

CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  category text NOT NULL,
  time_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON quiz_scores TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_quiz_scores" ON quiz_scores;
CREATE POLICY "public_read_quiz_scores" ON quiz_scores
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_quiz_scores" ON quiz_scores;
CREATE POLICY "public_insert_quiz_scores" ON quiz_scores
  FOR INSERT TO anon, authenticated WITH CHECK (true);