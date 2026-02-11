package util

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type ResponseBody struct {
    Message    string      `json:"message"`
    StatusCode int         `json:"Status_code"`
    DevMessage string      `json:"dev_message,omitempty"`
    Body       interface{} `json:"body,omitempty"`
}

func SuccessResponse(c *gin.Context, message string, body interface{}) {
    c.JSON(http.StatusOK, ResponseBody{Message: message, StatusCode: http.StatusOK, Body: body})
}

func ValidationResponse(c *gin.Context, message string) {
    c.JSON(http.StatusUnprocessableEntity, ResponseBody{Message: message, StatusCode: http.StatusUnprocessableEntity})
}

func InternalServerErrorWithMessage(c *gin.Context, message string) {
    c.JSON(http.StatusInternalServerError, ResponseBody{Message: "Internal Server Error", StatusCode: http.StatusInternalServerError, DevMessage: message})
}

func UnauthorizedResponse(c *gin.Context, message string) {
    c.JSON(http.StatusUnauthorized, ResponseBody{Message: message, StatusCode: http.StatusUnauthorized})
}
