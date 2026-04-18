"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Bot, Loader2, AlertCircle } from "lucide-react";
import { GlassCard } from "../GlassCard";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MedExplain AI. How can I help you today? I can explain your prescriptions, answer health queries, or suggest general precautions."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage = error?.message?.includes("OPENROUTER_API_KEY missing")
        ? "Please set your OpenRouter API key in .env.local to use the chat."
        : "I'm sorry, I'm having trouble connecting right now. Please try again later.";
        
      setMessages(prev => [...prev, {
        role: "assistant",
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full relative min-h-[500px]">
      {/* Messages area - Flex grow */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-32 pr-2"
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  message.role === "user" 
                    ? "bg-primary text-white" 
                    : "bg-accent/20 text-accent border border-accent/10"
                }`}>
                  {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "user" 
                    ? "bg-primary text-white" 
                    : "glass-dark border border-white/5 text-foreground/80"
                }`}>
                  {message.content.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                  ))}
                  
                  {message.role === "assistant" && message.content.includes("consult") && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 text-[10px] text-foreground/40 italic">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      MedExplain AI provides information, only.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 px-1">
              <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="glass-dark border border-white/5 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span 
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-accent/40 animate-bounce" 
                      style={{ animationDelay: `${delay}ms` }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input area - Absolute positioned to stay above BottomNav but within ChatView */}
      <form 
        onSubmit={handleSend}
        className="absolute bottom-6 left-0 right-0 z-20 bg-background/80 backdrop-blur-xl rounded-[32px] p-1 border border-white/10 shadow-2xl mx-1"
      >
        <div className="flex items-center gap-2 p-1">
          <input
            id="chat-input"
            name="chatInput"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your medicine..."
            autoFocus
            autoComplete="off"
            className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-foreground/20 min-w-0"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};
