package handler

import (
	"errors"
	"net/http"

	"ai-support-saas/backend/internal/models"
	"ai-support-saas/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type WorkspaceHandler struct {
	workspaceService *service.WorkspaceService
}

func NewWorkspaceHandler(workspaceService *service.WorkspaceService) *WorkspaceHandler {
	return &WorkspaceHandler{workspaceService: workspaceService}
}

func (h *WorkspaceHandler) Create(c *gin.Context) {
	userID := c.GetString("user_id")

	var input models.CreateWorkspaceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	workspace, err := h.workspaceService.Create(c.Request.Context(), userID, input)
	if err != nil {
		if errors.Is(err, service.ErrWorkspaceSlugTaken) {
			c.JSON(http.StatusConflict, gin.H{"error": "workspace slug already taken"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create workspace"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"workspace": workspace})
}

func (h *WorkspaceHandler) List(c *gin.Context) {
	userID := c.GetString("user_id")

	workspaces, err := h.workspaceService.List(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not load workspaces"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"workspaces": workspaces})
}

func (h *WorkspaceHandler) Get(c *gin.Context) {
	userID := c.GetString("user_id")
	workspaceID := c.Param("id")

	workspace, err := h.workspaceService.GetByID(c.Request.Context(), userID, workspaceID)
	if err != nil {
		if errors.Is(err, service.ErrWorkspaceNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "workspace not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not load workspace"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"workspace": workspace})
}

func (h *WorkspaceHandler) Update(c *gin.Context) {
	userID := c.GetString("user_id")
	workspaceID := c.Param("id")

	var input models.UpdateWorkspaceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	workspace, err := h.workspaceService.Update(c.Request.Context(), userID, workspaceID, input)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrWorkspaceNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "workspace not found"})
		case errors.Is(err, service.ErrWorkspaceForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": "not allowed to update this workspace"})
		case errors.Is(err, service.ErrWorkspaceSlugTaken):
			c.JSON(http.StatusConflict, gin.H{"error": "workspace slug already taken"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update workspace"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"workspace": workspace})
}
