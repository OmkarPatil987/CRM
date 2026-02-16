package database

import (
	"camp-backend/config"
	"camp-backend/model"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(cfg config.MySQLDatabaseConfig) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.Database)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto-migrate the Payment model
	log.Println("Migrating Payment model...")
	if err := db.AutoMigrate(&model.Payment{}); err != nil {
		return fmt.Errorf("failed to migrate payment model: %w", err)
	}

	DB = db
	return nil
}
