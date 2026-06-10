package models

import "time"

const (
	RoleOwner  = "owner"
	RoleAdmin  = "admin"
	RoleMember = "member"
)

type Workspace struct {
	ID        string    `json:"id"`
	OwnerID   string    `json:"owner_id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	LogoURL   *string   `json:"logo_url,omitempty"`
	Plan      string    `json:"plan"`
	Role      string    `json:"role,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateWorkspaceInput struct {
	Name string `json:"name" binding:"required,min=2,max=100"`
	Slug string `json:"slug" binding:"omitempty,min=2,max=100"`
}

type UpdateWorkspaceInput struct {
	Name    *string `json:"name" binding:"omitempty,min=2,max=100"`
	Slug    *string `json:"slug" binding:"omitempty,min=2,max=100"`
	LogoURL *string `json:"logo_url"`
}
