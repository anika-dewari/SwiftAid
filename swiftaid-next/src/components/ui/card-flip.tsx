"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CardFlip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative w-full h-96 perspective-1000 cursor-pointer",
        className
      )}
      onClick={handleFlip}
      {...props}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            if (child.type === CardFlipFront) {
              return React.cloneElement(child, {
                className: cn(
                  "absolute inset-0 w-full h-full backface-hidden",
                  child.props.className
                ),
              });
            }
            if (child.type === CardFlipBack) {
              return React.cloneElement(child, {
                className: cn(
                  "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
                  child.props.className
                ),
              });
            }
          }
          return child;
        })}
      </div>
    </div>
  );
});
CardFlip.displayName = "CardFlip";

const CardFlipFront = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-lg p-6 flex flex-col",
      className
    )}
    data-slot="front"
    {...props}
  />
));
CardFlipFront.displayName = "CardFlipFront";

const CardFlipBack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-lg p-6 flex flex-col",
      className
    )}
    data-slot="back"
    {...props}
  />
));
CardFlipBack.displayName = "CardFlipBack";

const CardFlipHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    data-slot="header"
    {...props}
  />
));
CardFlipHeader.displayName = "CardFlipHeader";

const CardFlipTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    data-slot="title"
    {...props}
  />
));
CardFlipTitle.displayName = "CardFlipTitle";

const CardFlipDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    data-slot="description"
    {...props}
  />
));
CardFlipDescription.displayName = "CardFlipDescription";

const CardFlipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1", className)}
    data-slot="content"
    {...props}
  />
));
CardFlipContent.displayName = "CardFlipContent";

const CardFlipFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    data-slot="footer"
    {...props}
  />
));
CardFlipFooter.displayName = "CardFlipFooter";

const CardFlipAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    data-slot="action"
    {...props}
  />
));
CardFlipAction.displayName = "CardFlipAction";

export {
  CardFlip,
  CardFlipFront,
  CardFlipBack,
  CardFlipHeader,
  CardFlipFooter,
  CardFlipTitle,
  CardFlipDescription,
  CardFlipContent,
  CardFlipAction,
};