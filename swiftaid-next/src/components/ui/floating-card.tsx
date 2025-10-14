"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FloatingCard({ 
  children, 
  className, 
  delay = 0, 
  duration = 3 
}: FloatingCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover-lift",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -10, 0], 
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { 
          duration, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay 
        }
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}