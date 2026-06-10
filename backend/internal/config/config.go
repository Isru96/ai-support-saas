package config

import (
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"ai-support-saas/backend/internal/email"
	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL     string
	JWTSecret       string
	Port            string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
	GoogleClientID     string
	GoogleClientSecret string
	CorsOrigins        []string
	Email           email.Config
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ai_support?sslmode=disable"),
		JWTSecret:       getEnv("JWT_SECRET", "dev-secret-change-me"),
		Port:            getEnv("PORT", "8080"),
		AccessTokenTTL:  getDurationEnv("ACCESS_TOKEN_TTL_MINUTES", 15) * time.Minute,
		RefreshTokenTTL: getDurationEnv("REFRESH_TOKEN_TTL_DAYS", 7) * 24 * time.Hour,
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		CorsOrigins: parseCorsOrigins(
			getEnv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://192.168.1.8:3000"),
		),
		Email: email.Config{
			Host:        getEnv("MAIL_HOST", ""),
			Port:        getEnv("MAIL_PORT", "587"),
			Username:    getEnv("MAIL_USERNAME", ""),
			Password:    getEnv("MAIL_PASSWORD", ""),
			FromAddress: getEnv("MAIL_FROM_ADDRESS", ""),
			FromName:    getEnv("MAIL_FROM_NAME", "AI Support"),
			Encryption:  getEnv("MAIL_ENCRYPTION", "tls"),
			FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
		},
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func parseCorsOrigins(value string) []string {
	parts := strings.Split(value, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		if origin := strings.TrimSpace(part); origin != "" {
			origins = append(origins, origin)
		}
	}
	return origins
}

func getDurationEnv(key string, fallback int64) time.Duration {
	if value := os.Getenv(key); value != "" {
		parsed, err := strconv.ParseInt(value, 10, 64)
		if err == nil {
			return time.Duration(parsed)
		}
	}
	return time.Duration(fallback)
}
