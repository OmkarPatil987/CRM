package service

import (
	"camp-backend/dto"
	"camp-backend/model"
	"camp-backend/repository"
	"camp-backend/util"
	"time"

	"github.com/google/uuid"
)

type ActivityService interface {
	Create(req dto.ActivityCreateRequest) (*dto.ActivityResponse, error)
	Update(req dto.ActivityUpdateRequest) error
	Delete(id int) error
	List(req dto.ActivityListRequest) ([]dto.ActivityResponse, int64, int64, error)
}

type activityService struct{ repo repository.ActivityRepository }

var Activity ActivityService = &activityService{repo: repository.NewActivityRepository()}

func (s *activityService) Create(req dto.ActivityCreateRequest) (*dto.ActivityResponse, error) {
	if err := util.ValidateStruct(req); err != nil {
		return nil, err
	}

	scheduledAt := time.Now()
	if req.ScheduledAt != "" {
		parsed, err := time.Parse(time.RFC3339, req.ScheduledAt)
		if err == nil {
			scheduledAt = parsed
		}
	}

	activity := &model.Activity{
		ActivityUUID: uuid.New().String(),
		Title:        req.Title,
		Type:         req.Type,
		Description:  req.Description,
		RelatedType:  req.RelatedType,
		RelatedID:    req.RelatedID,
		ScheduledAt:  scheduledAt,
		Status:       req.Status,
		OwnerID:      req.OwnerID,
	}
	if activity.Status == "" {
		activity.Status = "pending"
	}

	if err := s.repo.Create(activity); err != nil {
		return nil, err
	}
	return s.mapToResponse(activity), nil
}

func (s *activityService) Update(req dto.ActivityUpdateRequest) error {
	if err := util.ValidateStruct(req); err != nil {
		return err
	}

	activity, err := s.repo.GetByID(req.ID)
	if err != nil {
		return err
	}

	if req.Title != "" {
		activity.Title = req.Title
	}
	if req.Type != "" {
		activity.Type = req.Type
	}
	if req.Description != "" {
		activity.Description = req.Description
	}
	if req.Status != "" {
		activity.Status = req.Status
	}
	if req.ScheduledAt != "" {
		parsed, err := time.Parse(time.RFC3339, req.ScheduledAt)
		if err == nil {
			activity.ScheduledAt = parsed
		}
	}

	return s.repo.Update(activity)
}

func (s *activityService) Delete(id int) error {
	return s.repo.Delete(id)
}

func (s *activityService) List(req dto.ActivityListRequest) ([]dto.ActivityResponse, int64, int64, error) {
	if req.Page <= 0 {
		req.Page = 1
	}
	if req.Limit <= 0 {
		req.Limit = 10
	}

	// Default 7 Days Logic: If date range is NOT provided, show last 7 days + future
	if req.StartDate == "" && req.EndDate == "" {
		last7Days := time.Now().AddDate(0, 0, -7).Format("2006-01-02")
		req.StartDate = last7Days
	}

	activities, total, filtered, err := s.repo.List(req)
	if err != nil {
		return nil, 0, 0, err
	}

	var response []dto.ActivityResponse
	for _, a := range activities {
		response = append(response, *s.mapToResponse(&a))
	}
	return response, total, filtered, nil
}

func (s *activityService) mapToResponse(a *model.Activity) *dto.ActivityResponse {
	return &dto.ActivityResponse{
		ID:           a.ID,
		ActivityUUID: a.ActivityUUID,
		Title:        a.Title,
		Type:         a.Type,
		Description:  a.Description,
		RelatedType:  a.RelatedType,
		RelatedID:    a.RelatedID,
		ScheduledAt:  a.ScheduledAt.Format(time.RFC3339),
		Status:       a.Status,
		OwnerID:      a.OwnerID,
		CreatedAt:    a.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    a.UpdatedAt.Format(time.RFC3339),
	}
}
