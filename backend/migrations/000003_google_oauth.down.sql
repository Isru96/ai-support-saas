DROP INDEX IF EXISTS idx_users_google_id;

ALTER TABLE users
    DROP COLUMN IF EXISTS google_id;

-- Note: rows with NULL password_hash should be removed before re-adding NOT NULL in production.
