package service

import (
	"camp-backend/dto"
	"camp-backend/model"
	"camp-backend/repository"
	"camp-backend/util"
	"time"

	"github.com/google/uuid"
)

type DealService interface {
	Create(req dto.DealCreateRequest) (*dto.DealResponse, error)
	Update(req dto.DealUpdateRequest) error
	Delete(id int) error
	Details(id int) (*dto.DealResponse, error)
	List(req dto.DealListRequest) ([]dto.DealListResponse, int64, int64, error)
	UpdateStage(id int, stage string) error
}

type dealService struct{ repo repository.DealRepository }

var Deal DealService = &dealService{repo: repository.NewDealRepository()}

func (s *dealService) Create(req dto.DealCreateRequest) (*dto.DealResponse, error) {
	if err := util.ValidateStruct(req); err != nil {
		return nil, err
	}

	var expectedCloseDate *time.Time
	if req.ExpectedCloseDate != "" {
		parsed, err := time.Parse("2006-01-02", req.ExpectedCloseDate)
		if err == nil {
			expectedCloseDate = &parsed
		}
	}

	now := time.Now()
	deal := &model.Deal{
		DealUUID:          uuid.New().String(),
		Title:             req.Title,
		Description:       req.Description,
		Amount:            req.Amount,
		Stage:             req.Stage,
		Status:            req.Status,
		Probability:       req.Probability,
		ExpectedCloseDate: expectedCloseDate,
		ContactID:         req.ContactID,
		LeadID:            req.LeadID,
		OwnerID:           req.OwnerID,
		Notes:             req.Notes,
		CreatedAt:         now,
		UpdatedAt:         now,
	}
	if deal.Status == "" {
		deal.Status = "Open"
	}

	if err := s.repo.Create(deal); err != nil {
		return nil, err
	}

	return s.mapToResponse(deal), nil
}

func (s *dealService) Update(req dto.DealUpdateRequest) error {
	if err := util.ValidateStruct(req); err != nil {
		return err
	}

	deal, err := s.repo.GetByID(req.ID)
	if err != nil {
		return err
	}

	if req.Title != "" {
		deal.Title = req.Title
	}
	if req.Description != "" {
		deal.Description = req.Description
	}
	if req.Amount != nil {
		deal.Amount = *req.Amount
	}
	if req.Stage != "" {
		deal.Stage = req.Stage
	}
	if req.Status != "" {
		deal.Status = req.Status
	}
	if req.Probability != nil {
		deal.Probability = *req.Probability
	}
	if req.ExpectedCloseDate != "" {
		parsed, err := time.Parse("2006-01-02", req.ExpectedCloseDate)
		if err == nil {
			deal.ExpectedCloseDate = &parsed
		}
	}
	if req.ContactID != nil {
		deal.ContactID = req.ContactID
	}
	if req.LeadID != nil {
		deal.LeadID = req.LeadID
	}
	if req.OwnerID != nil {
		deal.OwnerID = req.OwnerID
	}
	if req.Notes != "" {
		deal.Notes = req.Notes
	}
	deal.UpdatedAt = time.Now()

	return s.repo.Update(deal)
}

func (s *dealService) Delete(id int) error {
	return s.repo.Delete(id)
}

func (s *dealService) Details(id int) (*dto.DealResponse, error) {
	deal, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return s.mapToResponse(deal), nil
}

func (s *dealService) mapToResponse(deal *model.Deal) *dto.DealResponse {
	var closeDate string
	if deal.ExpectedCloseDate != nil {
		closeDate = deal.ExpectedCloseDate.Format("2006-01-02")
	}
	contactName := ""
	if deal.Contact != nil {
		contactName = deal.Contact.Name
	}

	return &dto.DealResponse{
		ID:                deal.ID,
		DealUUID:          deal.DealUUID,
		Title:             deal.Title,
		Description:       deal.Description,
		Amount:            deal.Amount,
		Stage:             deal.Stage,
		Status:            deal.Status,
		Probability:       deal.Probability,
		ExpectedCloseDate: closeDate,
		ContactID:         deal.ContactID,
		LeadID:            deal.LeadID,
		OwnerID:           deal.OwnerID,
		Notes:             deal.Notes,
		CreatedAt:         deal.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         deal.UpdatedAt.Format(time.RFC3339),
		ContactName:       contactName,
	}
}

func (s *dealService) List(req dto.DealListRequest) ([]dto.DealListResponse, int64, int64, error) {
	if req.Page == 0 {
		req.Page = 1
	}
	if req.Limit == 0 {
		req.Limit = 10
	}
	// TODO: formatting date in repo or here
	return s.repo.List(req)
}

func (s *dealService) UpdateStage(id int, stage string) error {
	// Validate stage enum?
	// "New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"
	validStages := map[string]bool{
		"New": true, "Qualified": true, "Proposal": true, "Negotiation": true, "Won": true, "Lost": true,
	}
	if !validStages[stage] {
		// errors.New("invalid stage")
		return nil // or return error
	}
	return s.repo.UpdateStage(id, stage)
}
