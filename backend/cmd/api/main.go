package main

import (
	"log"

	"ai-support-saas/backend/internal/config"
	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/handler"
	"ai-support-saas/backend/internal/repository"
	"ai-support-saas/backend/internal/routes"
	"ai-support-saas/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load configuration from .env
	cfg := config.Load()

	// 2. Connect to the database
	db := database.Connect(cfg.DatabaseURL)
	defer db.Pool.Close()

	// 3. Wire the layers together (dependency injection)
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	// 4. Set up the router and register routes
	router := gin.Default()
	routes.Setup(router, authHandler, cfg.JWTSecret)

	// 5. Start the server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}