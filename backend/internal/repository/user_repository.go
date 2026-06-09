package repository

import (
	"context"

	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/models"
)

type UserRepository struct {
	db *database.DB
}

func NewUserRepository(db *database.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, email, passwordHash string) (*models.User, error) {
	var user models.User
	err := r.db.Pool.QueryRow(ctx,
		`INSERT INTO users (email, password_hash)
		 VALUES ($1, $2)
		 RETURNING id, email, created_at, updated_at`,
		email, passwordHash,
	).Scan(&user.ID, &user.Email, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User
	err := r.db.Pool.QueryRow(ctx,
		`SELECT id, email, created_at, updated_at
		 FROM users WHERE id = $1`,
		id,
	).Scan(&user.ID, &user.Email, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := r.db.Pool.QueryRow(ctx,
		`SELECT id, email, password_hash, created_at, updated_at
		 FROM users WHERE email = $1`,
		email,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}