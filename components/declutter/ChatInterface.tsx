"use client";

import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface ChatInterfaceProps {
  documentContent: string;
}

export default function ChatInterface({ documentContent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/declutter/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          documentContext: documentContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      // Only add the AI's response to messages
      setMessages(prev => [...prev, data.content]);
      setInput('');
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-accent-midnight/50 rounded-lg p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="bg-accent-violet/20 p-4 rounded-lg text-text-light"
          >
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your document..."
          className="flex-1 bg-accent-violet/20 rounded-lg px-4 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-primary-violet"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary-violet p-2 rounded-lg text-white disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <FiSend className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
} 