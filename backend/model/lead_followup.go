package model

import "time"

type LeadFollowUp struct {
    ID               int       `gorm:"primaryKey;autoIncrement" json:"id"`
    UUID             string    `gorm:"column:uuid" json:"uuid"`
    Status           string    `gorm:"column:status" json:"status"`
    Remark           string    `gorm:"column:remark" json:"remark"`
    FollowUpDate     time.Time `gorm:"column:follow_up_date" json:"follow_up_date"`
    FollowUpTime     string    `gorm:"column:follow_up_time" json:"follow_up_time"`
    NextFollowUpDate *time.Time `gorm:"column:next_follow_up_date" json:"next_follow_up_date"`
    NextFollowUpTime string    `gorm:"column:next_follow_up_time" json:"next_follow_up_time"`
    LeadStatus       string    `gorm:"column:lead_status" json:"lead_status"`
    CustomerName     string    `gorm:"column:customer_name" json:"customer_name"`
    LeadUUID         string    `gorm:"column:lead_uuid" json:"lead_uuid"`
    LeadMobileNumber string    `gorm:"column:lead_mobile_number" json:"lead_mobile_number"`
    LeadUniqueID     string    `gorm:"column:lead_unique_id" json:"lead_unique_id"`
    CreatedAt        time.Time `gorm:"column:created_at" json:"created_at"`
    UpdatedAt        time.Time `gorm:"column:updated_at" json:"updated_at"`
    UpdatedBy        string    `gorm:"column:updated_by" json:"updated_by"`
}

func (LeadFollowUp) TableName() string { return "lead_followups" }
