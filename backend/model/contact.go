package model

import "time"

type Contact struct {
	ID          int        `gorm:"primaryKey;autoIncrement" json:"id"`
	ContactUUID string     `gorm:"column:contact_uuid" json:"contact_uuid"`
	Name        string     `gorm:"column:name" json:"name"`
	Mobile      string     `gorm:"column:mobile" json:"mobile"`
	Email       string     `gorm:"column:email" json:"email"`
	Company     string     `gorm:"column:company" json:"company"`
	Designation string     `gorm:"column:designation" json:"designation"`
	Status      string     `gorm:"column:status" json:"status"`
	VIP         bool       `gorm:"column:vip" json:"vip"`
	Address     string     `gorm:"column:address" json:"address"`
	CreatedAt   time.Time  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updated_at"`
	DeletedAt   *time.Time `gorm:"column:deleted_at" json:"deleted_at"`
}

func (Contact) TableName() string { return "contacts" }
