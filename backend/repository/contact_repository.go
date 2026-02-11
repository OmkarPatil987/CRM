package repository

import (
	"camp-backend/database"
	"camp-backend/dto"
	"camp-backend/model"
	"time"

	"github.com/google/uuid"
)

type ContactRepository interface {
	Create(contact *model.Contact) error
	Update(contact *model.Contact) error
	Delete(id int) error
	GetByID(id int) (*model.Contact, error)
	GetByUUID(contactUUID string) (*model.Contact, error)
	List(req dto.ContactListRequest) ([]dto.ContactListResponse, int64, int64, error)
}

type contactRepo struct{}

func NewContactRepository() ContactRepository { return &contactRepo{} }

func (r *contactRepo) Create(contact *model.Contact) error {
	if contact.ContactUUID == "" {
		contact.ContactUUID = uuid.New().String()
	}
	return database.DB.Create(contact).Error
}

func (r *contactRepo) Update(contact *model.Contact) error {
	return database.DB.Save(contact).Error
}

func (r *contactRepo) Delete(id int) error {
	now := time.Now()
	return database.DB.Model(&model.Contact{}).
		Where("id = ? AND deleted_at IS NULL", id).
		Update("deleted_at", &now).Error
}

func (r *contactRepo) GetByID(id int) (*model.Contact, error) {
	var contact model.Contact
	if err := database.DB.Where("id = ? AND deleted_at IS NULL", id).First(&contact).Error; err != nil {
		return nil, err
	}
	return &contact, nil
}

func (r *contactRepo) GetByUUID(contactUUID string) (*model.Contact, error) {
	var contact model.Contact
	if err := database.DB.Where("contact_uuid = ? AND deleted_at IS NULL", contactUUID).First(&contact).Error; err != nil {
		return nil, err
	}
	return &contact, nil
}

func (r *contactRepo) List(req dto.ContactListRequest) ([]dto.ContactListResponse, int64, int64, error) {
	var contacts []model.Contact
	var total int64
	var filtered int64

	base := database.DB.Model(&model.Contact{}).Where("deleted_at IS NULL")
	if err := base.Count(&total).Error; err != nil {
		return nil, 0, 0, err
	}

	q := base
	if req.Search != "" {
		like := "%" + req.Search + "%"
		q = q.Where("name LIKE ? OR mobile LIKE ? OR email LIKE ? OR company LIKE ? OR designation LIKE ?", like, like, like, like, like)
	}
	if req.Status != "" {
		q = q.Where("status = ?", req.Status)
	}
	if req.VIP != nil {
		q = q.Where("vip = ?", *req.VIP)
	}

	if err := q.Count(&filtered).Error; err != nil {
		return nil, 0, 0, err
	}

	if err := q.Offset((req.Page - 1) * req.Limit).Limit(req.Limit).Order("created_at DESC").Find(&contacts).Error; err != nil {
		return nil, 0, 0, err
	}

	resp := make([]dto.ContactListResponse, 0, len(contacts))
	for _, c := range contacts {
		resp = append(resp, dto.ContactListResponse{
			ID:          c.ID,
			Name:        c.Name,
			Mobile:      c.Mobile,
			Email:       c.Email,
			Company:     c.Company,
			Designation: c.Designation,
			Status:      c.Status,
			VIP:         c.VIP,
			CreatedAt:   c.CreatedAt.Format(time.RFC3339),
		})
	}

	return resp, total, filtered, nil
}
