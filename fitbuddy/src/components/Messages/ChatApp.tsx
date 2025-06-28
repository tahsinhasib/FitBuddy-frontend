'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Menu, X } from 'lucide-react';

export default function ChatApp() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const fetchMessages = async (recipientId: number) => {
    if (!currentUserId) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:3000/messages/${currentUserId}/${recipientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);

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

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    setSearchTerm('');
    setSearchResults([]);
    setIsMobileSidebarOpen(false); // Hide sidebar on mobile after selecting
  };

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

  const fetchUnreadCounts = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:3000/messages/unread-counts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const counts: Record<number, number> = {};
      res.data.forEach((entry: { senderId: number; unreadCount: number }) => {
        counts[entry.senderId] = entry.unreadCount;
      });
      setUnreadCounts(counts);
    } catch (err) {
      console.error('Error fetching unread counts:', err);
    }
  };

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchProfile();
    fetchConversations();
    fetchUnreadCounts();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, currentUserId]);

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

  return (
    <div className="flex h-[95vh] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl relative">

      {/* ----- Hamburger button (mobile only) ----- */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="absolute top-3 left-3 z-50 md:hidden bg-gray-100 dark:bg-slate-700 p-2 rounded-md shadow-md"
      >
        {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ----- Sidebar ----- */}
      <div
        className={`z-40 bg-white dark:bg-slate-900 w-64 md:w-[30%] p-4 fixed md:relative top-0 left-0 h-full transform transition-transform duration-300 ease-in-out 
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        md:flex flex-col overflow-y-auto border-r border-gray-200 dark:border-slate-700`}
      >
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white">Conversations</h2>

        <input
          type="text"
          placeholder="Search users to chat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-5 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white"
        />

        <div className="flex-1 overflow-y-auto">
          {searchTerm ? (
            <>
              {isSearching ? (
                <p className="text-gray-600 dark:text-gray-400 italic">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">No users found.</p>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => handleSelectUser(user.id)}
                  >
                    {renderSidebarAvatar(user)}
                    <div className="text-gray-800 dark:text-white font-medium">{user.name}</div>
                  </div>
                ))
              )}
            </>
          ) : (
            conversations.map((conv) => {
              const unread = unreadCounts[conv.user.id] || 0;
              return (
                <div
                  key={conv.user.id}
                  onClick={() => handleSelectUser(conv.user.id)}
                  className={`flex items-center gap-3 p-3 mb-3 cursor-pointer rounded-lg transition
                    ${selectedUserId === conv.user.id
                      ? 'bg-blue-100 dark:bg-blue-700 font-semibold text-blue-900 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-100'
                    }`}
                >
                  {renderSidebarAvatar(conv.user)}
                  <div className="flex flex-col flex-1 truncate">
                    <div className="flex justify-between items-center">
                      <div className="truncate">{conv.user.name}</div>
                      {unread > 0 && (
                        <span className="bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
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
            })
          )}
        </div>
      </div>

      {/* ----- Main Chat Window ----- */}
      <div className="flex-1 flex flex-col ml-0 md:ml-[30%]">
        {selectedUserId && currentUserId ? (
          <>
            <div className="flex-1 p-6 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 flex items-center ${msg.sender.id === currentUserId ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div className="flex flex-col items-end max-w-[65%] min-w-[50px]">
                    <div
                      className={`rounded-lg p-3 inline-block break-words ${
                        msg.sender.id === currentUserId
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 pr-1 self-end">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 text-gray-800 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
