package service

import (
	"camp-backend/dto"
	"camp-backend/model"
	"camp-backend/repository"
	"camp-backend/util"
	"time"
)

type ContactService interface {
	Create(req dto.ContactCreateRequest) (*dto.ContactResponse, error)
	Update(req dto.ContactUpdateRequest) error
	Delete(req dto.ContactDeleteRequest) error
	Details(id int) (*dto.ContactResponse, error)
	List(req dto.ContactListRequest) ([]dto.ContactListResponse, int64, int64, error)
}

type contactService struct{ repo repository.ContactRepository }

var Contact ContactService = &contactService{repo: repository.NewContactRepository()}

func (s *contactService) Create(req dto.ContactCreateRequest) (*dto.ContactResponse, error) {
	if err := util.ValidateStruct(req); err != nil {
		return nil, err
	}

	now := time.Now()
	contact := &model.Contact{
		Name:        req.Name,
		Mobile:      req.Mobile,
		Email:       req.Email,
		Company:     req.Company,
		Designation: req.Designation,
		Status:      req.Status,
		VIP:         req.VIP,
		Address:     req.Address,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if err := s.repo.Create(contact); err != nil {
		return nil, err
	}

	return &dto.ContactResponse{
		ID:          contact.ID,
		ContactUUID: contact.ContactUUID,
		Name:        contact.Name,
		Mobile:      contact.Mobile,
		Email:       contact.Email,
		Company:     contact.Company,
		Designation: contact.Designation,
		Status:      contact.Status,
		VIP:         contact.VIP,
		Address:     contact.Address,
		CreatedAt:   contact.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   contact.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (s *contactService) Update(req dto.ContactUpdateRequest) error {
	if err := util.ValidateStruct(req); err != nil {
		return err
	}

	contact, err := s.repo.GetByID(req.ID)
	if err != nil {
		return err
	}

	if req.Name != "" {
		contact.Name = req.Name
	}
	if req.Mobile != "" {
		contact.Mobile = req.Mobile
	}
	if req.Email != "" {
		contact.Email = req.Email
	}
	if req.Company != "" {
		contact.Company = req.Company
	}
	if req.Designation != "" {
		contact.Designation = req.Designation
	}
	if req.Status != "" {
		contact.Status = req.Status
	}
	if req.VIP != nil {
		contact.VIP = *req.VIP
	}
	if req.Address != "" {
		contact.Address = req.Address
	}
	contact.UpdatedAt = time.Now()

	return s.repo.Update(contact)
}

func (s *contactService) Delete(req dto.ContactDeleteRequest) error {
	if err := util.ValidateStruct(req); err != nil {
		return err
	}
	return s.repo.Delete(req.ID)
}

func (s *contactService) Details(id int) (*dto.ContactResponse, error) {
	contact, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return &dto.ContactResponse{
		ID:          contact.ID,
		ContactUUID: contact.ContactUUID,
		Name:        contact.Name,
		Mobile:      contact.Mobile,
		Email:       contact.Email,
		Company:     contact.Company,
		Designation: contact.Designation,
		Status:      contact.Status,
		VIP:         contact.VIP,
		Address:     contact.Address,
		CreatedAt:   contact.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   contact.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (s *contactService) List(req dto.ContactListRequest) ([]dto.ContactListResponse, int64, int64, error) {
	if req.Page == 0 {
		req.Page = 1
	}
	if req.Limit == 0 {
		req.Limit = 10
	}
	return s.repo.List(req)
}
