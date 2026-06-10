DROP TABLE IF EXISTS verification_tokens;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS sessions;

ALTER TABLE users
    DROP COLUMN IF EXISTS last_login_at,
    DROP COLUMN IF EXISTS email_verified,
    DROP COLUMN IF EXISTS avatar_url,
    DROP COLUMN IF EXISTS name;
