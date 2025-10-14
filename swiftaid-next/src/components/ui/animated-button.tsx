"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface CustomCSSProperties extends React.CSSProperties {
  "--shimmer-color"?: string;
  "--radius"?: string;
  "--speed"?: string;
  "--cut"?: string;
  "--bg"?: string;
}

const animatedButtonVariants = cva(
  "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap transform-gpu transition-all duration-300 ease-in-out active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        emergency: "bg-red-500 text-white hover:bg-red-600",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-black hover:bg-yellow-600",
        glow: "bg-blue-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
        shimmer: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 py-1 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        glow: "hover:shadow-lg transition-shadow duration-300",
        shimmer: "relative overflow-hidden",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      rounded: "default",
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean;
  shimmerColor?: string;
  style?: CustomCSSProperties;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      rounded,
      asChild = false,
      shimmerColor = "#60a5fa",
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const combinedStyle: CustomCSSProperties = {
      ...style,
      "--shimmer-color": shimmerColor,
    };

    return (
      <Comp
        className={cn(
          animatedButtonVariants({
            variant,
            size,
            animation,
            rounded,
            className,
          })
        )}
        style={combinedStyle}
        ref={ref}
        {...props}
      >
        {animation === "shimmer" && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </Comp>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };