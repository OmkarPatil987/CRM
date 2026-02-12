package controller

import (
	"camp-backend/dto"
	"camp-backend/service"
	"camp-backend/util"
	"encoding/json"
	"strconv"

	"github.com/gin-gonic/gin"
)

type LeadController interface {
	Create(c *gin.Context)
	List(c *gin.Context)
	Details(c *gin.Context)
	AddFollowUp(c *gin.Context)
	ListFollowUps(c *gin.Context)
	AddComment(c *gin.Context)
	ListComments(c *gin.Context)
	ListActivities(c *gin.Context)
}

type leadController struct{ svc service.LeadService }

func NewLeadController(svc service.LeadService) LeadController {
	return &leadController{svc: svc}
}

func getAuthUserID(c *gin.Context) int {
	idStr := c.GetHeader("auth_user_id")
	id, _ := strconv.Atoi(idStr)
	return id
}

func getAuthUserName(c *gin.Context) string {
	return c.GetHeader("auth_user_name")
}

func (l *leadController) Create(c *gin.Context) {
	var req dto.LeadCreateRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, err := l.svc.Create(req, getAuthUserID(c))
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Lead created", data)
}

func (l *leadController) List(c *gin.Context) {
	var req dto.LeadListRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, total, filtered, err := l.svc.List(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Lead list", map[string]interface{}{
		"data":        data,
		"filterCount": filtered,
		"totalCount":  total,
	})
}

func (l *leadController) Details(c *gin.Context) {
	var req dto.LeadDetailsRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, err := l.svc.Details(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Lead details", data)
}

func (l *leadController) AddFollowUp(c *gin.Context) {
	var req dto.LeadFollowUpCreateRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	if err := l.svc.AddFollowUp(req, getAuthUserID(c), getAuthUserName(c)); err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Follow-up created", nil)
}

func (l *leadController) ListFollowUps(c *gin.Context) {
	var req dto.LeadFollowUpListRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, total, filtered, err := l.svc.ListFollowUps(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Follow-up list", map[string]interface{}{
		"data":        data,
		"filterCount": filtered,
		"totalCount":  total,
	})
}

func (l *leadController) AddComment(c *gin.Context) {
	var req dto.LeadCommentCreateRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	if err := l.svc.AddComment(req, getAuthUserID(c), getAuthUserName(c)); err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Comment created", nil)
}

func (l *leadController) ListComments(c *gin.Context) {
	var req dto.LeadCommentListRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, total, filtered, err := l.svc.ListComments(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Comment list", map[string]interface{}{
		"data":          data,
		"filteredCount": filtered,
		"totalCount":    total,
	})
}

func (l *leadController) ListActivities(c *gin.Context) {
	var req dto.LeadActivityListRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, total, filtered, err := l.svc.ListActivities(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Activity list", map[string]interface{}{
		"data":          data,
		"filteredCount": filtered,
		"totalCount":    total,
	})
}
