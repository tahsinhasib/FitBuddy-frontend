'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function AIChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(res.data.name);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMessage, timestamp: new Date() },
    ]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/ai/chat', {
        message: userMessage,
        userName,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.data.reply, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '❌ Failed to get reply.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 shadow-lg rounded-xl flex flex-col h-[600px]">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 select-none">
        Ask Your AI Health Assistant
      </h2>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800"
      >
        {messages.length === 0 && !loading && (
          <p className="text-gray-400 dark:text-gray-500 italic text-center select-none">
            Start the conversation by typing your question below...
          </p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end max-w-[80%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center font-bold select-none ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
              aria-label={msg.role === 'user' ? 'User avatar' : 'AI assistant avatar'}
            >
              {msg.role === 'user' ? (userName ? userName[0].toUpperCase() : 'U') : 'AI'}
            </div>

            {/* Message bubble */}
            <div
              className={`ml-2 p-3 rounded-lg whitespace-pre-wrap text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-br-none'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}
              `}
              role="article"
              aria-live="polite"
            >
              {msg.text}
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right select-none">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-2 select-none">
            <Loader2 className="animate-spin" size={20} />
            <span>AI is typing...</span>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="mt-4 flex gap-3"
      >
        <input
          type="text"
          className="flex-grow border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Ask about health, fitness, diet..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={loading || input.trim() === ''}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
          aria-label="Send message"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send'}
        </button>
      </form>
    </div>
  );
}
