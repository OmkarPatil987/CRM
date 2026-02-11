package dto

type UserRegistrationRequest struct {
    Name     string `json:"name" validate:"required"`
    Email    string `json:"email" validate:"required,email"`
    Mobile   string `json:"mobile" validate:"required,len=10"`
    Password string `json:"password" validate:"required,min=6"`
    UserType string `json:"user_type" validate:"required"`
}

type UserLoginRequest struct {
    Username string `json:"username" validate:"required"`
    Password string `json:"password" validate:"required"`
}

type UserUpdateRequest struct {
    ID       int    `json:"id" validate:"required"`
    Name     string `json:"name"`
    Email    string `json:"email" validate:"omitempty,email"`
    Mobile   string `json:"mobile" validate:"omitempty,len=10"`
    UserType string `json:"user_type"`
    IsActive *bool  `json:"is_active"`
}

type UserListRequest struct {
    Page   int    `json:"page" validate:"required,min=1"`
    Limit  int    `json:"limit" validate:"required,min=1"`
    Search string `json:"search"`
}

type UserListResponse struct {
    ID       int    `json:"id"`
    UUID     string `json:"uuid"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Mobile   string `json:"mobile"`
    UserType string `json:"user_type"`
    IsActive bool   `json:"is_active"`
}

type UserDetailsRequest struct {
    ID int `json:"id" validate:"required"`
}

type UserDetailsResponse struct {
    ID       int    `json:"id"`
    UUID     string `json:"uuid"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Mobile   string `json:"mobile"`
    UserType string `json:"user_type"`
    IsActive bool   `json:"is_active"`
}
