"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "blue" | "purple" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function NeonButton({ 
  children, 
  onClick, 
  className, 
  variant = "blue",
  size = "md" 
}: NeonButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden rounded-xl group select-none";
  
  const sizeStyles = {
    sm: "px-5 py-2.5 text-[10px]",
    md: "px-8 py-4 text-xs",
    lg: "px-10 py-5 text-sm"
  };

  const variantStyles = {
    blue: "bg-white text-black hover:bg-neon-blue hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]",
    purple: "bg-neon-purple text-white hover:bg-white hover:text-black shadow-[0_0_30px_rgba(157,0,255,0.2)]",
    outline: "bg-white/[0.02] backdrop-blur-md border border-white/10 text-white hover:border-neon-blue hover:bg-neon-blue/5 hover:text-neon-blue"
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
    >
      <div className="relative z-10 flex items-center gap-3">
        {children}
      </div>
      
      {/* Dynamic Hover Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Border Beam Effect */}
      <div className="absolute -inset-full h-full w-full z-0 block bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2.5s_linear_infinite]" />
    </motion.button>
  );
}
