'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils';
import { ShimmeringText } from '@/shared/ui/shimmering-text';
import { Skeleton } from '@/shared/ui';

interface ChatMessage {
  id: string;
  text: string;
  from: 'user' | 'assistant';
  isTyping?: boolean; // For Typewriter effect
}

const MOCK_ANSWERS = [
  'Я проанализировал ваши расходы. В категории "Кофе" наблюдается рост на 15%.',
  'Ваш бюджет в норме, но рекомендую обратить внимание на подписки.',
  'Привет! Я готов помочь вам с финансовым планированием.',
  'Кажется, вы забыли внести вчерашние траты. Хотите добавлю напоминание?',
];

// --- Subcomponent: Typewriter Effect ---
const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, 30); // Speed of typing (ms per char)

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', text: 'Привет! Я ваш AI-ассистент. Спросите меня о ваших финансах!', from: 'assistant', isTyping: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setIsHistoryLoading(true);
      const timer = setTimeout(() => setIsHistoryLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiProcessing, isOpen]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // 1. User Message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      from: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsAiProcessing(true);

    // 2. Mock AI Delay & Response
    setTimeout(() => {
      const responseText = MOCK_ANSWERS[Math.floor(Math.random() * MOCK_ANSWERS.length)];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        from: 'assistant',
        isTyping: true, // Start typing effect
      };
      
      setIsAiProcessing(false);
      setMessages((prev) => [...prev, botMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const handleTypingComplete = (id: string) => {
    setMessages((prev) => 
      prev.map(m => m.id === id ? { ...m, isTyping: false } : m)
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="w-[420px] h-[600px] flex flex-col bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[24px] overflow-hidden dark:shadow-primary/5 dark:bg-zinc-900/80"
          >
            {/* --- Premium Header --- */}
            <div className="relative flex items-center justify-between p-5 border-b border-border/40 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative p-2 bg-gradient-to-br from-primary to-violet-600 rounded-xl shadow-lg shadow-primary/20">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight text-foreground">Cyber AI</span>
                  <span className="text-[11px] font-medium text-primary/80 uppercase tracking-wider">
                    Financial Advisor
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-text-secondary"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --- Messages Area --- */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar scroll-smooth">
              {isHistoryLoading ? (
                 <div className="space-y-6">
                    <div className="flex gap-3 justify-start">
                        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                        <Skeleton className="h-16 w-[70%] rounded-2xl rounded-tl-sm" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Skeleton className="h-10 w-[50%] rounded-2xl rounded-tr-sm" />
                    </div>
                     <div className="flex gap-3 justify-start">
                        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                        <Skeleton className="h-24 w-[80%] rounded-2xl rounded-tl-sm" />
                    </div>
                 </div>
              ) : (
                 <>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex w-full gap-3",
                    msg.from === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Avatar for Assistant */}
                  {msg.from === 'assistant' && (
                     <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center border border-border/50 shadow-sm mt-1">
                        <Bot className="w-4 h-4 text-text-secondary" />
                     </div>
                  )}

                  <div
                    className={cn(
                      "relative max-w-[80%] px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                      msg.from === "user" 
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
                        : "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-border/50 text-foreground rounded-2xl rounded-tl-sm"
                    )}
                  >
                     {msg.from === 'assistant' && msg.isTyping ? (
                       <TypewriterText text={msg.text} onComplete={() => handleTypingComplete(msg.id)} />
                     ) : (
                       msg.text
                     )}
                  </div>
                </motion.div>
              ))}

              {isAiProcessing && (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex w-full gap-3 justify-start"
                 >
                     <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center border border-border/50 shadow-sm mt-1">
                        <Bot className="w-4 h-4 text-text-secondary" />
                     </div>
                     <div className="px-4 py-3 bg-fill-secondary/50 rounded-2xl rounded-tl-sm flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce [animation-delay:-0.3s]" />
                         <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce [animation-delay:-0.15s]" />
                         <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce" />
                     </div>
                 </motion.div>
              )}
              <div ref={messagesEndRef} />
              </>
              )}
            </div>

            {/* --- Input Area --- */}
            <div className="p-4 bg-background/40 backdrop-blur-md border-t border-border/40">
              <form 
                onSubmit={handleSendMessage} 
                className={cn(
                  "relative flex items-center gap-2 p-1.5 pl-4 rounded-full transition-all duration-300",
                  "bg-fill-secondary/50 border border-transparent focus-within:bg-background focus-within:border-primary/20 focus-within:shadow-lg focus-within:shadow-primary/5"
                )}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Спросите что-нибудь..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-tertiary min-w-0"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isAiProcessing}
                  className={cn(
                     "p-2.5 rounded-full transition-all duration-200 shrink-0",
                     inputValue.trim() && !isAiProcessing
                       ? "bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95" 
                       : "bg-fill-tertiary text-text-tertiary cursor-not-allowed opacity-50"
                  )}
                >
                  <Send className={cn("w-4 h-4", inputValue.trim() && !isAiProcessing && "ml-0.5")} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Floating Toggle Button --- */}
      <motion.button
        layoutId="chat-toggle"
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50",
          isOpen 
            ? "bg-background border border-border text-foreground hover:rotate-90" 
            : "bg-gradient-to-tr from-primary to-violet-600 text-primary-foreground shadow-primary/40 ring-4 ring-primary/10"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
               key="close"
               initial={{ rotate: -90, opacity: 0 }}
               animate={{ rotate: 0, opacity: 1 }}
               exit={{ rotate: 90, opacity: 0 }}
            >
               <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div
               key="chat"
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.5, opacity: 0 }}
            >
               <MessageCircle className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
