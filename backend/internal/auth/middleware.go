package auth

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	header := c.GetHeader("Authorization")
	if header == "" || !strings.HasPrefix(header, "Bearer ") {
		c.JSON(401, gin.H{"error": "missing or invalid token"})
		c.Abort()
		return
	}

	tokenString := strings.TrimPrefix(header, "Bearer ")

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		c.JSON(401, gin.H{"error": "invalid token"})
		c.Abort()
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	c.Set("user_id", claims["user_id"])

	c.Next()
}