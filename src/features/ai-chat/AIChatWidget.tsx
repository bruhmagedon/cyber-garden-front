'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils';
import { Message, MessageContent } from '@/shared/ui/message';
import { ShimmeringText } from '@/shared/ui/shimmering-text';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';

interface ChatMessage {
  id: string;
  text: string;
  from: 'user' | 'assistant';
}

const MOCK_ANSWERS = [
  'Я могу помочь вам с анализом ваших транзакций.',
  'Похоже, в этом месяце вы потратили больше на кофе, чем обычно!',
  'Ваш бюджет в порядке, продолжаем в том же духе?',
  'К сожалению, я пока работаю в демо-режиме, но скоро поумнею!',
];

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', text: 'Привет! Я ваш финансовый AI-ассистент. Чем могу помочь?', from: 'assistant' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      from: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const responseText = MOCK_ANSWERS[Math.floor(Math.random() * MOCK_ANSWERS.length)];
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        from: 'assistant',
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] h-[500px] flex flex-col bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-fill-tertiary/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">AI Assistant</span>
                  <span className="text-[10px] text-text-tertiary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-fill-secondary rounded-lg transition-colors text-text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <Message key={msg.id} from={msg.from}>
                  <MessageContent variant={msg.from === 'user' ? 'contained' : 'flat'}>
                    {msg.text}
                  </MessageContent>
                </Message>
              ))}

              {isTyping && (
                <Message from="assistant">
                   <div className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary bg-fill-secondary/50 rounded-lg">
                     <Bot className="w-3 h-3" />
                     <ShimmeringText text="AI печатает..." className="text-xs" />
                   </div>
                </Message>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border/50 bg-fill-tertiary/10">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Спросите что-нибудь..."
                  className="flex-1 bg-fill-secondary hover:bg-fill-secondary/80 transition-colors rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all",
          isOpen 
            ? "bg-fill-secondary text-text-secondary border border-border" 
            : "bg-primary text-primary-foreground shadow-primary/25 shadow-xl"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </motion.button>
    </div>
  );
};
