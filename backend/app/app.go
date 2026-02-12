package app

import (
	"camp-backend/controller"
	"camp-backend/service"
)

type Controllers struct {
	User     controller.UserController
	Lead     controller.LeadController
	Contact  controller.ContactController
	Deal     controller.DealController
	Activity controller.ActivityController
}

type App struct {
	Controllers *Controllers
}

func InitApp() *App {
	return &App{
		Controllers: &Controllers{
			User:     controller.NewUserController(service.User),
			Lead:     controller.NewLeadController(service.Lead),
			Contact:  controller.NewContactController(service.Contact),
			Deal:     controller.NewDealController(),
			Activity: controller.NewActivityController(),
		},
	}
}
