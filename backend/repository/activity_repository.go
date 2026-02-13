package repository

import (
	"camp-backend/database"
	"camp-backend/dto"
	"camp-backend/model"
	"errors"

	"gorm.io/gorm"
)

type ActivityRepository interface {
	Create(activity *model.Activity) error
	Update(activity *model.Activity) error
	Delete(id int) error
	GetByID(id int) (*model.Activity, error)
	List(req dto.ActivityListRequest) ([]model.Activity, int64, int64, error)
}

type activityRepo struct{}

func NewActivityRepository() ActivityRepository {
	return &activityRepo{}
}

func (r *activityRepo) Create(activity *model.Activity) error {
	return database.DB.Create(activity).Error
}

func (r *activityRepo) Update(activity *model.Activity) error {
	return database.DB.Save(activity).Error
}

func (r *activityRepo) Delete(id int) error {
	return database.DB.Delete(&model.Activity{}, id).Error
}

func (r *activityRepo) GetByID(id int) (*model.Activity, error) {
	var activity model.Activity
	err := database.DB.First(&activity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("activity not found")
		}
		return nil, err
	}
	return &activity, nil
}

func (r *activityRepo) List(req dto.ActivityListRequest) ([]model.Activity, int64, int64, error) {
	var activities []model.Activity
	var total int64
	var filtered int64

	base := database.DB.Model(&model.Activity{})
	base.Count(&total)

	q := database.DB.Model(&model.Activity{})

	// Filter Logic
	if req.Type != "" {
		q = q.Where("type = ?", req.Type)
	}
	if req.Status != "" {
		q = q.Where("status = ?", req.Status)
	}
	if req.RelatedType != "" {
		q = q.Where("related_type = ?", req.RelatedType)
	}
	if req.OwnerID != nil {
		q = q.Where("owner_id = ?", *req.OwnerID)
	}

	// Date Filter
	if req.StartDate != "" && req.EndDate != "" {
		// Assuming date format YYYY-MM-DD or similar standard format
		// Also handling potential time components if passed
		q = q.Where("scheduled_at BETWEEN ? AND ?", req.StartDate, req.EndDate)
	} else if req.StartDate != "" {
		q = q.Where("scheduled_at >= ?", req.StartDate)
	}

	q.Count(&filtered)

	offset := (req.Page - 1) * req.Limit
	err := q.Limit(req.Limit).Offset(offset).Order("scheduled_at desc").Find(&activities).Error
	if err != nil {
		return nil, 0, 0, err
	}

	return activities, total, filtered, nil
}
