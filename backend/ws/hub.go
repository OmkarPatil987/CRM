package ws

import (
	"encoding/json"
)

// HubMessage is the internal message format passed around the hub
type HubMessage struct {
	SenderID       int    `json:"sender_id"`
	RecipientID    int    `json:"recipient_id"`
	Content        string `json:"content"`
	Type           string `json:"type"` // "message", "typing"
	ConversationID int    `json:"conversation_id"`

	// Add timestamp for the frontend
	CreatedAt string `json:"created_at"`
}

type Hub struct {
	// Registered clients.
	// Map UserID -> List of Clients (allow multiple devices)
	clients map[int][]*Client

	// Inbound messages from the clients.
	Broadcast chan *HubMessage

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	Unregister chan *Client

	// Store function to persist messages, injected from Service
	SaveMessageFunc func(senderID, recipientID, conversationID int, content, msgType string) error
}

func NewHub(saveFunc func(senderID, recipientID, conversationID int, content, msgType string) error) *Hub {
	return &Hub{
		Broadcast:       make(chan *HubMessage),
		Register:        make(chan *Client),
		Unregister:      make(chan *Client),
		clients:         make(map[int][]*Client),
		SaveMessageFunc: saveFunc,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.clients[client.UserID] = append(h.clients[client.UserID], client)

			// Optional: Notify user is online?

		case client := <-h.Unregister:
			if clients, ok := h.clients[client.UserID]; ok {
				for i, c := range clients {
					if c == client {
						// Remove this specific connection
						h.clients[client.UserID] = append(clients[:i], clients[i+1:]...)
						break
					}
				}
				if len(h.clients[client.UserID]) == 0 {
					delete(h.clients, client.UserID)
				}
			}
			close(client.Send)

		case message := <-h.Broadcast:
			// 1. Save to DB (if it's a chat message)
			if message.Type == "message" && h.SaveMessageFunc != nil {
				// We do this asynchronously or synchronously?
				// For reliability, better synchronously here or fire-and-forget but log errors.
				go h.SaveMessageFunc(message.SenderID, message.RecipientID, message.ConversationID, message.Content, "text")
			}

			// 2. Send to Recipient
			// If recipient is online, send to all their connections
			if recipients, ok := h.clients[message.RecipientID]; ok {
				msgBytes, _ := json.Marshal(message)
				for _, client := range recipients {
					select {
					case client.Send <- msgBytes:
					default:
						close(client.Send)
						// clean up logic would happen in unregister usually
					}
				}
			}

			// 3. Send back to Sender (for confirmation/multi-device sync)
			if senders, ok := h.clients[message.SenderID]; ok {
				msgBytes, _ := json.Marshal(message)
				for _, client := range senders {
					select {
					case client.Send <- msgBytes:
					default:
						close(client.Send)
					}
				}
			}
		}
	}
}
