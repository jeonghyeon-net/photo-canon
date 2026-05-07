CREATE TRIGGER IF NOT EXISTS members_nickname_insert
BEFORE INSERT ON members
WHEN NEW.nickname IS NULL
  OR length(NEW.nickname) < 1
  OR length(NEW.nickname) > 30
  OR NEW.nickname LIKE '.%'
  OR NEW.nickname LIKE '%.'
  OR NEW.nickname LIKE '%..%'
  OR NEW.nickname GLOB '*[^a-z0-9._]*'
BEGIN
  SELECT RAISE(ABORT, 'invalid member nickname');
END;

CREATE TRIGGER IF NOT EXISTS members_nickname_update
BEFORE UPDATE OF nickname ON members
WHEN NEW.nickname IS NULL
  OR length(NEW.nickname) < 1
  OR length(NEW.nickname) > 30
  OR NEW.nickname LIKE '.%'
  OR NEW.nickname LIKE '%.'
  OR NEW.nickname LIKE '%..%'
  OR NEW.nickname GLOB '*[^a-z0-9._]*'
BEGIN
  SELECT RAISE(ABORT, 'invalid member nickname');
END;

CREATE TRIGGER IF NOT EXISTS member_tags_insert
BEFORE INSERT ON member_tag_numbers
WHEN NEW.tag_number < 10000000 OR NEW.tag_number > 99999999
BEGIN
  SELECT RAISE(ABORT, 'invalid member tag number');
END;

CREATE TRIGGER IF NOT EXISTS member_tags_update
BEFORE UPDATE OF tag_number ON member_tag_numbers
WHEN NEW.tag_number < 10000000 OR NEW.tag_number > 99999999
BEGIN
  SELECT RAISE(ABORT, 'invalid member tag number');
END;

CREATE TRIGGER IF NOT EXISTS members_role_insert
BEFORE INSERT ON members
WHEN NEW.role NOT IN ('USER', 'ADMIN')
BEGIN
  SELECT RAISE(ABORT, 'invalid member role');
END;

CREATE TRIGGER IF NOT EXISTS members_role_update
BEFORE UPDATE OF role ON members
WHEN NEW.role NOT IN ('USER', 'ADMIN')
BEGIN
  SELECT RAISE(ABORT, 'invalid member role');
END;

CREATE TRIGGER IF NOT EXISTS members_status_insert
BEFORE INSERT ON members
WHEN NEW.status NOT IN ('ACTIVE', 'SUSPENDED', 'DELETED')
BEGIN
  SELECT RAISE(ABORT, 'invalid member status');
END;

CREATE TRIGGER IF NOT EXISTS members_status_update
BEFORE UPDATE OF status ON members
WHEN NEW.status NOT IN ('ACTIVE', 'SUSPENDED', 'DELETED')
BEGIN
  SELECT RAISE(ABORT, 'invalid member status');
END;
