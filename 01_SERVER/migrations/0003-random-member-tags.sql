CREATE TABLE member_tag_numbers_new (
  member_id TEXT PRIMARY KEY,
  tag_number INTEGER NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

INSERT INTO member_tag_numbers_new (member_id, tag_number, created_at)
SELECT
  member_id,
  CASE
    WHEN tag_number BETWEEN 10000000 AND 99999999 THEN tag_number
    ELSE 10000000 + (abs(random()) % 90000000)
  END,
  created_at
FROM member_tag_numbers;

DROP TABLE member_tag_numbers;
ALTER TABLE member_tag_numbers_new RENAME TO member_tag_numbers;
