package repository

import (
	"context"

	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/models"
	"github.com/jackc/pgx/v5"
)

type UserRepository struct {
	db *database.DB
}

func NewUserRepository(db *database.DB) *UserRepository {
	return &UserRepository{db: db}
}

const userColumns = `id, name, email, password_hash, avatar_url, email_verified, last_login_at, created_at, updated_at`

func scanUser(row pgx.Row) (*models.User, error) {
	var user models.User
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.EmailVerified,
		&user.LastLoginAt,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Create(ctx context.Context, name, email, passwordHash string) (*models.User, error) {
	var nameArg interface{}
	if name != "" {
		nameArg = name
	}

	row := r.db.Pool.QueryRow(ctx,
		`INSERT INTO users (name, email, password_hash)
		 VALUES ($1, $2, $3)
		 RETURNING `+userColumns,
		nameArg, email, passwordHash,
	)
	return scanUser(row)
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	row := r.db.Pool.QueryRow(ctx,
		`SELECT `+userColumns+` FROM users WHERE id = $1`,
		id,
	)
	return scanUser(row)
}

func (r *UserRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := r.db.Pool.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`,
		email,
	).Scan(&exists)
	return exists, err
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	row := r.db.Pool.QueryRow(ctx,
		`SELECT `+userColumns+` FROM users WHERE email = $1`,
		email,
	)
	return scanUser(row)
}

func (r *UserRepository) FindByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	row := r.db.Pool.QueryRow(ctx,
		`SELECT `+userColumns+` FROM users WHERE google_id = $1`,
		googleID,
	)
	return scanUser(row)
}

func (r *UserRepository) CreateFromGoogle(
	ctx context.Context,
	name, email, googleID string,
	avatarURL *string,
) (*models.User, error) {
	var nameArg interface{}
	if name != "" {
		nameArg = name
	}

	row := r.db.Pool.QueryRow(ctx,
		`INSERT INTO users (name, email, google_id, avatar_url, email_verified)
		 VALUES ($1, $2, $3, $4, TRUE)
		 RETURNING `+userColumns,
		nameArg, email, googleID, avatarURL,
	)
	return scanUser(row)
}

func (r *UserRepository) LinkGoogleAccount(
	ctx context.Context,
	userID, googleID string,
	name string,
	avatarURL *string,
) (*models.User, error) {
	var nameArg interface{}
	if name != "" {
		nameArg = name
	}

	row := r.db.Pool.QueryRow(ctx,
		`UPDATE users
		 SET google_id = $1,
		     name = COALESCE($2, name),
		     avatar_url = COALESCE($3, avatar_url),
		     email_verified = TRUE,
		     updated_at = CURRENT_TIMESTAMP
		 WHERE id = $4
		 RETURNING `+userColumns,
		googleID, nameArg, avatarURL, userID,
	)
	return scanUser(row)
}

func (r *UserRepository) UpdatePassword(ctx context.Context, userID, passwordHash string) error {
	_, err := r.db.Pool.Exec(ctx,
		`UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
		passwordHash, userID,
	)
	return err
}

func (r *UserRepository) MarkEmailVerified(ctx context.Context, userID string) error {
	_, err := r.db.Pool.Exec(ctx,
		`UPDATE users SET email_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
		userID,
	)
	return err
}

func (r *UserRepository) UpdateLastLogin(ctx context.Context, userID string) error {
	_, err := r.db.Pool.Exec(ctx,
		`UPDATE users SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
		userID,
	)
	return err
}
