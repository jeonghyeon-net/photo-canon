UPDATE members
SET nickname = lower(replace(replace(trim(COALESCE(nickname, display_name, 'user')), ' ', '.'), '-', '.'));

UPDATE members
SET nickname = 'user'
WHERE nickname IS NULL
  OR length(nickname) < 1
  OR length(nickname) > 30
  OR nickname LIKE '.%'
  OR nickname LIKE '%.'
  OR nickname LIKE '%..%'
  OR nickname GLOB '*[^a-z0-9._]*';
