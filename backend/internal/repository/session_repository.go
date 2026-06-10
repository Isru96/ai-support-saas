package repository

import (
	"context"
	"time"

	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/models"
)

type SessionRepository struct {
	db *database.DB
}

func NewSessionRepository(db *database.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) Create(ctx context.Context, userID, refreshTokenHash string, expiresAt time.Time) (*models.Session, error) {
	var session models.Session
	err := r.db.Pool.QueryRow(ctx,
		`INSERT INTO sessions (user_id, refresh_token, expires_at)
		 VALUES ($1, $2, $3)
		 RETURNING id, user_id, refresh_token, expires_at, created_at`,
		userID, refreshTokenHash, expiresAt,
	).Scan(&session.ID, &session.UserID, &session.RefreshToken, &session.ExpiresAt, &session.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *SessionRepository) FindByRefreshTokenHash(ctx context.Context, refreshTokenHash string) (*models.Session, error) {
	var session models.Session
	err := r.db.Pool.QueryRow(ctx,
		`SELECT id, user_id, refresh_token, expires_at, created_at
		 FROM sessions WHERE refresh_token = $1`,
		refreshTokenHash,
	).Scan(&session.ID, &session.UserID, &session.RefreshToken, &session.ExpiresAt, &session.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *SessionRepository) DeleteByID(ctx context.Context, id string) error {
	_, err := r.db.Pool.Exec(ctx, `DELETE FROM sessions WHERE id = $1`, id)
	return err
}

func (r *SessionRepository) DeleteByRefreshTokenHash(ctx context.Context, refreshTokenHash string) error {
	_, err := r.db.Pool.Exec(ctx, `DELETE FROM sessions WHERE refresh_token = $1`, refreshTokenHash)
	return err
}

func (r *SessionRepository) DeleteAllForUser(ctx context.Context, userID string) error {
	_, err := r.db.Pool.Exec(ctx, `DELETE FROM sessions WHERE user_id = $1`, userID)
	return err
}
