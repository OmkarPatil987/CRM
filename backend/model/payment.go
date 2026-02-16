package model

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	OrderID   string  `gorm:"type:varchar(100);not null" json:"order_id"`
	PaymentID string  `gorm:"type:varchar(100)" json:"payment_id"`
	Signature string  `gorm:"type:varchar(255)" json:"-"` // Don't expose signature
	Amount    float64 `json:"amount"`
	Currency  string  `gorm:"type:varchar(10);default:'INR'" json:"currency"`
	Status    string  `gorm:"type:varchar(20);default:'created'" json:"status"` // created, paid, failed

	// User Details captured from form
	Name   string `gorm:"type:varchar(255)" json:"name"`
	Email  string `gorm:"type:varchar(255)" json:"email"`
	Mobile string `gorm:"type:varchar(20)" json:"mobile"`
}
