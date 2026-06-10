package repository

import (
	"context"
	"time"

	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/models"
)

type PasswordResetRepository struct {
	db *database.DB
}

func NewPasswordResetRepository(db *database.DB) *PasswordResetRepository {
	return &PasswordResetRepository{db: db}
}

func (r *PasswordResetRepository) Create(ctx context.Context, userID, token string, expiresAt time.Time) (*models.PasswordReset, error) {
	var reset models.PasswordReset
	err := r.db.Pool.QueryRow(ctx,
		`INSERT INTO password_resets (user_id, token, expires_at)
		 VALUES ($1, $2, $3)
		 RETURNING id, user_id, token, expires_at, used, created_at`,
		userID, token, expiresAt,
	).Scan(&reset.ID, &reset.UserID, &reset.Token, &reset.ExpiresAt, &reset.Used, &reset.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &reset, nil
}

func (r *PasswordResetRepository) FindValidByToken(ctx context.Context, token string) (*models.PasswordReset, error) {
	var reset models.PasswordReset
	err := r.db.Pool.QueryRow(ctx,
		`SELECT id, user_id, token, expires_at, used, created_at
		 FROM password_resets
		 WHERE token = $1 AND used = FALSE AND expires_at > CURRENT_TIMESTAMP`,
		token,
	).Scan(&reset.ID, &reset.UserID, &reset.Token, &reset.ExpiresAt, &reset.Used, &reset.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &reset, nil
}

func (r *PasswordResetRepository) MarkUsed(ctx context.Context, id string) error {
	_, err := r.db.Pool.Exec(ctx,
		`UPDATE password_resets SET used = TRUE WHERE id = $1`,
		id,
	)
	return err
}
