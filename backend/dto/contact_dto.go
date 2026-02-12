package dto

type ContactCreateRequest struct {
	Name        string `json:"name" validate:"required"`
	Mobile      string `json:"mobile" validate:"required"`
	Email       string `json:"email" validate:"omitempty,email"`
	Company     string `json:"company"`
	Designation string `json:"designation"`
	Status      string `json:"status"`
	VIP         bool   `json:"vip"`
	Address     string `json:"address"`
	OwnerID     *int   `json:"owner_id"`
	LeadID      *int   `json:"lead_id"`
	DealID      *int   `json:"deal_id"`
	Tags        string `json:"tags"`
	Notes       string `json:"notes"`
}

type ContactUpdateRequest struct {
	ID          int    `json:"id" validate:"required"`
	Name        string `json:"name"`
	Mobile      string `json:"mobile"`
	Email       string `json:"email" validate:"omitempty,email"`
	Company     string `json:"company"`
	Designation string `json:"designation"`
	Status      string `json:"status"`
	VIP         *bool  `json:"vip"`
	Address     string `json:"address"`
	OwnerID     *int   `json:"owner_id"`
	LeadID      *int   `json:"lead_id"`
	DealID      *int   `json:"deal_id"`
	Tags        string `json:"tags"`
	Notes       string `json:"notes"`
}

type ContactDetailsRequest struct {
	ID int `json:"id" validate:"required"`
}

type ContactDeleteRequest struct {
	ID int `json:"id" validate:"required"`
}

type ContactListRequest struct {
	Page    int    `json:"page" validate:"required,min=1"`
	Limit   int    `json:"limit" validate:"required,min=1"`
	Search  string `json:"search"`
	Status  string `json:"status"`
	VIP     *bool  `json:"vip"`
	OwnerID *int   `json:"owner_id"`
	Tags    string `json:"tags"`
}

type ContactResponse struct {
	ID          int    `json:"id"`
	ContactUUID string `json:"contact_uuid"`
	Name        string `json:"name"`
	Mobile      string `json:"mobile"`
	Email       string `json:"email"`
	Company     string `json:"company"`
	Designation string `json:"designation"`
	Status      string `json:"status"`
	VIP         bool   `json:"vip"`
	Address     string `json:"address"`
	OwnerID     *int   `json:"owner_id"`
	LeadID      *int   `json:"lead_id"`
	DealID      *int   `json:"deal_id"`
	Tags        string `json:"tags"`
	Notes       string `json:"notes"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type ContactListResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Mobile      string `json:"mobile"`
	Email       string `json:"email"`
	Company     string `json:"company"`
	Designation string `json:"designation"`
	Status      string `json:"status"`
	VIP         bool   `json:"vip"`
	OwnerID     *int   `json:"owner_id"`
	Tags        string `json:"tags"`
	CreatedAt   string `json:"created_at"`
}
