package controller

import (
	"camp-backend/dto"
	"camp-backend/service"
	"camp-backend/util"

	"github.com/gin-gonic/gin"
)

type DealController interface {
	Create(context *gin.Context)
	Update(context *gin.Context)
	Delete(context *gin.Context)
	Details(context *gin.Context)
	List(context *gin.Context)
	UpdateStage(context *gin.Context)
}

type dealController struct{ service service.DealService }

func NewDealController() DealController {
	return &dealController{service: service.Deal}
}

func (c *dealController) Create(context *gin.Context) {
	var req dto.DealCreateRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	deal, err := c.service.Create(req)
	if err != nil {
		util.InternalServerErrorWithMessage(context, err.Error())
		return
	}

	util.SuccessResponse(context, "deal created successfully", deal)
}

func (c *dealController) Update(context *gin.Context) {
	var req dto.DealUpdateRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	err := c.service.Update(req)
	if err != nil {
		util.InternalServerErrorWithMessage(context, err.Error())
		return
	}

	util.SuccessResponse(context, "deal updated successfully", nil)
}

func (c *dealController) Delete(context *gin.Context) {
	var req struct {
		ID int `json:"id"`
	}
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	err := c.service.Delete(req.ID)
	if err != nil {
		util.InternalServerErrorWithMessage(context, err.Error())
		return
	}

	util.SuccessResponse(context, "deal deleted successfully", nil)
}

func (c *dealController) Details(context *gin.Context) {
	var req struct {
		ID int `json:"id"`
	}
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	deal, err := c.service.Details(req.ID)
	if err != nil {
		util.InternalServerErrorWithMessage(context, err.Error())
		return
	}

	util.SuccessResponse(context, "deal details fetched successfully", deal)
}

func (c *dealController) List(context *gin.Context) {
	var req dto.DealListRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	deals, total, filtered, err := c.service.List(req)
	if err != nil {
		util.InternalServerErrorWithMessage(context, err.Error())
		return
	}

	util.SuccessResponse(context, "deals fetched successfully", map[string]interface{}{
		"data":        deals,
		"totalCount":  total,
		"filterCount": filtered,
	})
}

func (c *dealController) UpdateStage(context *gin.Context) {
	var req struct {
		ID    int    `json:"id"`
		Stage string `json:"stage"`
	}
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	err := c.service.UpdateStage(req.ID, req.Stage)
	if err != nil {
		util.InternalServerErrorWithMessage(context, err.Error())
		return
	}

	util.SuccessResponse(context, "deal stage updated successfully", nil)
}
