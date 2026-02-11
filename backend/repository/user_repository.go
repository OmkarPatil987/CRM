package repository

import (
    "camp-backend/database"
    "camp-backend/dto"
    "camp-backend/model"

    "github.com/google/uuid"
)

type UserRepository interface {
    Create(user *model.User) error
    GetByEmailOrMobile(username string) (*model.User, error)
    GetByID(id int) (*model.User, error)
    List(req dto.UserListRequest) ([]dto.UserListResponse, int64, int64, error)
    Update(user *model.User) error
}

type userRepo struct{}

func NewUserRepository() UserRepository { return &userRepo{} }

func (r *userRepo) Create(user *model.User) error {
    if user.UUID == "" {
        user.UUID = uuid.New().String()
    }
    return database.DB.Create(user).Error
}

func (r *userRepo) GetByEmailOrMobile(username string) (*model.User, error) {
    var u model.User
    if err := database.DB.Where("email = ? OR mobile = ?", username, username).First(&u).Error; err != nil {
        return nil, err
    }
    return &u, nil
}

func (r *userRepo) GetByID(id int) (*model.User, error) {
    var u model.User
    if err := database.DB.First(&u, id).Error; err != nil {
        return nil, err
    }
    return &u, nil
}

func (r *userRepo) List(req dto.UserListRequest) ([]dto.UserListResponse, int64, int64, error) {
    var users []model.User
    var total int64

    q := database.DB.Model(&model.User{})
    if err := q.Count(&total).Error; err != nil {
        return nil, 0, 0, err
    }

    if req.Search != "" {
        like := "%" + req.Search + "%"
        q = q.Where("name LIKE ? OR email LIKE ? OR mobile LIKE ?", like, like, like)
    }

    if err := q.Offset((req.Page-1)*req.Limit).Limit(req.Limit).Order("created_at DESC").Find(&users).Error; err != nil {
        return nil, 0, 0, err
    }

    filtered := int64(len(users))
    resp := make([]dto.UserListResponse, 0, len(users))
    for _, u := range users {
        resp = append(resp, dto.UserListResponse{
            ID:       u.ID,
            UUID:     u.UUID,
            Name:     u.Name,
            Email:    u.Email,
            Mobile:   u.Mobile,
            UserType: u.UserType,
            IsActive: u.IsActive,
        })
    }

    return resp, total, filtered, nil
}

func (r *userRepo) Update(user *model.User) error {
    return database.DB.Save(user).Error
}
