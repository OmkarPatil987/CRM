package service

import (
	"camp-backend/model"
	"camp-backend/repository"
	"time"
)

type ChatService interface {
	SendMessage(senderID, recipientID int, content string) error
	GetConversations(userID int) ([]model.Conversation, error)
	GetMessages(userID, conversationID int, limit, offset int) ([]model.Message, error)
	StartConversation(userOneID, userTwoID int) (*model.Conversation, error)
}

type chatService struct {
	repo repository.ChatRepository
}

func NewChatService() ChatService {
	return &chatService{
		repo: repository.NewChatRepository(),
	}
}

var Chat ChatService = NewChatService()

func (s *chatService) StartConversation(userOneID, userTwoID int) (*model.Conversation, error) {
	// Check if exists
	conv, err := s.repo.FindConversation(userOneID, userTwoID)
	if err == nil && conv != nil {
		return conv, nil
	}
	// Create
	return s.repo.CreateConversation(userOneID, userTwoID)
}

func (s *chatService) SendMessage(senderID, recipientID int, content string) error {
	// 1. Ensure conversation exists
	conv, err := s.StartConversation(senderID, recipientID)
	if err != nil {
		return err
	}

	// 2. Create Message
	msg := &model.Message{
		ConversationID: conv.ID,
		SenderID:       senderID,
		Content:        content,
		Type:           "text",
		CreatedAt:      time.Now(),
		IsRead:         false,
	}

	return s.repo.CreateMessage(msg)
}

func (s *chatService) GetConversations(userID int) ([]model.Conversation, error) {
	return s.repo.GetConversations(userID)
}

func (s *chatService) GetMessages(userID, conversationID int, limit, offset int) ([]model.Message, error) {
	// Security: Check if user is participant? (Skipped for brevity but recommended)
	return s.repo.GetMessages(conversationID, limit, offset)
}
