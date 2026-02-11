package model

import "time"

type LeadActivity struct {
    ID          int        `gorm:"primaryKey;autoIncrement" json:"id"`
    LeadUUID    string     `gorm:"column:lead_uuid" json:"lead_uuid"`
    UserID      int        `gorm:"column:user_id" json:"user_id"`
    UserName    string     `gorm:"column:user_name" json:"user_name"`
    Remarks     string     `gorm:"column:remarks" json:"remarks"`
    Type        string     `gorm:"column:type" json:"type"`
    AssignedTo  string     `gorm:"column:assigned_to" json:"assigned_to"`
    AssignedFrom string    `gorm:"column:assigned_from" json:"assigned_from"`
    CreatedAt   time.Time  `gorm:"column:created_at" json:"created_at"`
    UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updated_at"`
    DeletedAt   *time.Time `gorm:"column:deleted_at" json:"deleted_at"`
}

func (LeadActivity) TableName() string { return "lead_activities" }
