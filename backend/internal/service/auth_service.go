package service

import (
	"context"
	"errors"
	"time"

	"ai-support-saas/backend/internal/models"
	"ai-support-saas/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid email or password")

type AuthService struct {
	userRepo  *repository.UserRepository
	jwtSecret string
}

func NewAuthService(userRepo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{userRepo: userRepo, jwtSecret: jwtSecret}
}

func (s *AuthService) Register(ctx context.Context, input models.RegisterInput) (*models.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return s.userRepo.Create(ctx, input.Email, string(hash))
}

func (s *AuthService) Login(ctx context.Context, input models.LoginInput) (string, error) {
	user, err := s.userRepo.FindByEmail(ctx, input.Email)
	if err != nil {
		return "", ErrInvalidCredentials
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)) != nil {
		return "", ErrInvalidCredentials
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	return s.userRepo.FindByID(ctx, id)
}