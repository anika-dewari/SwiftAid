"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export interface AnnouncementProps {
  children: React.ReactNode;
  className?: string;
  movingBorder?: boolean;
  variant?: "default" | "emergency" | "success" | "warning" | "info";
}

export interface AnnouncementTagProps {
  children: React.ReactNode;
  className?: string;
  lustre?: boolean;
  variant?: "default" | "emergency" | "success" | "warning" | "info";
}

export interface AnnouncementTitleProps {
  children: React.ReactNode;
  className?: string;
}

const Announcement: React.FC<AnnouncementProps> = ({
  children,
  className,
  movingBorder = false,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700",
    emergency: "bg-red-50/90 dark:bg-red-950/90 border-red-200 dark:border-red-800",
    success: "bg-green-50/90 dark:bg-green-950/90 border-green-200 dark:border-green-800",
    warning: "bg-yellow-50/90 dark:bg-yellow-950/90 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50/90 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800",
  };

  return (
    <motion.div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border px-4 py-3 backdrop-blur-sm",
        variantStyles[variant],
        movingBorder && "overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {movingBorder && (
        <>
          {/* Moving border animation */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[1px]">
              <div className={cn("rounded-lg h-full w-full", variantStyles[variant])} />
            </div>
          </div>
          
          {/* Animated border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Content overlay */}
          <div className={cn("absolute inset-[2px] rounded-lg", variantStyles[variant])} />
        </>
      )}
      
      <div className="relative z-10 flex items-center gap-3 w-full">
        {children}
      </div>
    </motion.div>
  );
};

const AnnouncementTag: React.FC<AnnouncementTagProps> = ({
  children,
  className,
  lustre = false,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    emergency: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
    success: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
    info: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        lustre && "animate-pulse",
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {lustre && (
        <motion.div
          className="mr-2 h-2 w-2 rounded-full bg-current"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {children}
    </motion.span>
  );
};

const AnnouncementTitle: React.FC<AnnouncementTitleProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-2 text-sm font-medium text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Announcement, AnnouncementTag, AnnouncementTitle };