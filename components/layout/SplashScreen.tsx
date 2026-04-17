"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock scrolling while splash screen is active
    document.body.style.overflow = 'hidden';
    
    // Hide splash screen after 2.5 seconds (gives time for animations to play)
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Background Industrial Grid & Halation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px]"></div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            {/* Animated Logo Container */}
            <div className="relative flex items-center justify-center w-32 h-32">
              {/* Outer Rotating Dashed Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-sky-500/30 rounded-full"
              />
              {/* Inner Counter-Rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-sky-400/20 rounded-full"
              />
              
              {/* Center Logo */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="relative z-10 h-16 w-16"
              >
                <Image 
                  src="/logo_round.svg" 
                  alt="Bharat Forge Logo" 
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" 
                />
              </motion.div>
            </div>

            {/* Typography Reveal */}
            <div className="overflow-hidden pb-2">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl font-black whitespace-nowrap text-white tracking-tighter"
              >
                Bharat<span className="text-sky-500 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]">Forge</span>
              </motion.div>
            </div>

            {/* Premium Loading Bar */}
            <div className="w-56 h-1 bg-slate-800 rounded-full overflow-hidden mt-2 relative">
              {/* Background glow for the bar */}
              <div className="absolute inset-0 bg-sky-900/20"></div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,1)] relative"
              >
                {/* Highlight running across the bar */}
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                />
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2"
            >
              Welcome to Bharat Forge
            </motion.p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}