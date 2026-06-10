package handler

import (
	"errors"
	"net/http"

	"ai-support-saas/backend/internal/models"
	"ai-support-saas/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Register(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "could not create user (email may already exist)"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user":    user,
		"message": "Account created. Check your email to verify your address.",
	})
}

func (h *AuthHandler) CheckEmail(c *gin.Context) {
	var input models.CheckEmailInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exists, err := h.authService.EmailExists(c.Request.Context(), input.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not check email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": exists})
}

func (h *AuthHandler) GoogleAuth(c *gin.Context) {
	var input models.GoogleAuthInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := h.authService.GoogleAuth(c.Request.Context(), input.Credential)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrGoogleAuthNotConfigured):
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "google sign-in is not configured"})
		case errors.Is(err, service.ErrInvalidGoogleToken):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid google sign-in"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not sign in with google"})
		}
		return
	}

	c.JSON(http.StatusOK, tokens)
}

func (h *AuthHandler) GoogleAuthCode(c *gin.Context) {
	var input models.GoogleCodeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := h.authService.GoogleAuthWithCode(c.Request.Context(), input.Code, input.RedirectURI)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrGoogleAuthNotConfigured):
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "google sign-in is not configured"})
		case errors.Is(err, service.ErrInvalidGoogleToken):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid google sign-in"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not sign in with google"})
		}
		return
	}

	c.JSON(http.StatusOK, tokens)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := h.authService.Login(c.Request.Context(), input)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not sign in"})
		return
	}

	c.JSON(http.StatusOK, tokens)
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var input models.RefreshInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := h.authService.Refresh(c.Request.Context(), input.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired refresh token"})
		return
	}

	c.JSON(http.StatusOK, tokens)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	var input models.LogoutInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.authService.Logout(c.Request.Context(), input.RefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not sign out"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "signed out"})
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var input models.ForgotPasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.authService.ForgotPassword(c.Request.Context(), input.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not process request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "If an account exists for that email, a reset link has been sent.",
	})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var input models.ResetPasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.authService.ResetPassword(c.Request.Context(), input.Token, input.Password); err != nil {
		if errors.Is(err, service.ErrInvalidResetToken) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid or expired reset token"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not reset password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "password updated successfully"})
}

func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var input models.VerifyEmailInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.authService.VerifyEmail(c.Request.Context(), input.Token); err != nil {
		if errors.Is(err, service.ErrInvalidVerificationToken) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid or expired verification token"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not verify email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "email verified successfully"})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID, _ := c.Get("user_id")

	user, err := h.authService.GetUserByID(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}
