ALTER TABLE members ADD COLUMN nickname TEXT;

CREATE TABLE IF NOT EXISTS member_tag_numbers (
  tag_number INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

INSERT INTO member_tag_numbers (member_id, created_at)
SELECT id, created_at
FROM members
WHERE id NOT IN (SELECT member_id FROM member_tag_numbers)
ORDER BY created_at, id;

UPDATE members
SET nickname = display_name
WHERE nickname IS NULL;
