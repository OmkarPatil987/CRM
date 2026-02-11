package controller

import (
    "camp-backend/dto"
    "camp-backend/service"
    "camp-backend/util"
    "encoding/json"

    "github.com/gin-gonic/gin"
)

type UserController interface {
    Register(c *gin.Context)
    Login(c *gin.Context)
    List(c *gin.Context)
    Details(c *gin.Context)
    Update(c *gin.Context)
}

type userController struct { svc service.UserService }

func NewUserController(svc service.UserService) UserController {
    return &userController{svc: svc}
}

func (u *userController) Register(c *gin.Context) {
    var req dto.UserRegistrationRequest
    if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
        util.ValidationResponse(c, "Invalid payload")
        return
    }
    if err := util.ValidateStruct(req); err != nil {
        util.ValidationResponse(c, err.Error())
        return
    }
    if _, err := u.svc.Register(req); err != nil {
        util.InternalServerErrorWithMessage(c, err.Error())
        return
    }
    util.SuccessResponse(c, "User registered", nil)
}

func (u *userController) Login(c *gin.Context) {
    var req dto.UserLoginRequest
    if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
        util.ValidationResponse(c, "Invalid payload")
        return
    }
    if err := util.ValidateStruct(req); err != nil {
        util.ValidationResponse(c, err.Error())
        return
    }
    user, token, err := u.svc.Login(req.Username, req.Password)
    if err != nil {
        util.UnauthorizedResponse(c, err.Error())
        return
    }
    util.SuccessResponse(c, "Login successful", map[string]interface{}{
        "token": token,
        "user":  user,
    })
}

func (u *userController) List(c *gin.Context) {
    var req dto.UserListRequest
    if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
        util.ValidationResponse(c, "Invalid payload")
        return
    }
    if err := util.ValidateStruct(req); err != nil {
        util.ValidationResponse(c, err.Error())
        return
    }
    data, total, filtered, err := u.svc.List(req)
    if err != nil {
        util.InternalServerErrorWithMessage(c, err.Error())
        return
    }
    util.SuccessResponse(c, "User list", map[string]interface{}{
        "data":          data,
        "total_count":   total,
        "filter_count":  filtered,
    })
}

func (u *userController) Details(c *gin.Context) {
    var req dto.UserDetailsRequest
    if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
        util.ValidationResponse(c, "Invalid payload")
        return
    }
    if err := util.ValidateStruct(req); err != nil {
        util.ValidationResponse(c, err.Error())
        return
    }
    data, err := u.svc.Details(req.ID)
    if err != nil {
        util.InternalServerErrorWithMessage(c, err.Error())
        return
    }
    util.SuccessResponse(c, "User details", data)
}

func (u *userController) Update(c *gin.Context) {
    var req dto.UserUpdateRequest
    if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
        util.ValidationResponse(c, "Invalid payload")
        return
    }
    if err := util.ValidateStruct(req); err != nil {
        util.ValidationResponse(c, err.Error())
        return
    }
    if err := u.svc.Update(req); err != nil {
        util.InternalServerErrorWithMessage(c, err.Error())
        return
    }
    util.SuccessResponse(c, "User updated", nil)
}
