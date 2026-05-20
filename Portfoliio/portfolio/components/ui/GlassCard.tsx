"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, MouseEvent, useMemo } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: "blue" | "purple" | "pink" | "none";
  onClick?: () => void;
  noPadding?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hoverGlow = "pink",
  onClick,
  noPadding = false,
}: GlassCardProps) {
  // Use springs for buttery smooth, lag-free motion
  const mouseX = useSpring(useMotionValue(0), { stiffness: 150, damping: 25 });
  const mouseY = useSpring(useMotionValue(0), { stiffness: 150, damping: 25 });

  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  const glowColors = useMemo(() => {
    switch (hoverGlow) {
      case "blue": return { spot: "rgba(0, 240, 255, 0.15)", border: "rgba(0, 240, 255, 0.3)" };
      case "purple": return { spot: "rgba(157, 0, 255, 0.15)", border: "rgba(157, 0, 255, 0.3)" };
      case "pink": return { spot: "rgba(255, 0, 255, 0.18)", border: "rgba(255, 0, 255, 0.35)" };
      default: return { spot: "rgba(255, 255, 255, 0.05)", border: "rgba(255, 255, 255, 0.1)" };
    }
  }, [hoverGlow]);

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${Number(x) * 100}% ${Number(y) * 100}%, ${glowColors.spot}, transparent 80%)`
  );

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      className={`group relative overflow-hidden bg-[var(--color-surface-start)] backdrop-blur-2xl border border-white/5 rounded-[24px] transition-all duration-500 hover:border-white/10 ${className} ${onClick ? "cursor-pointer" : ""} will-change-transform`}
      style={{ transform: "translateZ(0)" }} // Force GPU acceleration
    >
      {/* 1% Performance: Use motion.div with useTransform for the glow spot */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen"
        style={{ background }}
      />

      {/* Cyberpunk Grid/Pattern Overlay (Very subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Liquid Glossy Reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute -inset-x-full top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent skew-y-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />

      {/* Base Neon Tinted Border (Always visible) */}
      <div 
        className="absolute inset-0 rounded-[24px] border-[1.5px] transition-colors duration-500 pointer-events-none opacity-50"
        style={{ borderColor: glowColors.border }}
      />

      {/* Hover Intense Neon Border + Inner/Outer Glow */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-[24px] border-[1.5px]`}
        style={{
          borderColor: glowColors.border,
          boxShadow: `0 0 20px ${glowColors.border}, inset 0 0 20px ${glowColors.border.replace('0.3', '0.1').replace('0.35', '0.1')}`,
        }}
      />

      {/* Content */}
      <div className={`relative z-10 h-full ${noPadding ? "" : "p-8"}`}>
        {children}
      </div>

      {/* Corner Brackets (Advanced UI) */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/10 rounded-tl-sm group-hover:border-neon-blue/30 transition-colors" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10 rounded-tr-sm group-hover:border-neon-blue/30 transition-colors" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/10 rounded-bl-sm group-hover:border-neon-blue/30 transition-colors" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/10 rounded-br-sm group-hover:border-neon-blue/30 transition-colors" />
    </motion.div>
  );
}
