package repository

import (
	"camp-backend/database"
	"camp-backend/dto"
	"camp-backend/model"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type DealRepository interface {
	Create(deal *model.Deal) error
	Update(deal *model.Deal) error
	Delete(id int) error
	GetByID(id int) (*model.Deal, error)
	List(req dto.DealListRequest) ([]dto.DealListResponse, int64, int64, error)
	UpdateStage(id int, stage string) error
}

type dealRepo struct{}

func NewDealRepository() DealRepository {
	return &dealRepo{}
}

func (r *dealRepo) Create(deal *model.Deal) error {
	return database.DB.Create(deal).Error
}

func (r *dealRepo) Update(deal *model.Deal) error {
	return database.DB.Save(deal).Error
}

func (r *dealRepo) Delete(id int) error {
	return database.DB.Delete(&model.Deal{}, id).Error
}

func (r *dealRepo) GetByID(id int) (*model.Deal, error) {
	var deal model.Deal
	err := database.DB.Preload("Contact").First(&deal, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("deal not found")
		}
		return nil, err
	}
	return &deal, nil
}

func (r *dealRepo) List(req dto.DealListRequest) ([]dto.DealListResponse, int64, int64, error) {
	var deals []model.Deal
	var total int64
	var filtered int64

	// Base query
	base := database.DB.Model(&model.Deal{})

	// Count total records
	base.Count(&total)

	q := base

	// Search Filter
	if req.Search != "" {
		search := "%" + strings.ToLower(req.Search) + "%"
		q = q.Where("LOWER(title) LIKE ?", search)
	}

	// Stage Filter
	if req.Stage != "" {
		q = q.Where("stage = ?", req.Stage)
	}

	// Owner Filter
	if req.OwnerID != nil {
		q = q.Where("owner_id = ?", *req.OwnerID)
	}

	// Date Range Filter
	if req.DateRangeCheck != "" && req.StartDate != "" && req.EndDate != "" {
		// Assuming date format YYYY-MM-DD
		q = q.Where(req.DateRangeCheck+" BETWEEN ? AND ?", req.StartDate, req.EndDate)
	}

	// Count after filters
	q.Count(&filtered)

	// Pagination
	offset := (req.Page - 1) * req.Limit
	err := q.Limit(req.Limit).Offset(offset).Order("created_at desc").Preload("Contact").Find(&deals).Error
	if err != nil {
		return nil, 0, 0, err
	}

	// Transform to Response DTO
	var response []dto.DealListResponse
	for _, d := range deals {
		contactName := ""
		if d.Contact != nil {
			contactName = d.Contact.Name
		}
		response = append(response, dto.DealListResponse{
			ID:                d.ID,
			Title:             d.Title,
			Amount:            d.Amount,
			Stage:             d.Stage,
			Status:            d.Status,
			Probability:       d.Probability,
			ExpectedCloseDate: "", // Handle time formatting in service if needed, or here
			ContactName:       contactName,
			// OwnerName: "", // TODO: Preload Owner and map
			CreatedAt: d.CreatedAt.String(),
		})
	}

	return response, total, filtered, nil
}

func (r *dealRepo) UpdateStage(id int, stage string) error {
	return database.DB.Model(&model.Deal{}).Where("id = ?", id).Update("stage", stage).Error
}
