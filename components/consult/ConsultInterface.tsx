"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import { ConsultMessage, ConsultSession } from '@/types/consult';

interface ConsultInterfaceProps {
  sessionId: string;
  initialMessages?: ConsultMessage[];
}

export default function ConsultInterface({ sessionId, initialMessages = [] }: ConsultInterfaceProps) {
  const [messages, setMessages] = useState<ConsultMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ConsultMessage = {
      id: Date.now().toString(),
      sessionId,
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consult/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: ConsultMessage = {
        id: Date.now().toString(),
        sessionId,
        content: data.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Consultation chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-accent-midnight/50 rounded-lg p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary-violet text-white'
                  : 'bg-accent-violet/20 text-text-light'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          className="p-2 rounded-lg bg-accent-violet/20 text-text-light hover:bg-accent-violet/30"
        >
          <FiPaperclip className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
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