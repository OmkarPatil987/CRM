package repository

import (
	"camp-backend/database"
	"camp-backend/model"
	"time"

	"gorm.io/gorm"
)

type ChatRepository interface {
	CreateConversation(userOneID, userTwoID int) (*model.Conversation, error)
	FindConversation(userOneID, userTwoID int) (*model.Conversation, error)
	GetConversations(userID int) ([]model.Conversation, error)
	CreateMessage(msg *model.Message) error
	GetMessages(conversationID int, limit, offset int) ([]model.Message, error)
}

type chatRepo struct{}

func NewChatRepository() ChatRepository { return &chatRepo{} }

func (r *chatRepo) CreateConversation(userOneID, userTwoID int) (*model.Conversation, error) {
	// Start transaction
	tx := database.DB.Begin()

	conv := &model.Conversation{Type: "one_to_one"}
	if err := tx.Create(conv).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	participants := []model.ConversationParticipant{
		{ConversationID: conv.ID, UserID: userOneID, JoinedAt: time.Now()},
		{ConversationID: conv.ID, UserID: userTwoID, JoinedAt: time.Now()},
	}
	if err := tx.Create(&participants).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()

	// Reload the conversation with participants and user details
	var fullConv model.Conversation
	err := database.DB.Preload("Participants.User").First(&fullConv, conv.ID).Error
	if err != nil {
		return nil, err
	}

	return &fullConv, nil
}

func (r *chatRepo) FindConversation(userOneID, userTwoID int) (*model.Conversation, error) {
	// Complex query: Find a conversation where BOTH users are participants
	// SELECT c.* FROM conversations c
	// JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
	// JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ?
	// WHERE c.type = 'one_to_one'

	var conv model.Conversation
	err := database.DB.Table("conversations").
		Joins("JOIN conversation_participants cp1 ON conversations.id = cp1.conversation_id").
		Joins("JOIN conversation_participants cp2 ON conversations.id = cp2.conversation_id").
		Where("cp1.user_id = ? AND cp2.user_id = ? AND conversations.type = 'one_to_one'", userOneID, userTwoID).
		First(&conv).Error

	if err != nil {
		return nil, err
	}

	// Reload with details
	var fullConv model.Conversation
	err = database.DB.Preload("Participants.User").First(&fullConv, conv.ID).Error
	if err != nil {
		return nil, err
	}

	return &fullConv, nil
}

func (r *chatRepo) GetConversations(userID int) ([]model.Conversation, error) {
	// Get all conversations for a user, preload last message and other participants
	var convs []model.Conversation

	// Subquery to get conversations for user
	err := database.DB.Table("conversations").
		Joins("JOIN conversation_participants cp ON conversations.id = cp.conversation_id").
		Where("cp.user_id = ?", userID).
		Preload("Participants.User"). // Load other participants to show names
		Preload("Messages", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC").Limit(1)
		}).
		Find(&convs).Error

	return convs, err
}

func (r *chatRepo) CreateMessage(msg *model.Message) error {
	return database.DB.Create(msg).Error
}

func (r *chatRepo) GetMessages(conversationID int, limit, offset int) ([]model.Message, error) {
	var msgs []model.Message
	err := database.DB.Where("conversation_id = ?", conversationID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&msgs).Error
	return msgs, err
}
