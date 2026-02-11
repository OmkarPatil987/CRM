package model

import "time"

type Lead struct {
    ID           int        `gorm:"primaryKey;autoIncrement" json:"id"`
    LeadUUID     string     `gorm:"column:lead_uuid" json:"lead_uuid"`
    Name         string     `gorm:"column:name" json:"name"`
    MobileNumber string     `gorm:"column:mobile_number" json:"mobile_number"`
    Email        string     `gorm:"column:email" json:"email"`
    EnquiryText  string     `gorm:"column:enquiry_text" json:"enquiry_text"`
    UniqueLeadID string     `gorm:"column:unique_lead_id" json:"unique_lead_id"`
    LeadStatus   string     `gorm:"column:lead_status" json:"lead_status"`
    Services     string     `gorm:"column:services" json:"services"`
    CreatedAt    time.Time  `gorm:"column:created_at" json:"created_at"`
    UpdatedAt    time.Time  `gorm:"column:updated_at" json:"updated_at"`
    DeletedAt    *time.Time `gorm:"column:deleted_at" json:"deleted_at"`
}

func (Lead) TableName() string { return "leads" }
