package dto

type DealCreateRequest struct {
	Title             string  `json:"title" validate:"required"`
	Description       string  `json:"description"`
	Amount            float64 `json:"amount" validate:"min=0"`
	Stage             string  `json:"stage" validate:"required,oneof=New Qualified Proposal Negotiation Won Lost"`
	Status            string  `json:"status" validate:"omitempty,oneof=Open Won Lost"`
	Probability       int     `json:"probability" validate:"min=0,max=100"`
	ExpectedCloseDate string  `json:"expected_close_date"` // Change to string to parse manually
	ContactID         *int    `json:"contact_id"`
	LeadID            *int    `json:"lead_id"`
	OwnerID           *int    `json:"owner_id"`
	Notes             string  `json:"notes"`
}

type DealUpdateRequest struct {
	ID                int      `json:"id" validate:"required"`
	Title             string   `json:"title"`
	Description       string   `json:"description"`
	Amount            *float64 `json:"amount"` // Pointer to distinguish 0 from undefined if needed, or handle in service logic
	Stage             string   `json:"stage" validate:"omitempty,oneof=New Qualified Proposal Negotiation Won Lost"`
	Status            string   `json:"status" validate:"omitempty,oneof=Open Won Lost"`
	Probability       *int     `json:"probability"`
	ExpectedCloseDate string   `json:"expected_close_date"`
	ContactID         *int     `json:"contact_id"`
	LeadID            *int     `json:"lead_id"`
	OwnerID           *int     `json:"owner_id"`
	Notes             string   `json:"notes"`
}

type DealListRequest struct {
	Page           int    `json:"page" validate:"required,min=1"`
	Limit          int    `json:"limit" validate:"required,min=1"`
	Search         string `json:"search"`
	Stage          string `json:"stage"`
	OwnerID        *int   `json:"owner_id"`
	DateRangeCheck string `json:"date_range_check"` // e.g., "expected_close_date"
	StartDate      string `json:"start_date"`
	EndDate        string `json:"end_date"`
}

type DealResponse struct {
	ID                int     `json:"id"`
	DealUUID          string  `json:"deal_uuid"`
	Title             string  `json:"title"`
	Description       string  `json:"description"`
	Amount            float64 `json:"amount"`
	Stage             string  `json:"stage"`
	Status            string  `json:"status"`
	Probability       int     `json:"probability"`
	ExpectedCloseDate string  `json:"expected_close_date"`
	ContactID         *int    `json:"contact_id"`
	LeadID            *int    `json:"lead_id"`
	OwnerID           *int    `json:"owner_id"`
	Notes             string  `json:"notes"`
	CreatedAt         string  `json:"created_at"`
	UpdatedAt         string  `json:"updated_at"`
	// Optional: Include Contact/Owner Names for UI
	ContactName string `json:"contact_name,omitempty"`
}

type DealListResponse struct {
	ID                int     `json:"id"`
	Title             string  `json:"title"`
	Amount            float64 `json:"amount"`
	Stage             string  `json:"stage"`
	Status            string  `json:"status"`
	Probability       int     `json:"probability"`
	ExpectedCloseDate string  `json:"expected_close_date"`
	OwnerName         string  `json:"owner_name"`
	ContactName       string  `json:"contact_name"`
	CreatedAt         string  `json:"created_at"`
}
