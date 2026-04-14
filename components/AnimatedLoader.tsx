"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const tasks = [
  "Listening carefully...",
  "Understanding your consultation...",
  "Extracting medicines...",
  "Cross-referencing drug information...",
  "Synthesizing results...",
];

export const AnimatedLoader = () => {
  const [currentTask, setCurrentTask] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTask((prev) => (prev + 1) % tasks.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      <div className="relative w-24 h-24">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
            className="absolute inset-0 bg-primary/30 rounded-full"
          />
        ))}
        <div className="absolute inset-0 bg-primary rounded-full blur-md animate-pulse" />
        <div className="absolute inset-4 bg-background rounded-full border border-primary/20 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent shadow-xl"
          />
        </div>
      </div>

      <div className="h-8 flex flex-col items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTask}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-xl font-medium text-foreground/80 tracking-tight"
          >
            {tasks[currentTask]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
