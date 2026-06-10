package main

import (
	"log"

	"ai-support-saas/backend/internal/config"
	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/email"
	"ai-support-saas/backend/internal/handler"
	"ai-support-saas/backend/internal/repository"
	"ai-support-saas/backend/internal/routes"
	"ai-support-saas/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db := database.Connect(cfg.DatabaseURL)
	defer db.Pool.Close()

	userRepo := repository.NewUserRepository(db)
	sessionRepo := repository.NewSessionRepository(db)
	passwordResetRepo := repository.NewPasswordResetRepository(db)
	verificationTokenRepo := repository.NewVerificationTokenRepository(db)

	mailer := email.NewSender(cfg.Email)
	if cfg.Email.Enabled() {
		log.Println("Email delivery enabled via SMTP")
	} else {
		log.Println("Email delivery disabled — emails will be logged to console")
	}

	authService := service.NewAuthService(
		userRepo,
		sessionRepo,
		passwordResetRepo,
		verificationTokenRepo,
		mailer,
		cfg.JWTSecret,
		cfg.GoogleClientID,
		cfg.GoogleClientSecret,
		cfg.AccessTokenTTL,
		cfg.RefreshTokenTTL,
	)
	authHandler := handler.NewAuthHandler(authService)

	workspaceRepo := repository.NewWorkspaceRepository(db)
	workspaceService := service.NewWorkspaceService(workspaceRepo)
	workspaceHandler := handler.NewWorkspaceHandler(workspaceService)

	router := gin.Default()
	routes.Setup(router, authHandler, workspaceHandler, cfg.JWTSecret, cfg.CorsOrigins)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
