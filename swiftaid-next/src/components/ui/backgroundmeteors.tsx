"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface Meteor {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
}

export interface BackgroundMeteorsProps {
  children?: React.ReactNode;
  className?: string;
  meteorCount?: number;
  meteorColor?: string;
  meteorSize?: number;
  meteorSpeed?: number;
}

const BackgroundMeteors: React.FC<BackgroundMeteorsProps> = ({
  children,
  className,
  meteorCount = 20,
  meteorColor = "rgba(255, 255, 255, 0.8)",
  meteorSize = 2,
  meteorSpeed = 1,
}) => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const generateMeteors = () => {
      const newMeteors: Meteor[] = [];
      for (let i = 0; i < meteorCount; i++) {
        newMeteors.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.5 + 0.5) * meteorSpeed,
          size: Math.random() * meteorSize + 1,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
      setMeteors(newMeteors);
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      generateMeteors();
    }
  }, [dimensions, meteorCount, meteorSize, meteorSpeed]);

  useEffect(() => {
    const animateMeteors = () => {
      setMeteors((prevMeteors) =>
        prevMeteors.map((meteor) => {
          let newX = meteor.x + Math.cos(meteor.angle) * meteor.speed;
          let newY = meteor.y + Math.sin(meteor.angle) * meteor.speed;

          // Reset meteor position if it goes off screen
          if (newX < -50 || newX > dimensions.width + 50 || 
              newY < -50 || newY > dimensions.height + 50) {
            newX = Math.random() * dimensions.width;
            newY = Math.random() * dimensions.height;
          }

          return { ...meteor, x: newX, y: newY };
        })
      );
    };

    const interval = setInterval(animateMeteors, 16); // ~60fps
    return () => clearInterval(interval);
  }, [dimensions]);

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Meteors */}
      <div className="absolute inset-0 overflow-hidden">
        {meteors.map((meteor) => (
          <motion.div
            key={meteor.id}
            className="absolute rounded-full"
            style={{
              left: meteor.x,
              top: meteor.y,
              width: meteor.size,
              height: meteor.size,
              background: `radial-gradient(circle, ${meteorColor} 0%, transparent 70%)`,
              opacity: meteor.opacity,
              boxShadow: `0 0 ${meteor.size * 2}px ${meteorColor}`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [meteor.opacity, meteor.opacity * 0.3, meteor.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: -100,
              y: Math.random() * dimensions.height,
              opacity: 0,
            }}
            animate={{
              x: dimensions.width + 100,
              y: Math.random() * dimensions.height + 200,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 4 + Math.random() * 6,
              ease: "easeOut",
            }}
            style={{
              boxShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default BackgroundMeteors;