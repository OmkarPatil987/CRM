package controller

import (
	"camp-backend/dto"
	"camp-backend/service"
	"camp-backend/util"

	"github.com/gin-gonic/gin"
)

type DashboardController interface {
	GetStats(context *gin.Context)
}

type dashboardController struct {
	service service.DashboardService
}

func NewDashboardController() DashboardController {
	return &dashboardController{service: service.Dashboard}
}

func (c *dashboardController) GetStats(context *gin.Context) {
	var req dto.DashboardStatsParams
	if err := context.ShouldBindQuery(&req); err != nil {
		util.ValidationResponse(context, "invalid query params")
		return
	}

	stats, err := c.service.GetStats(req)
	if err != nil {
		util.ErrorResponse(context, err.Error(), nil)
		return
	}

	util.SuccessResponse(context, "dashboard stats fetched successfully", stats)
}
