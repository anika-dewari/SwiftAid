"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface CursorHighlightProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  showPointer?: boolean;
  pointerClassName?: string;
  rectangle?: string;
}

export const CursorHighlight: React.FC<CursorHighlightProps> = ({
  children,
  className,
  gradient = "from-rose-500 via-fuchsia-500 to-rose-500",
  showPointer = true,
  pointerClassName = "text-pink-500",
  rectangle = "border-2 border-blue-500 dark:border-white/20 rounded-lg p-4",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-block", rectangle)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Text content */}
      <motion.div
        className={cn("relative z-10", className)}
        initial={{ backgroundPosition: "-100% 0" }}
        animate={isInView ? { backgroundPosition: "100% 0" } : {}}
        transition={{ duration: 1.5, delay: 0.3 }}
        style={{
          background: `linear-gradient(90deg, #6b7280 0%, #6b7280 40%, transparent 50%, transparent 60%, #6b7280 100%)`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {/* Gradient overlay that reveals on scroll */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r bg-clip-text text-transparent",
            `bg-gradient-to-r ${gradient}`
          )}
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 1.5, delay: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
        
        {/* Base text */}
        {children}
      </motion.div>

      {/* Animated cursor pointer */}
      {showPointer && (
        <motion.div
          className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none z-20", pointerClassName)}
          initial={{ left: "0%", opacity: 0 }}
          animate={isInView ? { left: "100%", opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="drop-shadow-lg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};