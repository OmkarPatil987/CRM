package main

import (
	"camp-backend/app"
	"camp-backend/config"
	"camp-backend/database"
	"camp-backend/route"
	"camp-backend/util"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	log.Println("Server restarting...")
	// Load env from current folder (for local runs) and parent folder (repo root) so credentials are picked up
	_ = godotenv.Load(".env", "../.env")

	util.InitializeLogger()

	if err := database.InitDB(config.GetPrimaryMySQLDBConfig()); err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}

	a := app.InitApp()

	// Start the WebSocket Hub
	go a.Hub.Run()

	r := route.SetupRouter(a.Controllers)
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
