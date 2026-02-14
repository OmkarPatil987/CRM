package model

import (
	"time"
)

// Conversation represents a chat thread between users
type Conversation struct {
	ID        int       `gorm:"primaryKey;autoIncrement;type:int" json:"id"`
	Type      string    `gorm:"type:varchar(20);default:'one_to_one'" json:"type"` // e.g., 'one_to_one', 'group'
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relationships
	Participants []ConversationParticipant `gorm:"foreignKey:ConversationID" json:"participants,omitempty"`
	Messages     []Message                 `gorm:"foreignKey:ConversationID" json:"messages,omitempty"`
}

// ConversationParticipant links a user to a conversation
type ConversationParticipant struct {
	ID             int       `gorm:"primaryKey;autoIncrement;type:int" json:"id"`
	ConversationID int       `gorm:"not null;index;type:int" json:"conversation_id"`
	UserID         int       `gorm:"not null;index;type:int" json:"user_id"`
	JoinedAt       time.Time `json:"joined_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// Message represents a single chat message
type Message struct {
	ID             int       `gorm:"primaryKey;autoIncrement;type:int" json:"id"`
	ConversationID int       `gorm:"not null;index;type:int" json:"conversation_id"`
	SenderID       int       `gorm:"not null;index;type:int" json:"sender_id"`
	Content        string    `gorm:"type:text" json:"content"`
	Type           string    `gorm:"type:varchar(20);default:'text'" json:"type"` // text, image, file
	IsRead         bool      `gorm:"default:false" json:"is_read"`
	CreatedAt      time.Time `json:"created_at"`

	// Relationships
	Sender User `gorm:"foreignKey:SenderID" json:"sender,omitempty"`
}

// Note: To make GORM happy, we might need to add TableName methods if we want specific table names
func (Conversation) TableName() string            { return "conversations" }
func (ConversationParticipant) TableName() string { return "conversation_participants" }
func (Message) TableName() string                 { return "messages" }
