"use client";

import { motion } from "framer-motion";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { GlassCard } from "../GlassCard";

const MOCK_MESSAGES = [
  { role: "bot", content: "Hello! I'm your MedExplain AI assistant. I've analyzed your consultation with Dr. Smith. How can I help you today?" },
  { role: "user", content: "What should I avoid while taking Metformin?" },
  { role: "bot", content: "When taking Metformin, you should avoid excessive alcohol consumption as it can increase the risk of lactic acidosis. Also, try to take it with meals to minimize stomach upset." },
];

export const ChatView = () => {
  return (
    <div className="flex flex-col h-full space-y-4 pb-12">
      <div className="px-1 flex items-center justify-between mb-2">
        <h2 className="text-3xl font-black tracking-tight">AI<br /><span className="text-primary">Assistant</span></h2>
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-20">
        {MOCK_MESSAGES.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] p-4 rounded-3xl ${
              msg.role === "user" 
                ? "bg-primary text-white rounded-tr-none" 
                : "glass-dark text-foreground/80 rounded-tl-none border-white/5"
            }`}>
              <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-2">
        <div className="glass-dark rounded-[32px] p-2 flex items-center gap-2 border-white/10 shadow-2xl">
          <input 
            type="text" 
            placeholder="Ask anything about your health..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-white placeholder:text-white/20"
          />
          <button className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
