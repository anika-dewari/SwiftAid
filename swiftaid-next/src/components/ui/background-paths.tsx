"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export interface BackgroundPathsProps {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}

export const BackgroundPaths: React.FC<BackgroundPathsProps> = ({
  children,
  className,
  svgOptions = { duration: 6 },
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const paths = [
    // Tech circuit-like paths
    "M0,200 Q100,100 200,200 T400,200 L600,150 Q700,100 800,150 L1000,200",
    "M0,300 Q150,250 300,300 T600,300 L800,250 Q900,200 1000,250 L1200,300",
    "M100,50 Q200,0 300,50 T500,50 L700,100 Q800,150 900,100 L1100,50",
    "M50,400 Q150,350 250,400 T450,400 L650,350 Q750,300 850,350 L1050,400",
    "M0,150 L200,100 Q300,50 400,100 L600,150 Q700,200 800,150 L1000,100",
    "M150,350 Q250,300 350,350 T550,350 L750,300 Q850,250 950,300 L1150,350",
    // Additional neural network-style paths
    "M0,250 C100,200 200,300 300,250 S500,200 600,250 T900,250 L1200,200",
    "M100,180 Q200,130 300,180 C400,230 500,130 600,180 S800,230 900,180 L1100,130",
    // Emergency dispatch themed paths
    "M0,320 Q120,270 240,320 C360,370 480,270 600,320 T960,320 L1200,370",
    "M80,80 C180,30 280,130 380,80 Q480,30 580,80 C680,130 780,30 880,80 L1080,130",
  ];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pathElements = svg.querySelectorAll("path");
    pathElements.forEach((path, index) => {
      const length = path.getTotalLength();
      
      // Set initial styles
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.animation = `drawPath ${svgOptions.duration}s ease-in-out infinite`;
      path.style.animationDelay = `${index * 0.3}s`;
    });

    // Add CSS animation keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes drawPath {
        0% {
          stroke-dashoffset: ${1000};
          opacity: 0;
        }
        10% {
          opacity: 0.3;
        }
        50% {
          stroke-dashoffset: 0;
          opacity: 1;
        }
        90% {
          opacity: 0.3;
        }
        100% {
          stroke-dashoffset: ${-1000};
          opacity: 0;
        }
      }
      
      @keyframes pathGlow {
        0%, 100% {
          filter: drop-shadow(0 0 2px currentColor);
        }
        50% {
          filter: drop-shadow(0 0 8px currentColor);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [svgOptions.duration]);

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900" />
      
      {/* Animated SVG paths */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pathGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
          </linearGradient>
          <linearGradient id="pathGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
          <linearGradient id="pathGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
            <stop offset="50%" stopColor="rgba(239, 68, 68, 0.6)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
          </linearGradient>
        </defs>
        
        {paths.map((pathData, index) => (
          <path
            key={index}
            d={pathData}
            fill="none"
            stroke={
              index % 3 === 0 ? "url(#pathGradient1)" :
              index % 3 === 1 ? "url(#pathGradient2)" :
              "url(#pathGradient3)"
            }
            strokeWidth={index % 2 === 0 ? "2" : "1.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
            style={{
              animation: `pathGlow ${svgOptions.duration! * 2}s ease-in-out infinite`,
              animationDelay: `${index * 0.4}s`,
            }}
          />
        ))}
        
        {/* Additional tech elements */}
        <circle
          cx="200"
          cy="150"
          r="3"
          fill="rgba(59, 130, 246, 0.8)"
          className="animate-pulse"
        />
        <circle
          cx="600"
          cy="250"
          r="2"
          fill="rgba(16, 185, 129, 0.8)"
          className="animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <circle
          cx="900"
          cy="180"
          r="2.5"
          fill="rgba(239, 68, 68, 0.8)"
          className="animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </svg>
      
      {/* Overlay grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};