'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function AIChatComponent() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/ai/chat', {
        message: userMessage,
      });

      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Failed to get reply.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 shadow rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Ask Your AI Health Assistant</h2>

      <div className="max-h-80 overflow-y-auto border border-gray-300 dark:border-gray-700 p-3 rounded space-y-2 bg-gray-50 dark:bg-slate-800 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === 'user'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-right'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 animate-pulse">AI is typing...</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          placeholder="Ask about health, fitness, diet..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'Send'}
        </button>
      </div>
    </div>
  );
}
