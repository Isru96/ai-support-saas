package main

import (
	"log"

	"ai-support-saas/backend/internal/config"
	"ai-support-saas/backend/internal/email"
)

func main() {
	cfg := config.Load()

	if !cfg.Email.Enabled() {
		log.Fatal("SMTP not configured in .env")
	}

	sender := email.NewSender(cfg.Email)
	log.Printf("Sending test email via %s:%s as %s", cfg.Email.Host, cfg.Email.Port, cfg.Email.Username)

	if err := sender.SendPasswordReset(cfg.Email.Username, "test-token-123"); err != nil {
		log.Fatal("send failed:", err)
	}

	log.Println("Test email sent successfully")
}
