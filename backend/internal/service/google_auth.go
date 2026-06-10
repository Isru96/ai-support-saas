package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"ai-support-saas/backend/internal/models"
	"github.com/jackc/pgx/v5"
	"google.golang.org/api/idtoken"
)

type googleTokenResponse struct {
	IDToken string `json:"id_token"`
	Error   string `json:"error"`
}

func (s *AuthService) GoogleAuth(ctx context.Context, credential string) (map[string]interface{}, error) {
	if s.googleClientID == "" {
		return nil, ErrGoogleAuthNotConfigured
	}

	payload, err := idtoken.Validate(ctx, credential, s.googleClientID)
	if err != nil {
		return nil, ErrInvalidGoogleToken
	}

	return s.loginWithGooglePayload(ctx, payload)
}

func (s *AuthService) GoogleAuthWithCode(ctx context.Context, code, redirectURI string) (map[string]interface{}, error) {
	if s.googleClientID == "" || s.googleClientSecret == "" {
		return nil, ErrGoogleAuthNotConfigured
	}

	idToken, err := s.exchangeGoogleAuthCode(ctx, code, redirectURI)
	if err != nil {
		return nil, err
	}

	payload, err := idtoken.Validate(ctx, idToken, s.googleClientID)
	if err != nil {
		return nil, ErrInvalidGoogleToken
	}

	return s.loginWithGooglePayload(ctx, payload)
}

func (s *AuthService) exchangeGoogleAuthCode(ctx context.Context, code, redirectURI string) (string, error) {
	form := url.Values{}
	form.Set("code", code)
	form.Set("client_id", s.googleClientID)
	form.Set("client_secret", s.googleClientSecret)
	form.Set("redirect_uri", redirectURI)
	form.Set("grant_type", "authorization_code")

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		"https://oauth2.googleapis.com/token",
		strings.NewReader(form.Encode()),
	)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var tokenResp googleTokenResponse
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return "", err
	}

	if tokenResp.Error != "" {
		return "", fmt.Errorf("%w: %s", ErrInvalidGoogleToken, tokenResp.Error)
	}
	if tokenResp.IDToken == "" {
		return "", ErrInvalidGoogleToken
	}

	return tokenResp.IDToken, nil
}

func (s *AuthService) loginWithGooglePayload(ctx context.Context, payload *idtoken.Payload) (map[string]interface{}, error) {
	email, _ := payload.Claims["email"].(string)
	if email == "" {
		return nil, ErrInvalidGoogleToken
	}

	name, _ := payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)

	var avatarURL *string
	if picture != "" {
		avatarURL = &picture
	}

	user, err := s.findOrCreateGoogleUser(ctx, payload.Subject, name, email, avatarURL)
	if err != nil {
		return nil, err
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

func (s *AuthService) findOrCreateGoogleUser(
	ctx context.Context,
	googleID, name, email string,
	avatarURL *string,
) (*models.User, error) {
	user, err := s.userRepo.FindByGoogleID(ctx, googleID)
	if err == nil {
		return user, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	existing, err := s.userRepo.FindByEmail(ctx, email)
	if err == nil {
		return s.userRepo.LinkGoogleAccount(ctx, existing.ID, googleID, name, avatarURL)
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	return s.userRepo.CreateFromGoogle(ctx, name, email, googleID, avatarURL)
}
