"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("has-loaded")) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("has-loaded", "true");
          }, 500);
          return 100;
        }
        // Random increment between 2 and 15
        return Math.min(100, prev + (Math.random() * 13 + 2));
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050816]"
        >
          {/* Animated rings */}
          <div className="relative flex items-center justify-center h-40 w-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 rounded-full border-t-2 border-l-2 border-blue-500/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              className="absolute inset-4 rounded-full border-r-2 border-b-2 border-violet-500/50"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
              className="absolute inset-8 rounded-full border-t-2 border-r-2 border-emerald-500/50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-white tracking-wider">HZ</span>
            </div>
          </div>

          <div className="mt-12 w-64">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>SYSTEM_INIT</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                style={{ width: `${progress}%` }}
                layout
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
