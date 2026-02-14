package main

import (
	"camp-backend/config"
	"camp-backend/model"
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	log.Println("Starting Chat Tables Migration (FK Checks Disabled)...")

	// Load env
	err := godotenv.Load(".env", "../../.env")
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	cfg := config.GetPrimaryMySQLDBConfig()
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.Database)

	// Connect with DisableForeignKeyConstraintWhenMigrating: true
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}

	// Debug User ID type
	var colType string
	db.Raw("SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id'").Scan(&colType)
	log.Printf("Existing 'users.id' type: %s", colType)

	// Auto Migrate
	err = db.AutoMigrate(
		&model.Conversation{},
		&model.ConversationParticipant{},
		&model.Message{},
	)

	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Migration completed successfully!")
}
