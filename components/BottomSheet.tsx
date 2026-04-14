"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const BottomSheet = ({ isOpen, onClose, children, title }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto"
          >
            <div className="glass-dark rounded-t-[40px] border-t border-white/10 p-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" onClick={onClose} />
              
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-2xl font-bold">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto px-2 no-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
