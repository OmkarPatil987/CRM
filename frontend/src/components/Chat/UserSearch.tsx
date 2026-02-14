import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { FetchUserListService } from '../../utils/services/user.service';
import store from '../../redux/store';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserSearchProps {
    onClose: () => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onClose }) => {
    const { startChat } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Adjust payload as per your backend pagination/search requirements
            const payload = {
                page: 1,
                limit: 10,
                search: searchTerm
            };
            console.log("Fetching users with payload:", payload);
            const response = await FetchUserListService(payload);
            console.log("User search response:", response);

            if (response.code === 200 && response.data?.data) {
                console.log("Setting users:", response.data.data);
                setUsers(response.data.data);
            } else {
                console.warn("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (userId: number) => {
        startChat(userId);
        onClose();
    };

    const currentUserId = Number(store.getState().authUser?.userDetails?.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h3 className="font-semibold text-lg text-gray-800">New Chat</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold p-1">
                        ✕
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Loading...</div>
                    ) : users.length > 0 ? (
                        users
                            .filter(u => u.id !== currentUserId)
                            .map(user => {
                                console.log("Rendering user:", user.name);
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user.id)}
                                        className="p-3 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-gray-800 truncate">{user.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="text-center py-4 text-gray-500">No users found</div>
                    )}
                    {users.length > 0 && users.filter(u => u.id !== currentUserId).length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-sm">You are the only user.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
