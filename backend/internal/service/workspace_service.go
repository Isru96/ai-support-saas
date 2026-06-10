package service

import (
	"context"
	"errors"

	"ai-support-saas/backend/internal/models"
	"ai-support-saas/backend/internal/pkg/slug"
	"ai-support-saas/backend/internal/repository"
	"github.com/jackc/pgx/v5"
)

var (
	ErrWorkspaceNotFound = errors.New("workspace not found")
	ErrWorkspaceForbidden = errors.New("not allowed to manage this workspace")
	ErrWorkspaceSlugTaken = errors.New("workspace slug already taken")
)

type WorkspaceService struct {
	workspaceRepo *repository.WorkspaceRepository
}

func NewWorkspaceService(workspaceRepo *repository.WorkspaceRepository) *WorkspaceService {
	return &WorkspaceService{workspaceRepo: workspaceRepo}
}

func (s *WorkspaceService) Create(ctx context.Context, userID string, input models.CreateWorkspaceInput) (*models.Workspace, error) {
	slugValue := input.Slug
	if slugValue == "" {
		slugValue = slug.FromName(input.Name)
	} else {
		slugValue = slug.FromName(slugValue)
	}

	slugValue, err := s.ensureUniqueSlug(ctx, slugValue)
	if err != nil {
		return nil, err
	}

	workspace, err := s.workspaceRepo.Create(ctx, userID, input.Name, slugValue)
	if err != nil {
		return nil, err
	}

	if err := s.workspaceRepo.AddMember(ctx, workspace.ID, userID, models.RoleOwner); err != nil {
		return nil, err
	}

	workspace.Role = models.RoleOwner
	return workspace, nil
}

func (s *WorkspaceService) List(ctx context.Context, userID string) ([]*models.Workspace, error) {
	return s.workspaceRepo.ListForUser(ctx, userID)
}

func (s *WorkspaceService) GetByID(ctx context.Context, userID, workspaceID string) (*models.Workspace, error) {
	workspace, err := s.workspaceRepo.FindByIDForUser(ctx, workspaceID, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrWorkspaceNotFound
		}
		return nil, err
	}
	return workspace, nil
}

func (s *WorkspaceService) Update(ctx context.Context, userID, workspaceID string, input models.UpdateWorkspaceInput) (*models.Workspace, error) {
	workspace, err := s.GetByID(ctx, userID, workspaceID)
	if err != nil {
		return nil, err
	}

	role, err := s.workspaceRepo.GetMemberRole(ctx, workspaceID, userID)
	if err != nil {
		return nil, err
	}
	if role != models.RoleOwner && role != models.RoleAdmin {
		return nil, ErrWorkspaceForbidden
	}

	name := workspace.Name
	if input.Name != nil {
		name = *input.Name
	}

	slugValue := workspace.Slug
	if input.Slug != nil {
		slugValue = slug.FromName(*input.Slug)
		if slugValue != workspace.Slug {
			exists, err := s.workspaceRepo.SlugExists(ctx, slugValue)
			if err != nil {
				return nil, err
			}
			if exists {
				return nil, ErrWorkspaceSlugTaken
			}
		}
	}

	updated, err := s.workspaceRepo.Update(ctx, workspaceID, name, slugValue, input.LogoURL)
	if err != nil {
		return nil, err
	}

	updated.Role = role
	return updated, nil
}

func (s *WorkspaceService) ensureUniqueSlug(ctx context.Context, base string) (string, error) {
	candidate := base
	for i := 1; i < 100; i++ {
		exists, err := s.workspaceRepo.SlugExists(ctx, candidate)
		if err != nil {
			return "", err
		}
		if !exists {
			return candidate, nil
		}
		candidate = slug.WithSuffix(base, i+1)
	}
	return "", ErrWorkspaceSlugTaken
}
