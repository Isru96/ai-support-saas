package service

import (
	"context"
	"errors"
	"time"

	"ai-support-saas/backend/internal/email"
	"ai-support-saas/backend/internal/models"
	"ai-support-saas/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials     = errors.New("invalid email or password")
	ErrInvalidRefreshToken    = errors.New("invalid or expired refresh token")
	ErrInvalidResetToken      = errors.New("invalid or expired reset token")
	ErrInvalidVerificationToken = errors.New("invalid or expired verification token")
	ErrGoogleAuthNotConfigured  = errors.New("google sign-in is not configured")
	ErrInvalidGoogleToken       = errors.New("invalid google token")
)

const (
	resetTokenTTL        = 1 * time.Hour
	verificationTokenTTL = 24 * time.Hour
)

type AuthService struct {
	userRepo              *repository.UserRepository
	sessionRepo           *repository.SessionRepository
	passwordResetRepo     *repository.PasswordResetRepository
	verificationTokenRepo *repository.VerificationTokenRepository
	mailer                *email.Sender
	jwtSecret             string
	googleClientID        string
	googleClientSecret    string
	accessTokenTTL        time.Duration
	refreshTokenTTL       time.Duration
}

func NewAuthService(
	userRepo *repository.UserRepository,
	sessionRepo *repository.SessionRepository,
	passwordResetRepo *repository.PasswordResetRepository,
	verificationTokenRepo *repository.VerificationTokenRepository,
	mailer *email.Sender,
	jwtSecret string,
	googleClientID string,
	googleClientSecret string,
	accessTokenTTL time.Duration,
	refreshTokenTTL time.Duration,
) *AuthService {
	return &AuthService{
		userRepo:              userRepo,
		sessionRepo:           sessionRepo,
		passwordResetRepo:     passwordResetRepo,
		verificationTokenRepo: verificationTokenRepo,
		mailer:                mailer,
		jwtSecret:             jwtSecret,
		googleClientID:        googleClientID,
		googleClientSecret:    googleClientSecret,
		accessTokenTTL:        accessTokenTTL,
		refreshTokenTTL:       refreshTokenTTL,
	}
}

func (s *AuthService) Register(ctx context.Context, input models.RegisterInput) (*models.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.Create(ctx, input.Name, input.Email, string(hash))
	if err != nil {
		return nil, err
	}

	if err := s.issueVerificationToken(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(ctx context.Context, input models.LoginInput) (map[string]interface{}, error) {
	user, err := s.userRepo.FindByEmail(ctx, input.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if user.PasswordHash == nil {
		return nil, ErrInvalidCredentials
	}

	if bcrypt.CompareHashAndPassword([]byte(*user.PasswordHash), []byte(input.Password)) != nil {
		return nil, ErrInvalidCredentials
	}

	if err := s.userRepo.UpdateLastLogin(ctx, user.ID); err != nil {
		return nil, err
	}

	pair, err := s.persistSession(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	return pair.toResponse(), nil
}

func (s *AuthService) Refresh(ctx context.Context, refreshToken string) (map[string]interface{}, error) {
	session, err := s.sessionRepo.FindByRefreshTokenHash(ctx, hashToken(refreshToken))
	if err != nil {
		return nil, ErrInvalidRefreshToken
	}

	if time.Now().After(session.ExpiresAt) {
		_ = s.sessionRepo.DeleteByID(ctx, session.ID)
		return nil, ErrInvalidRefreshToken
	}

	if err := s.sessionRepo.DeleteByID(ctx, session.ID); err != nil {
		return nil, err
	}

	pair, err := s.persistSession(ctx, session.UserID)
	if err != nil {
		return nil, err
	}

	return pair.toResponse(), nil
}

func (s *AuthService) Logout(ctx context.Context, refreshToken string) error {
	return s.sessionRepo.DeleteByRefreshTokenHash(ctx, hashToken(refreshToken))
}

func (s *AuthService) ForgotPassword(ctx context.Context, email string) error {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil
	}

	token, err := generateSecureToken()
	if err != nil {
		return err
	}

	_, err = s.passwordResetRepo.Create(ctx, user.ID, token, time.Now().Add(resetTokenTTL))
	if err != nil {
		return err
	}

	return s.mailer.SendPasswordReset(user.Email, token)
}

func (s *AuthService) ResetPassword(ctx context.Context, token, password string) error {
	reset, err := s.passwordResetRepo.FindValidByToken(ctx, token)
	if err != nil {
		return ErrInvalidResetToken
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if err := s.userRepo.UpdatePassword(ctx, reset.UserID, string(hash)); err != nil {
		return err
	}

	if err := s.passwordResetRepo.MarkUsed(ctx, reset.ID); err != nil {
		return err
	}

	return s.sessionRepo.DeleteAllForUser(ctx, reset.UserID)
}

func (s *AuthService) VerifyEmail(ctx context.Context, token string) error {
	verification, err := s.verificationTokenRepo.FindValidByToken(ctx, token)
	if err != nil {
		return ErrInvalidVerificationToken
	}

	if err := s.userRepo.MarkEmailVerified(ctx, verification.UserID); err != nil {
		return err
	}

	return s.verificationTokenRepo.DeleteByID(ctx, verification.ID)
}

func (s *AuthService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	return s.userRepo.FindByID(ctx, id)
}

func (s *AuthService) EmailExists(ctx context.Context, email string) (bool, error) {
	return s.userRepo.ExistsByEmail(ctx, email)
}

func (s *AuthService) persistSession(ctx context.Context, userID string) (*tokenPairInternal, error) {
	pair, err := s.createSessionTokenPair(userID)
	if err != nil {
		return nil, err
	}

	_, err = s.sessionRepo.Create(ctx, userID, pair.refreshHash, time.Now().Add(s.refreshTokenTTL))
	if err != nil {
		return nil, err
	}

	return pair, nil
}

func (s *AuthService) issueVerificationToken(ctx context.Context, user *models.User) error {
	token, err := generateSecureToken()
	if err != nil {
		return err
	}

	_ = s.verificationTokenRepo.DeleteAllForUser(ctx, user.ID)

	_, err = s.verificationTokenRepo.Create(ctx, user.ID, token, time.Now().Add(verificationTokenTTL))
	if err != nil {
		return err
	}

	return s.mailer.SendEmailVerification(user.Email, token)
}
