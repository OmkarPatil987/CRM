package service

import (
    "camp-backend/dto"
    "camp-backend/model"
    "camp-backend/repository"
    "camp-backend/util"
    "errors"
    "time"
)

type UserService interface {
    Register(req dto.UserRegistrationRequest) (*model.User, error)
    Login(username, password string) (*model.User, string, error)
    List(req dto.UserListRequest) ([]dto.UserListResponse, int64, int64, error)
    Details(id int) (*dto.UserDetailsResponse, error)
    Update(req dto.UserUpdateRequest) error
}

type userService struct { repo repository.UserRepository }

var User UserService = &userService{repo: repository.NewUserRepository()}

func (s *userService) Register(req dto.UserRegistrationRequest) (*model.User, error) {
    if err := util.ValidateStruct(req); err != nil {
        return nil, err
    }
    hashed, err := util.HashPassword(req.Password)
    if err != nil {
        return nil, err
    }
    user := &model.User{
        Name:      req.Name,
        Email:     req.Email,
        Mobile:    req.Mobile,
        Password:  hashed,
        UserType:  req.UserType,
        IsActive:  true,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }
    if err := s.repo.Create(user); err != nil {
        return nil, err
    }
    return user, nil
}

func (s *userService) Login(username, password string) (*model.User, string, error) {
    if username == "" || password == "" {
        return nil, "", errors.New("missing credentials")
    }
    user, err := s.repo.GetByEmailOrMobile(username)
    if err != nil {
        return nil, "", err
    }
    if !util.CheckPassword(user.Password, password) {
        return nil, "", errors.New("invalid credentials")
    }
    token, err := util.GenerateToken(user.ID, user.UserType, 12)
    if err != nil {
        return nil, "", err
    }
    return user, token, nil
}

func (s *userService) List(req dto.UserListRequest) ([]dto.UserListResponse, int64, int64, error) {
    if req.Page == 0 { req.Page = 1 }
    if req.Limit == 0 { req.Limit = 10 }
    return s.repo.List(req)
}

func (s *userService) Details(id int) (*dto.UserDetailsResponse, error) {
    user, err := s.repo.GetByID(id)
    if err != nil {
        return nil, err
    }
    resp := &dto.UserDetailsResponse{
        ID:       user.ID,
        UUID:     user.UUID,
        Name:     user.Name,
        Email:    user.Email,
        Mobile:   user.Mobile,
        UserType: user.UserType,
        IsActive: user.IsActive,
    }
    return resp, nil
}

func (s *userService) Update(req dto.UserUpdateRequest) error {
    user, err := s.repo.GetByID(req.ID)
    if err != nil {
        return err
    }
    if req.Name != "" { user.Name = req.Name }
    if req.Email != "" { user.Email = req.Email }
    if req.Mobile != "" { user.Mobile = req.Mobile }
    if req.UserType != "" { user.UserType = req.UserType }
    if req.IsActive != nil { user.IsActive = *req.IsActive }
    user.UpdatedAt = time.Now()
    return s.repo.Update(user)
}
