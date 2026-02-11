package controller

import (
	"camp-backend/dto"
	"camp-backend/service"
	"camp-backend/util"
	"encoding/json"

	"github.com/gin-gonic/gin"
)

type ContactController interface {
	Create(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	Details(c *gin.Context)
	List(c *gin.Context)
}

type contactController struct{ svc service.ContactService }

func NewContactController(svc service.ContactService) ContactController {
	return &contactController{svc: svc}
}

func (cc *contactController) Create(c *gin.Context) {
	var req dto.ContactCreateRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, err := cc.svc.Create(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Contact created", data)
}

func (cc *contactController) Update(c *gin.Context) {
	var req dto.ContactUpdateRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	if err := cc.svc.Update(req); err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Contact updated", nil)
}

func (cc *contactController) Delete(c *gin.Context) {
	var req dto.ContactDeleteRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	if err := cc.svc.Delete(req); err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Contact deleted", nil)
}

func (cc *contactController) Details(c *gin.Context) {
	var req dto.ContactDetailsRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, err := cc.svc.Details(req.ID)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Contact details", data)
}

func (cc *contactController) List(c *gin.Context) {
	var req dto.ContactListRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}
	if err := util.ValidateStruct(req); err != nil {
		util.ValidationResponse(c, err.Error())
		return
	}
	data, total, filtered, err := cc.svc.List(req)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Contact list", map[string]interface{}{
		"data":        data,
		"filterCount": filtered,
		"totalCount":  total,
	})
}
