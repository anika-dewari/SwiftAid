"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  via?: string;
  animate?: boolean;
}

export function GradientText({ 
  children, 
  className, 
  from = "blue-500", 
  to = "purple-500", 
  via,
  animate = false 
}: GradientTextProps) {
  const gradientClass = via 
    ? `from-${from} via-${via} to-${to}` 
    : `from-${from} to-${to}`;

  return (
    <span
      className={cn(
        `bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent font-bold`,
        animate && "gradient-animate",
        className
      )}
    >
      {children}
    </span>
  );
}