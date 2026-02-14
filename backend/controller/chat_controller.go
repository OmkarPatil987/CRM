package controller

import (
	"camp-backend/service"
	"camp-backend/util"
	"camp-backend/ws"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ChatController struct {
	svc service.ChatService
	hub *ws.Hub
}

func NewChatController(svc service.ChatService, hub *ws.Hub) *ChatController {
	return &ChatController{
		svc: svc,
		hub: hub,
	}
}

// ServeWs handles websocket requests from the peer.
func (cc *ChatController) ServeWs(c *gin.Context) {
	// 1. Authenticate via Query Param (standard for WS)
	tokenStr := c.Query("token")
	if tokenStr == "" {
		http.Error(c.Writer, "Missing token", http.StatusUnauthorized)
		return
	}

	// Validate token
	_, claims, err := util.ValidateToken(tokenStr)
	if err != nil {
		http.Error(c.Writer, "Invalid token", http.StatusUnauthorized)
		return
	}

	// 2. Upgrade HTTP connection to WebSocket
	conn, err := ws.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	// 3. Register Client
	client := &ws.Client{
		Hub:    cc.hub,
		Conn:   conn,
		Send:   make(chan []byte, 256), // Buffer size for outbound
		UserID: claims.UserID,
	}

	client.Hub.Register <- client

	// 4. Start Pumps (Blocking)
	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.WritePump()
	go client.ReadPump()
}

func (cc *ChatController) GetConversations(c *gin.Context) {
	userID := getAuthUserID(c) // Helper from other controllers
	convs, err := cc.svc.GetConversations(userID)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "Conversations retrieved", convs)
}

func (cc *ChatController) GetHistory(c *gin.Context) {
	userID := getAuthUserID(c)
	convIDStr := c.Query("conversation_id")
	convID, _ := strconv.Atoi(convIDStr)

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	msgs, err := cc.svc.GetMessages(userID, convID, limit, offset)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}
	util.SuccessResponse(c, "History retrieved", msgs)
}

func (cc *ChatController) StartConversation(c *gin.Context) {
	userID := getAuthUserID(c)
	var req struct {
		RecipientID int `json:"recipient_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(c, "Invalid payload")
		return
	}

	conv, err := cc.svc.StartConversation(userID, req.RecipientID)
	if err != nil {
		util.InternalServerErrorWithMessage(c, err.Error())
		return
	}

	util.SuccessResponse(c, "Conversation started", conv)
}
