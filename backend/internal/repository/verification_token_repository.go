package repository

import (
	"context"
	"time"

	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/models"
)

type VerificationTokenRepository struct {
	db *database.DB
}

func NewVerificationTokenRepository(db *database.DB) *VerificationTokenRepository {
	return &VerificationTokenRepository{db: db}
}

func (r *VerificationTokenRepository) Create(ctx context.Context, userID, token string, expiresAt time.Time) (*models.VerificationToken, error) {
	var verification models.VerificationToken
	err := r.db.Pool.QueryRow(ctx,
		`INSERT INTO verification_tokens (user_id, token, expires_at)
		 VALUES ($1, $2, $3)
		 RETURNING id, user_id, token, expires_at, created_at`,
		userID, token, expiresAt,
	).Scan(&verification.ID, &verification.UserID, &verification.Token, &verification.ExpiresAt, &verification.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &verification, nil
}

func (r *VerificationTokenRepository) FindValidByToken(ctx context.Context, token string) (*models.VerificationToken, error) {
	var verification models.VerificationToken
	err := r.db.Pool.QueryRow(ctx,
		`SELECT id, user_id, token, expires_at, created_at
		 FROM verification_tokens
		 WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
		token,
	).Scan(&verification.ID, &verification.UserID, &verification.Token, &verification.ExpiresAt, &verification.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &verification, nil
}

func (r *VerificationTokenRepository) DeleteByID(ctx context.Context, id string) error {
	_, err := r.db.Pool.Exec(ctx, `DELETE FROM verification_tokens WHERE id = $1`, id)
	return err
}

func (r *VerificationTokenRepository) DeleteAllForUser(ctx context.Context, userID string) error {
	_, err := r.db.Pool.Exec(ctx, `DELETE FROM verification_tokens WHERE user_id = $1`, userID)
	return err
}
