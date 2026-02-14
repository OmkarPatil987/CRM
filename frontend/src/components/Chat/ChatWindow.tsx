import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageBubble } from './MessageBubble';
import store from '../../redux/store';
import { UserSearch } from './UserSearch';
import { groupMessagesByDate, formatDateLabel } from '../../utils/dateUtils';
import { DateSeparator } from './DateSeparator';
import { StickyDateHeader } from './StickyDateHeader';

export const ChatWindow: React.FC = () => {
    const {
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        loadHistory,
        isConnected
    } = useChat();

    const [inputValue, setInputValue] = useState('');
    const [showUserSearch, setShowUserSearch] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [currentDateLabel, setCurrentDateLabel] = useState('Today');

    // Get current user ID from store
    const currentUserId = store.getState().authUser?.userDetails?.id;

    // Group messages
    const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

    // Scroll to bottom on new message if near bottom or first load
    useEffect(() => {
        // Simple scroll to bottom for now
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Load history when switching conversation
    useEffect(() => {
        if (activeConversationId) {
            loadHistory(activeConversationId);
        }
    }, [activeConversationId]);

    // Scroll listener to update sticky header
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const containerTop = scrollContainerRef.current.scrollTop;
        const containerHeight = scrollContainerRef.current.clientHeight;

        // Find the group currently in view
        // We iterate backwards/forwards to find the group whose top is closest to 0 but negative (scrolled past)
        // or just simple bounding client rect check

        // Strategy: Check which date separator is closest to top
        let visibleLabel = currentDateLabel;

        // Default to first group if at top
        if (containerTop < 50 && groupedMessages.length > 0) {
            // visibleLabel = groupedMessages[0].dateLabel; // Keep "Today" or whatever logic
        }

        for (const group of groupedMessages) {
            const el = dateRefs.current[group.dateLabel];
            if (el) {
                const rect = el.getBoundingClientRect();
                const containerRect = scrollContainerRef.current.getBoundingClientRect();

                // If the group's bottom is below the container's top, it's potentially the current one
                if (rect.top < containerRect.top + 100) {
                    visibleLabel = group.dateLabel;
                }
            }
        }

        if (visibleLabel !== currentDateLabel) {
            setCurrentDateLabel(visibleLabel);
        }
    };

    const handleJumpTo = (action: 'yesterday' | 'beginning' | 'specific', date?: Date) => {
        if (action === 'beginning') {
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'yesterday') {
            const el = dateRefs.current['Yesterday'];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else console.warn("Yesterday not found in loaded messages");
        } else if (action === 'specific' && date) {
            // Find label for this date
            // This relies on exact string match which might be tricky with "Thursday, ..." format
            // Re-use logic to format label logic? 
            // Better: find group where dateObj matches
            const targetGroup = groupedMessages.find(g =>
                g.dateObj.toDateString() === date.toDateString()
            );

            if (targetGroup) {
                const el = dateRefs.current[targetGroup.dateLabel];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                alert("Date not found in currently loaded history.");
            }
        }
    };

    const handleSend = () => {
        console.log("handleSend triggered. Input:", inputValue, "ActiveConv:", activeConversationId);
        if (!inputValue.trim() || !activeConversationId) {
            console.warn("Send aborted: Empty input or no active conversation");
            return;
        }

        // Find recipient from conversation participants
        const conversation = conversations.find(c => c.id === activeConversationId);
        if (!conversation) {
            console.error("Send aborted: Conversation not found in list");
            return;
        }

        const recipient = conversation.participants.find(p => p.user.id !== currentUserId);
        if (!recipient) {
            console.error("Send aborted: Recipient not found", conversation.participants, currentUserId);
            return;
        }

        console.log("Sending message to recipient:", recipient.user.id);
        sendMessage(inputValue, recipient.user.id);
        setInputValue('');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {/* Sidebar: Conversation List */}
            <div className="w-1/4 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-700">Messages</h2>
                        <div className={`text-xs mt-1 ${isConnected ? 'text-green-600' : 'text-orange-500'}`}>
                            {isConnected ? '● Online' : '○ Connecting...'}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUserSearch(true)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        title="New Chat"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => {
                        const otherUser = conv.participants.find(p => p.user.id !== currentUserId)?.user;
                        return (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConversationId(conv.id)}
                                className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${activeConversationId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                    }`}
                            >
                                <div className="font-medium text-gray-800">{otherUser?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500 truncate mt-1">
                                    {conv.last_message?.content || 'No messages yet'}
                                </div>
                            </div>
                        );
                    })}
                    {conversations.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">No conversations found.</div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50 relative"> {/* Relative for sticky header */}
                {activeConversationId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm z-20 relative">
                            <div className="font-semibold text-gray-800">
                                {(() => {
                                    const conv = conversations.find(c => c.id === activeConversationId);
                                    const otherUser = conv?.participants.find(p => p.user.id !== currentUserId)?.user;
                                    return otherUser?.name || 'Chat';
                                })()}
                            </div>
                        </div>

                        {/* Sticky Date Chip */}
                        <StickyDateHeader label={currentDateLabel} onJumpTo={handleJumpTo} />

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-2 relative"
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                        >
                            {/* Render Grouped Messages */}
                            {groupedMessages.map((group) => (
                                <div key={group.dateLabel} ref={el => dateRefs.current[group.dateLabel] = el}>
                                    <DateSeparator label={group.dateLabel} />
                                    {group.messages.map((msg) => (
                                        <MessageBubble
                                            key={msg.id || msg.tempId || Math.random()}
                                            message={msg}
                                            isOwn={msg.sender_id === currentUserId}
                                        />
                                    ))}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-200 z-20 relative">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-colors shadow-sm"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            {showUserSearch && <UserSearch onClose={() => setShowUserSearch(false)} />}
        </div>
    );
};
