package model

import "time"

type User struct {
    ID        int        `gorm:"primaryKey;autoIncrement" json:"id"`
    UUID      string     `gorm:"column:uuid" json:"uuid"`
    Name      string     `gorm:"column:name" json:"name"`
    Email     string     `gorm:"column:email" json:"email"`
    Mobile    string     `gorm:"column:mobile" json:"mobile"`
    Password  string     `gorm:"column:password" json:"-"`
    UserType  string     `gorm:"column:user_type" json:"user_type"`
    IsActive  bool       `gorm:"column:is_active" json:"is_active"`
    CreatedAt time.Time  `gorm:"column:created_at" json:"created_at"`
    UpdatedAt time.Time  `gorm:"column:updated_at" json:"updated_at"`
    DeletedAt *time.Time `gorm:"column:deleted_at" json:"deleted_at"`
}

func (User) TableName() string { return "users" }
