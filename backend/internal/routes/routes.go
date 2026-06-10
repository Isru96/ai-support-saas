package routes

import (
	"ai-support-saas/backend/internal/handler"
	"ai-support-saas/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func Setup(
	router *gin.Engine,
	authHandler *handler.AuthHandler,
	workspaceHandler *handler.WorkspaceHandler,
	jwtSecret string,
	corsOrigins []string,
) {
	router.Use(middleware.CORS(corsOrigins))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	auth := router.Group("/auth")
	{
		auth.POST("/check-email", authHandler.CheckEmail)
		auth.POST("/google", authHandler.GoogleAuth)
		auth.POST("/google/code", authHandler.GoogleAuthCode)
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/refresh", authHandler.Refresh)
		auth.POST("/logout", authHandler.Logout)
		auth.POST("/forgot-password", authHandler.ForgotPassword)
		auth.POST("/reset-password", authHandler.ResetPassword)
		auth.POST("/verify-email", authHandler.VerifyEmail)
		auth.GET("/me", middleware.RequireAuth(jwtSecret), authHandler.Me)
	}

	protected := router.Group("/")
	protected.Use(middleware.RequireAuth(jwtSecret))
	{
		workspaces := protected.Group("/workspaces")
		{
			workspaces.POST("", workspaceHandler.Create)
			workspaces.GET("", workspaceHandler.List)
			workspaces.GET("/:id", workspaceHandler.Get)
			workspaces.PATCH("/:id", workspaceHandler.Update)
		}
	}
}
