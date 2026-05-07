CREATE TRIGGER IF NOT EXISTS member_identities_insert
BEFORE INSERT ON member_identities
WHEN NEW.provider IS NULL
  OR NEW.provider NOT IN ('firebase')
  OR NEW.subject IS NULL
  OR length(NEW.subject) < 1
  OR length(NEW.subject) > 128
  OR NEW.email_verified NOT IN (0, 1)
BEGIN
  SELECT RAISE(ABORT, 'invalid member identity');
END;

CREATE TRIGGER IF NOT EXISTS member_identities_update
BEFORE UPDATE ON member_identities
WHEN NEW.provider IS NULL
  OR NEW.provider NOT IN ('firebase')
  OR NEW.subject IS NULL
  OR length(NEW.subject) < 1
  OR length(NEW.subject) > 128
  OR NEW.email_verified NOT IN (0, 1)
BEGIN
  SELECT RAISE(ABORT, 'invalid member identity');
END;
