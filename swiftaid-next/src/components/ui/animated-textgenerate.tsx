"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface AnimatedTextGenerateProps {
  text: string;
  className?: string;
  textClassName?: string;
  blurEffect?: boolean;
  speed?: number;
  highlightWords?: string[];
  highlightClassName?: string;
  linkWords?: string[];
  linkHrefs?: string[];
  linkClassNames?: string[];
  delay?: number;
}

export const AnimatedTextGenerate: React.FC<AnimatedTextGenerateProps> = ({
  text,
  className = "",
  textClassName = "",
  blurEffect = true,
  speed = 2,
  highlightWords = [],
  highlightClassName = "text-blue-500 font-bold",
  linkWords = [],
  linkHrefs = [],
  linkClassNames = [],
  delay = 0,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(typingInterval);
        }
      }, 100 / speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  const renderWord = (word: string, index: number) => {
    const cleanWord = word.replace(/[.,!?;:]$/, "");
    const punctuation = word.slice(cleanWord.length);
    
    // Check if word should be highlighted
    const isHighlighted = highlightWords.some(hw => 
      cleanWord.toLowerCase() === hw.toLowerCase()
    );
    
    // Check if word should be a link
    const linkIndex = linkWords.findIndex(lw => 
      cleanWord.toLowerCase() === lw.toLowerCase()
    );
    const isLink = linkIndex !== -1;
    
    if (isLink && linkHrefs[linkIndex]) {
      return (
        <Link
          key={index}
          href={linkHrefs[linkIndex]}
          className={cn(
            "inline-block transition-all duration-300 hover:scale-105",
            linkClassNames[linkIndex] || "text-blue-500 underline hover:text-blue-600"
          )}
        >
          {cleanWord}
        </Link>
      );
    }
    
    if (isHighlighted) {
      return (
        <motion.span
          key={index}
          className={cn("inline-block", highlightClassName)}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        >
          {cleanWord}
        </motion.span>
      );
    }
    
    return (
      <span key={index} className="inline-block">
        {cleanWord}
      </span>
    );
  };

  const words = text.split(" ");

  return (
    <div className={cn("relative", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: delay / 1000 }}
        className={cn(
          "relative z-10",
          blurEffect && !isComplete && "blur-sm",
          textClassName
        )}
      >
        {isComplete ? (
          // Render fully formed text with special formatting when complete
          words.map((word, index) => (
            <span key={index}>
              {renderWord(word, index)}
              {word.slice(word.replace(/[.,!?;:]$/, "").length)}
              {index < words.length - 1 && " "}
            </span>
          ))
        ) : (
          // Render typing animation
          <span className="font-mono">
            {displayedText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="inline-block w-0.5 h-6 bg-current ml-1"
            />
          </span>
        )}
      </motion.div>
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" />
      </div>
    </div>
  );
};