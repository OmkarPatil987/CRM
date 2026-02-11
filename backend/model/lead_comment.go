package model

import "time"

type LeadComment struct {
    ID         int       `gorm:"primaryKey;autoIncrement" json:"id"`
    LeadUUID   string    `gorm:"column:lead_uuid" json:"lead_uuid"`
    Remark     string    `gorm:"column:remark" json:"remark"`
    Type       string    `gorm:"column:type" json:"type"`
    UserName   string    `gorm:"column:user_name" json:"user_name"`
    AssignedTo string    `gorm:"column:assigned_to" json:"assigned_to"`
    CreatedAt  time.Time `gorm:"column:created_at" json:"created_at"`
}

func (LeadComment) TableName() string { return "lead_comments" }
