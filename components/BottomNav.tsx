"use client";

import { motion } from "framer-motion";
import { Home, Pill, Calendar, MessageSquare, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "home" | "meds" | "schedule" | "chat";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRecordClick?: () => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "meds", icon: Pill, label: "Meds" },
  { id: "schedule", icon: Calendar, label: "Timeline" },
  { id: "chat", icon: MessageSquare, label: "AI Assistant" },
];

export const BottomNav = ({ activeTab, onTabChange, onRecordClick }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="glass-dark rounded-[32px] p-2 flex items-center justify-between relative shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as TabType)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300",
                  isActive ? "text-primary" : "text-foreground/40"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* Floating Action Button (Optional logic if integrated) */}
          {onRecordClick && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
               <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRecordClick}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/40 ring-4 ring-background/50"
              >
                <Mic className="w-7 h-7" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
