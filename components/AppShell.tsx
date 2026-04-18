"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundBlobs } from "./BackgroundBlobs";

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
}

export const AppShell = ({ children, activeTab }: AppShellProps) => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col text-foreground">
      <BackgroundBlobs />
      
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 overflow-y-auto overscroll-contain px-4 pt-6 pb-28 md:pb-32"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="max-w-md mx-auto min-h-full flex flex-col">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
