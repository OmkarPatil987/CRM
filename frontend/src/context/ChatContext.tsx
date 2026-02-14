import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BaseUrls } from '../utils/base-urls';
import store from '../redux/store';

// Types
export interface Message {
    id?: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    type: 'text' | 'image' | 'file';
    created_at: string;
    is_read?: boolean;
    tempId?: string; // For optimistic updates
}

export interface Conversation {
    id: number;
    participants: {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }[];
    last_message?: Message;
    unread_count?: number;
}

interface ChatContextType {
    conversations: Conversation[];
    activeConversationId: number | null;
    messages: Message[];
    isConnected: boolean;
    setActiveConversationId: (id: number | null) => void;
    sendMessage: (content: string, recipientId: number) => void;
    loadHistory: (conversationId: number) => void;
    loadConversations: () => void;
    startChat: (recipientId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    // Auth token mechanism
    const state = store.getState();
    const token = state.authUser?.token;
    const baseURL = BaseUrls.CMRF_NGO_ADMIN_SERVER.url?.replace(/\/$/, '');

    // Connect WebSocket
    useEffect(() => {
        if (!token || !baseURL) return;

        // Convert http/https to ws/wss
        const wsProtocol = baseURL.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = baseURL.replace(/^https?/, wsProtocol) + '/ws?token=' + token;

        const connect = () => {
            console.log('Connecting to WS:', wsUrl);
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log('Chat Connected');
                setIsConnected(true);
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleIncomingMessage(data);
                } catch (e) {
                    console.error('WS Parse Error', e);
                }
            };

            ws.current.onclose = () => {
                console.log('Chat Disconnected');
                setIsConnected(false);
                // Reconnect logic (simple)
                // setTimeout(connect, 5000); 
            };
        };

        connect();

        return () => {
            ws.current?.close();
        };
    }, [token, baseURL]);

    const handleIncomingMessage = (data: any) => {
        if (data.type === 'message') {
            const newMessage: Message = {
                id: Date.now(), // Temp ID if missing
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                content: data.content,
                type: 'text',
                created_at: data.created_at || new Date().toISOString(),
            };

            setMessages((prev) => {
                // Deduplicate based on ID from backend
                if (prev.some(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
            });

            // Update conversation list (last message)
            setConversations((prev) => {
                return prev.map(c => {
                    if (c.id === data.conversation_id) {
                        return { ...c, last_message: newMessage };
                    }
                    return c;
                });
            });
        }
    };

    const sendMessage = (content: string, recipientId: number) => {
        const state = store.getState();
        const currentUserId = state.authUser?.userDetails?.id;

        console.log("sendMessage called. WS:", !!ws.current, "Connected:", isConnected, "ActiveConv:", activeConversationId, "User:", currentUserId);

        if (!ws.current || !isConnected || !activeConversationId || !currentUserId) {
            console.error("sendMessage failed: Missing requirements");
            return;
        }

        const payload = {
            type: 'message',
            content,
            recipient_id: recipientId,
            conversation_id: activeConversationId
        };

        ws.current.send(JSON.stringify(payload));
    };

    const loadConversations = async () => {
        if (!baseURL) return;
        try {
            const res = await fetch(`${baseURL}/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            // Backend returns { Status_code: 200, body: [...] }
            if (data.body) setConversations(data.body);
        } catch (e) {
            console.error(e);
        }
    };

    const loadHistory = async (conversationId: number) => {
        if (!baseURL) return;
        try {
            const res = await fetch(`${baseURL}/chat/history?conversation_id=${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            // Backend returns { Status_code: 200, body: [...] }
            if (data.body) setMessages(data.body.reverse());
        } catch (e) {
            console.error(e);
        }
    };

    const startChat = async (recipientId: number) => {
        if (!baseURL || !token) return;
        try {
            const res = await fetch(`${baseURL}/chat/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ recipient_id: recipientId })
            });
            const data = await res.json();
            console.log("startChat response:", data);

            if (data.Status_code === 200 && data.body) {
                const newConv = data.body;
                console.log("New conversation data:", newConv);

                // Robustness: Add to state immediately so it's found when we set active
                setConversations(prev => {
                    const exists = prev.find(c => c.id === newConv.id);
                    if (exists) return prev;
                    // Sort order might matter, but prepending is usually fine for "newest"
                    return [newConv, ...prev];
                });

                // Then set active
                setActiveConversationId(newConv.id);

                // Background refresh ensures we have latest data/ordering from server
                loadConversations();
            } else {
                console.error("Failed to start chat, invalid response:", data);
            }
        } catch (e) {
            console.error("Failed to start chat", e);
        }
    };

    // Initial load
    useEffect(() => {
        if (token) loadConversations();
    }, [token]);

    return (
        <ChatContext.Provider value={{
            conversations,
            activeConversationId,
            messages,
            isConnected,
            setActiveConversationId,
            sendMessage,
            loadHistory,
            loadConversations,
            startChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};
