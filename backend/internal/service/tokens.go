package service

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func generateSecureToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

func (s *AuthService) createAccessToken(userID string) (string, int64, error) {
	expiresAt := time.Now().Add(s.accessTokenTTL)
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     expiresAt.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", 0, err
	}
	return signed, int64(s.accessTokenTTL.Seconds()), nil
}

func (s *AuthService) createSessionTokenPair(userID string) (*tokenPairInternal, error) {
	refreshToken, err := generateSecureToken()
	if err != nil {
		return nil, err
	}

	accessToken, expiresIn, err := s.createAccessToken(userID)
	if err != nil {
		return nil, err
	}

	return &tokenPairInternal{
		accessToken:  accessToken,
		refreshToken: refreshToken,
		refreshHash:  hashToken(refreshToken),
		expiresIn:    expiresIn,
	}, nil
}

type tokenPairInternal struct {
	accessToken  string
	refreshToken string
	refreshHash  string
	expiresIn    int64
}

func (p *tokenPairInternal) toResponse() map[string]interface{} {
	return map[string]interface{}{
		"access_token":  p.accessToken,
		"refresh_token": p.refreshToken,
		"expires_in":    p.expiresIn,
		"token":         p.accessToken,
	}
}

