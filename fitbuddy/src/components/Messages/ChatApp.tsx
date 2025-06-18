'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function ChatApp() {
    // --- State ---
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

    // --- Ref for messages container to scroll to bottom ---
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Fetch current user profile ---
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:3000/auth/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUserId(res.data.id);
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    // --- Fetch conversations ---
    const fetchConversations = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:3000/messages/conversations', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConversations(res.data);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    // --- Fetch messages for selected conversation ---
    const fetchMessages = async (recipientId: number) => {
        if (!currentUserId) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get(`http://localhost:3000/messages/${currentUserId}/${recipientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);

            // Mark as read
            await axios.post(
                'http://localhost:3000/messages/mark-as-read',
                { senderId: recipientId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            fetchUnreadCounts();
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    // --- Search trainers/users by name ---
    const searchUsers = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/users/trainers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Filter locally by name (can replace with server-side later)
            const filtered = res.data.filter((user: any) =>
                user.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    // --- Handle selecting a user from search or conversations ---
    const handleSelectUser = (userId: number) => {
        setSelectedUserId(userId);
        setSearchTerm('');
        setSearchResults([]);
    };

    // --- Send message handler ---
    const handleSend = async () => {
        if (!inputText.trim() || !currentUserId || !selectedUserId) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post(
                'http://localhost:3000/messages',
                {
                    senderId: currentUserId,
                    recipientId: selectedUserId,
                    content: inputText.trim(),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setInputText('');
            fetchMessages(selectedUserId);
            fetchConversations();
            fetchUnreadCounts();
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    // --- Scroll to bottom whenever messages change ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Fetch profile & conversations on mount ---
    useEffect(() => {
        fetchProfile();
        fetchConversations();
        fetchUnreadCounts();
    }, []);

    // --- Fetch messages when selected user changes ---
    useEffect(() => {
        if (selectedUserId) {
            fetchMessages(selectedUserId);
        }
    }, [selectedUserId, currentUserId]);

    // --- Search effect debounce ---
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm) {
                searchUsers(searchTerm);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // --- Sidebar avatar with initials fallback ---
    const renderSidebarAvatar = (user: any, size = 32) => {
        if (user.profilePicture) {
            return (
                <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="rounded-full object-cover"
                    style={{ width: size, height: size }}
                />
            );
        }
        // else show initials circle
        const initials = user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        return (
            <div
                className="rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold select-none"
                style={{ width: size, height: size }}
            >
                {initials}
            </div>
        );
    };

    // --- Chat message avatar: only show profile picture, no initials fallback ---
    const renderChatAvatar = (user: any, size = 24) => {
        if (!user.profilePicture) return null;
        return (
            <img
                src={user.profilePicture}
                alt={user.name}
                className="rounded-full object-cover"
                style={{ width: size, height: size }}
            />
        );
    };

    // --- Fetch unread message counts ---
    const fetchUnreadCounts = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get('http://localhost:3000/messages/unread-counts', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Convert to dictionary for easy lookup
            const counts: Record<number, number> = {};
            res.data.forEach((entry: { senderId: number; unreadCount: number }) => {
                counts[entry.senderId] = entry.unreadCount;
            });
            setUnreadCounts(counts);
        } catch (err) {
            console.error('Error fetching unread counts:', err);
        }
    };

    return (
        <div className="flex h-[85vh] border rounded-lg overflow-hidden shadow-lg">
            {/* ---------- Sidebar with Search + Conversations ---------- */}
            <div className="w-[30%] bg-gray-50 p-4 overflow-y-auto border-r flex flex-col">
                <h2 className="text-xl font-semibold mb-5 text-gray-800">Conversations</h2>

                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search users to chat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-5 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                {/* Show search results if searching */}
                {searchTerm ? (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
                        {isSearching && <p className="text-gray-600 italic">Searching...</p>}
                        {!isSearching && searchResults.length === 0 && (
                            <p className="text-gray-600 italic">No users found.</p>
                        )}
                        {!isSearching &&
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                                    onClick={() => handleSelectUser(user.id)}
                                >
                                    {renderSidebarAvatar(user)}
                                    <div className="text-gray-800 font-medium">{user.name}</div>
                                </div>
                            ))}
                    </div>
                ) : (
                    // Show conversations if not searching
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 && (
                            <p className="text-gray-600 italic">No conversations yet.</p>
                        )}
                        {conversations.map((conv) => {
                            const unread = unreadCounts[conv.user.id] || 0;

                            return (
                                <div
                                    key={conv.user.id}
                                    onClick={() => handleSelectUser(conv.user.id)}
                                    className={`flex items-center gap-3 p-3 mb-3 cursor-pointer rounded-lg transition
                                    ${
                                        selectedUserId === conv.user.id
                                            ? 'bg-blue-100 font-semibold text-blue-900'
                                            : 'hover:bg-gray-200'
                                    }`}
                                >
                                    {renderSidebarAvatar(conv.user)}
                                    <div className="flex flex-col flex-1 truncate">
                                        <div className="flex justify-between items-center">
                                            <div className="truncate">{conv.user.name}</div>
                                            {unread > 0 && (
                                                <span className="bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 select-none">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 truncate max-w-[180px]">
                                            {conv.lastMessage?.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ---------- Chat Window ---------- */}
            {selectedUserId && currentUserId ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Messages List */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                        {messages.length === 0 && (
                            <p className="text-gray-500 italic text-center mt-10">
                                No messages yet. Say hi!
                            </p>
                        )}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`mb-3 flex items-center ${
                                    msg.sender.id === currentUserId ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {/* Avatar on the left for received, right for sent */}
                                {msg.sender.id !== currentUserId && renderChatAvatar(msg.sender, 28)}

                                <div
                                    className={`rounded-lg p-3 inline-block break-words ${
                                        msg.sender.id === currentUserId
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-900 shadow-sm'
                                    }`}
                                    style={{ maxWidth: '65%', minWidth: '50px' }}
                                >
                                    {msg.content}
                                </div>

                                {msg.sender.id === currentUserId && renderChatAvatar(msg.sender, 28)}
                            </div>
                        ))}
                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Send Message Input */}
                    <div className="p-4 border-t flex gap-3 bg-white">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700 transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-white text-gray-400 italic">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    );
}
