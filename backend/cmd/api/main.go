package main

import (
	"ai-support-saas/backend/internal/auth"
	"ai-support-saas/backend/internal/database"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	router.POST("/auth/register", auth.Register)
	router.POST("/auth/login", auth.Login)
	router.GET("/auth/me", auth.RequireAuth, auth.Me)

	router.Run(":8080")
}