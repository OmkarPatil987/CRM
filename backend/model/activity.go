package model

import (
	"time"

	"gorm.io/gorm"
)

type Activity struct {
	ID           int            `gorm:"primaryKey;autoIncrement" json:"id"`
	ActivityUUID string         `gorm:"column:activity_uuid;unique;not null" json:"activity_uuid"`
	Title        string         `gorm:"column:title;not null" json:"title"`
	Type         string         `gorm:"column:type;not null" json:"type"` // call, meeting, email, note
	Description  string         `gorm:"column:description" json:"description"`
	RelatedType  string         `gorm:"column:related_type;not null" json:"related_type"` // lead, deal, contact
	RelatedID    int            `gorm:"column:related_id;not null" json:"related_id"`
	ScheduledAt  time.Time      `gorm:"column:scheduled_at" json:"scheduled_at"`
	Status       string         `gorm:"column:status;default:'pending'" json:"status"` // pending, completed
	OwnerID      *int           `gorm:"column:owner_id" json:"owner_id"`
	CreatedAt    time.Time      `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"column:updated_at" json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"column:deleted_at" json:"deleted_at"`
}

func (Activity) TableName() string {
	return "activities"
}
