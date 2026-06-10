package email

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
	"strings"
)

type Config struct {
	Host        string
	Port        string
	Username    string
	Password    string
	FromAddress string
	FromName    string
	Encryption  string
	FrontendURL string
}

func (c Config) Enabled() bool {
	return c.Host != "" && c.Username != "" && c.Password != ""
}

func (c Config) From() string {
	if c.FromName != "" && c.FromAddress != "" {
		return fmt.Sprintf("%s <%s>", c.FromName, c.FromAddress)
	}
	if c.FromAddress != "" {
		return c.FromAddress
	}
	return c.Username
}

type Sender struct {
	cfg Config
}

func NewSender(cfg Config) *Sender {
	return &Sender{cfg: cfg}
}

func (s *Sender) SendPasswordReset(to, token string) error {
	link := fmt.Sprintf("%s/reset-password?token=%s", strings.TrimRight(s.cfg.FrontendURL, "/"), token)
	subject := "Reset your AI Support password"
	body := fmt.Sprintf(`Hello,

We received a request to reset your password.

Click the link below to choose a new password:
%s

This link expires in 1 hour.

If you did not request this, you can ignore this email.

— AI Support`, link)

	return s.send(to, subject, body)
}

func (s *Sender) SendEmailVerification(to, token string) error {
	link := fmt.Sprintf("%s/verify-email?token=%s", strings.TrimRight(s.cfg.FrontendURL, "/"), token)
	subject := "Verify your AI Support email"
	body := fmt.Sprintf(`Hello,

Thanks for signing up for AI Support.

Click the link below to verify your email address:
%s

This link expires in 24 hours.

— AI Support`, link)

	return s.send(to, subject, body)
}

func (s *Sender) send(to, subject, body string) error {
	if !s.cfg.Enabled() {
		log.Printf("[email-stub] to=%s subject=%q\n%s\n", to, subject, body)
		return nil
	}

	log.Printf("[email] sending to=%s subject=%q via %s:%s", to, subject, s.cfg.Host, s.cfg.Port)

	from := s.cfg.FromAddress
	if from == "" {
		from = s.cfg.Username
	}

	message := buildMessage(s.cfg.From(), to, subject, body)
	addr := fmt.Sprintf("%s:%s", s.cfg.Host, s.cfg.Port)
	auth := smtp.PlainAuth("", s.cfg.Username, s.cfg.Password, s.cfg.Host)

	var err error
	if strings.EqualFold(s.cfg.Encryption, "ssl") {
		err = sendWithSSL(addr, s.cfg.Host, auth, from, []string{to}, []byte(message))
	} else {
		err = sendWithTLS(addr, s.cfg.Host, auth, from, []string{to}, []byte(message))
	}
	if err != nil {
		log.Printf("[email] send failed to=%s: %v", to, err)
		return err
	}

	log.Printf("[email] sent successfully to=%s", to)
	return nil
}

func buildMessage(from, to, subject, body string) string {
	return fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s",
		from, to, subject, body,
	)
}

func sendWithTLS(addr, host string, auth smtp.Auth, from string, to []string, msg []byte) error {
	client, err := smtp.Dial(addr)
	if err != nil {
		return err
	}
	defer client.Close()

	if err := client.StartTLS(&tls.Config{ServerName: host}); err != nil {
		return err
	}
	if err := client.Auth(auth); err != nil {
		return err
	}
	if err := client.Mail(from); err != nil {
		return err
	}
	for _, recipient := range to {
		if err := client.Rcpt(recipient); err != nil {
			return err
		}
	}

	writer, err := client.Data()
	if err != nil {
		return err
	}
	if _, err := writer.Write(msg); err != nil {
		return err
	}
	if err := writer.Close(); err != nil {
		return err
	}

	return client.Quit()
}

func sendWithSSL(addr, host string, auth smtp.Auth, from string, to []string, msg []byte) error {
	tlsConfig := &tls.Config{ServerName: host}
	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		return err
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return err
	}
	defer client.Close()

	if err := client.Auth(auth); err != nil {
		return err
	}
	if err := client.Mail(from); err != nil {
		return err
	}
	for _, recipient := range to {
		if err := client.Rcpt(recipient); err != nil {
			return err
		}
	}

	writer, err := client.Data()
	if err != nil {
		return err
	}
	if _, err := writer.Write(msg); err != nil {
		return err
	}
	if err := writer.Close(); err != nil {
		return err
	}

	return client.Quit()
}
