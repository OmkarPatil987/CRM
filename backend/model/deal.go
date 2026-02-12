package model

import (
	"time"

	"gorm.io/gorm"
)

type Deal struct {
	ID                int            `gorm:"primaryKey;autoIncrement" json:"id"`
	DealUUID          string         `gorm:"column:deal_uuid;unique;not null" json:"deal_uuid"`
	Title             string         `gorm:"column:title;not null" json:"title"`
	Description       string         `gorm:"column:description" json:"description"`
	Amount            float64        `gorm:"column:amount;default:0" json:"amount"`
	Stage             string         `gorm:"column:stage;default:'New'" json:"stage"`
	Status            string         `gorm:"column:status;default:'Open'" json:"status"`
	Probability       int            `gorm:"column:probability;default:0" json:"probability"`
	ExpectedCloseDate *time.Time     `gorm:"column:expected_close_date" json:"expected_close_date"`
	ContactID         *int           `gorm:"column:contact_id" json:"contact_id"`
	LeadID            *int           `gorm:"column:lead_id" json:"lead_id"`
	OwnerID           *int           `gorm:"column:owner_id" json:"owner_id"`
	Notes             string         `gorm:"column:notes" json:"notes"`
	CreatedAt         time.Time      `gorm:"column:created_at" json:"created_at"`
	UpdatedAt         time.Time      `gorm:"column:updated_at" json:"updated_at"`
	DeletedAt         gorm.DeletedAt `gorm:"column:deleted_at" json:"deleted_at"`

	// Relationships
	Contact *Contact `gorm:"foreignKey:ContactID" json:"contact,omitempty"`
	// Lead    *Lead    `gorm:"foreignKey:LeadID" json:"lead,omitempty"` // Uncomment if Lead model exists and is imported
	// Owner   *User    `gorm:"foreignKey:OwnerID" json:"owner,omitempty"` // Uncomment if User model exists and is imported
}

func (Deal) TableName() string {
	return "deals"
}
