import React from 'react';
import { Message } from '../../context/ChatContext';

interface Props {
    message: Message;
    isOwn: boolean;
}

export const MessageBubble: React.FC<Props> = ({ message, isOwn }) => {
    return (
        <div className={`flex w-full mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] p-3 rounded-lg text-sm ${isOwn
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
            >
                <div>{message.content}</div>
                <div className={`text-[10px] mt-1 text-right ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};
