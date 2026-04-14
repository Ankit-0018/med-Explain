"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  color: string;
  index?: number;
}

export const TimelineItem = ({ time, title, description, color, index = 0 }: TimelineItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-4 relative group"
    >
      <div className="flex flex-col items-center">
        <div 
          className="w-4 h-4 rounded-full border-2 border-background shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 group-hover:scale-125 transition-transform duration-300" 
          style={{ backgroundColor: color }} 
        />
        <div className="w-0.5 h-full bg-white/10 group-last:bg-transparent" />
      </div>
      
      <div className="pb-8">
        <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest block mb-1">
          {time}
        </span>
        <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-sm text-foreground/60">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export const Timeline = ({ items }: { items: TimelineItemProps[] }) => {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <TimelineItem key={i} {...item} index={i} />
      ))}
    </div>
  );
};
