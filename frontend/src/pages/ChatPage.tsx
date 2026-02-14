import React from 'react';
import { ChatProvider } from '../context/ChatContext';
import { ChatWindow } from '../components/Chat/ChatWindow';

const ChatPage: React.FC = () => {
    return (
        <ChatProvider>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Messages</h1>
                <ChatWindow />
            </div>
        </ChatProvider>
    );
};

export default ChatPage;
