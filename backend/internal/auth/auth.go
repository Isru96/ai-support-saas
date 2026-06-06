package auth

import (
	"context"
	"time"

	"ai-support-saas/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not hash password"})
		return
	}

	_, err = database.DB.Exec(context.Background(),
		"INSERT INTO users (email, password_hash) VALUES ($1, $2)",
		input.Email, string(hash))
	if err != nil {
		c.JSON(500, gin.H{"error": "could not create user"})
		return
	}

	c.JSON(201, gin.H{"message": "user created"})
}

var jwtSecret = []byte("my-secret-key-change-later")

func Login(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	var userID string
	var storedHash string
	err := database.DB.QueryRow(context.Background(),
		"SELECT id, password_hash FROM users WHERE email = $1",
		input.Email).Scan(&userID, &storedHash)
	if err != nil {
		c.JSON(401, gin.H{"error": "invalid email or password"})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(input.Password)) != nil {
		c.JSON(401, gin.H{"error": "invalid email or password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	signed, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not create token"})
		return
	}

	c.JSON(200, gin.H{"token": signed})
}

func Me(c *gin.Context) {
	userID, _ := c.Get("user_id")
	c.JSON(200, gin.H{"user_id": userID})
}