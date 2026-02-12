package dto

type ActivityCreateRequest struct {
	Title       string `json:"title" validate:"required"`
	Type        string `json:"type" validate:"required,oneof=call meeting email note"`
	Description string `json:"description"`
	RelatedType string `json:"related_type" validate:"required,oneof=lead deal contact"`
	RelatedID   int    `json:"related_id" validate:"required"`
	ScheduledAt string `json:"scheduled_at"` // ISO8601 string
	Status      string `json:"status" validate:"omitempty,oneof=pending completed"`
	OwnerID     *int   `json:"owner_id"`
}

type ActivityUpdateRequest struct {
	ID          int    `json:"id" validate:"required"`
	Title       string `json:"title"`
	Type        string `json:"type" validate:"omitempty,oneof=call meeting email note"`
	Description string `json:"description"`
	ScheduledAt string `json:"scheduled_at"`
	Status      string `json:"status" validate:"omitempty,oneof=pending completed"`
}

type ActivityListRequest struct {
	Page        int    `json:"page" validate:"required,min=1"`
	Limit       int    `json:"limit" validate:"required,min=1"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	Status      string `json:"status"`       // pending, completed
	Type        string `json:"type"`         // call, meeting, email, note
	RelatedType string `json:"related_type"` // lead, deal, contact
	OwnerID     *int   `json:"owner_id"`
}

type ActivityResponse struct {
	ID           int    `json:"id"`
	ActivityUUID string `json:"activity_uuid"`
	Title        string `json:"title"`
	Type         string `json:"type"`
	Description  string `json:"description"`
	RelatedType  string `json:"related_type"`
	RelatedID    int    `json:"related_id"`
	ScheduledAt  string `json:"scheduled_at"`
	Status       string `json:"status"`
	OwnerID      *int   `json:"owner_id"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
}
