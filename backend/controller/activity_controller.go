package controller

import (
	"camp-backend/dto"
	"camp-backend/service"
	"camp-backend/util"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ActivityController interface {
	Create(context *gin.Context)
	Update(context *gin.Context)
	Delete(context *gin.Context)
	List(context *gin.Context)
}

type activityController struct{ service service.ActivityService }

func NewActivityController() ActivityController {
	return &activityController{service: service.Activity}
}

func (c *activityController) Create(context *gin.Context) {
	var req dto.ActivityCreateRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	activity, err := c.service.Create(req)
	if err != nil {
		util.ErrorResponse(context, err.Error(), nil)
		return
	}

	util.SuccessResponse(context, "activity created successfully", activity)
}

func (c *activityController) Update(context *gin.Context) {
	var req dto.ActivityUpdateRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(context, "invalid request")
		return
	}

	// If ID is passed in URL, use it
	idStr := context.Param("id")
	if idStr != "" {
		if id, err := strconv.Atoi(idStr); err == nil {
			req.ID = id
		}
	}

	err := c.service.Update(req)
	if err != nil {
		util.ErrorResponse(context, err.Error(), nil)
		return
	}

	util.SuccessResponse(context, "activity updated successfully", nil)
}

func (c *activityController) Delete(context *gin.Context) {
	idStr := context.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.ValidationResponse(context, "invalid id")
		return
	}

	err = c.service.Delete(id)
	if err != nil {
		util.ErrorResponse(context, err.Error(), nil)
		return
	}

	util.SuccessResponse(context, "activity deleted successfully", nil)
}

func (c *activityController) List(context *gin.Context) {
	var req dto.ActivityListRequest
	if err := context.ShouldBindQuery(&req); err != nil {
		util.ValidationResponse(context, "invalid query params")
		return
	}

	activities, total, filtered, err := c.service.List(req)
	if err != nil {
		util.ErrorResponse(context, err.Error(), nil)
		return
	}

	util.SuccessResponse(context, "activities fetched successfully", map[string]interface{}{
		"data":        activities,
		"totalCount":  total,
		"filterCount": filtered,
	})
}
