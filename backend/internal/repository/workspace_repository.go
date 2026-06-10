package repository

import (
	"context"
	"errors"

	"ai-support-saas/backend/internal/database"
	"ai-support-saas/backend/internal/models"
	"github.com/jackc/pgx/v5"
)

type WorkspaceRepository struct {
	db *database.DB
}

func NewWorkspaceRepository(db *database.DB) *WorkspaceRepository {
	return &WorkspaceRepository{db: db}
}

const workspaceColumns = `w.id, w.owner_id, w.name, w.slug, w.logo_url, w.plan, w.created_at, w.updated_at`

func scanWorkspace(row pgx.Row, role *string) (*models.Workspace, error) {
	var workspace models.Workspace
	dest := []any{
		&workspace.ID,
		&workspace.OwnerID,
		&workspace.Name,
		&workspace.Slug,
		&workspace.LogoURL,
		&workspace.Plan,
		&workspace.CreatedAt,
		&workspace.UpdatedAt,
	}
	if role != nil {
		dest = append(dest, role)
	}

	if err := row.Scan(dest...); err != nil {
		return nil, err
	}
	if role != nil {
		workspace.Role = *role
	}
	return &workspace, nil
}

func (r *WorkspaceRepository) Create(ctx context.Context, ownerID, name, slugValue string) (*models.Workspace, error) {
	row := r.db.Pool.QueryRow(ctx,
		`INSERT INTO workspaces (owner_id, name, slug)
		 VALUES ($1, $2, $3)
		 RETURNING id, owner_id, name, slug, logo_url, plan, created_at, updated_at`,
		ownerID, name, slugValue,
	)
	return scanWorkspace(row, nil)
}

func (r *WorkspaceRepository) AddMember(ctx context.Context, workspaceID, userID, role string) error {
	_, err := r.db.Pool.Exec(ctx,
		`INSERT INTO workspace_members (workspace_id, user_id, role)
		 VALUES ($1, $2, $3)`,
		workspaceID, userID, role,
	)
	return err
}

func (r *WorkspaceRepository) SlugExists(ctx context.Context, slugValue string) (bool, error) {
	var exists bool
	err := r.db.Pool.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM workspaces WHERE slug = $1)`,
		slugValue,
	).Scan(&exists)
	return exists, err
}

func (r *WorkspaceRepository) ListForUser(ctx context.Context, userID string) ([]*models.Workspace, error) {
	rows, err := r.db.Pool.Query(ctx,
		`SELECT `+workspaceColumns+`, wm.role
		 FROM workspaces w
		 INNER JOIN workspace_members wm ON wm.workspace_id = w.id
		 WHERE wm.user_id = $1
		 ORDER BY w.created_at ASC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	workspaces := []*models.Workspace{}
	for rows.Next() {
		var role string
		workspace, err := scanWorkspace(rows, &role)
		if err != nil {
			return nil, err
		}
		workspaces = append(workspaces, workspace)
	}

	return workspaces, rows.Err()
}

func (r *WorkspaceRepository) FindByIDForUser(ctx context.Context, workspaceID, userID string) (*models.Workspace, error) {
	var role string
	row := r.db.Pool.QueryRow(ctx,
		`SELECT `+workspaceColumns+`, wm.role
		 FROM workspaces w
		 INNER JOIN workspace_members wm ON wm.workspace_id = w.id
		 WHERE w.id = $1 AND wm.user_id = $2`,
		workspaceID, userID,
	)
	return scanWorkspace(row, &role)
}

func (r *WorkspaceRepository) GetMemberRole(ctx context.Context, workspaceID, userID string) (string, error) {
	var role string
	err := r.db.Pool.QueryRow(ctx,
		`SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
		workspaceID, userID,
	).Scan(&role)
	return role, err
}

func (r *WorkspaceRepository) Update(ctx context.Context, workspaceID, name, slugValue string, logoURL *string) (*models.Workspace, error) {
	row := r.db.Pool.QueryRow(ctx,
		`UPDATE workspaces
		 SET name = $1,
		     slug = $2,
		     logo_url = $3,
		     updated_at = CURRENT_TIMESTAMP
		 WHERE id = $4
		 RETURNING id, owner_id, name, slug, logo_url, plan, created_at, updated_at`,
		name, slugValue, logoURL, workspaceID,
	)
	return scanWorkspace(row, nil)
}

func (r *WorkspaceRepository) IsMember(ctx context.Context, workspaceID, userID string) (bool, error) {
	var exists bool
	err := r.db.Pool.QueryRow(ctx,
		`SELECT EXISTS(
			SELECT 1 FROM workspace_members WHERE workspace_id = $1 AND user_id = $2
		)`,
		workspaceID, userID,
	).Scan(&exists)
	return exists, err
}

var ErrWorkspaceNotFound = errors.New("workspace not found")
