package app

import (
	"camp-backend/controller"
	"camp-backend/service"
	"camp-backend/ws"
)

// Chat Routes
type Controllers struct {
	User      controller.UserController
	Lead      controller.LeadController
	Contact   controller.ContactController
	Deal      controller.DealController
	Activity  controller.ActivityController
	Dashboard controller.DashboardController
	Chat      *controller.ChatController
}

type App struct {
	Controllers *Controllers
	Hub         *ws.Hub
}

func InitApp() *App {
	// Initialize Hub with the global Chat service
	hub := ws.NewHub(func(senderID, recipientID, conversationID int, content, msgType string) error {
		return service.Chat.SendMessage(senderID, recipientID, content)
	})

	return &App{
		Hub: hub,
		Controllers: &Controllers{
			User:      controller.NewUserController(service.User),
			Lead:      controller.NewLeadController(service.Lead),
			Contact:   controller.NewContactController(service.Contact),
			Deal:      controller.NewDealController(),
			Activity:  controller.NewActivityController(),
			Dashboard: controller.NewDashboardController(),
			Chat:      controller.NewChatController(service.Chat, hub),
		},
	}
}
