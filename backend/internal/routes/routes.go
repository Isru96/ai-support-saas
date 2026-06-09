package routes

import (
	"ai-support-saas/backend/internal/handler"
	"ai-support-saas/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func Setup(router *gin.Engine, authHandler *handler.AuthHandler, jwtSecret string) {
	router.Use(middleware.CORS())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	auth := router.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.GET("/me", middleware.RequireAuth(jwtSecret), authHandler.Me)
	}
}