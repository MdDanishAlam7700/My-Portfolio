"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function CyberBackground() {
  const { scrollY } = useScroll();
  
  // Parallax transforms for background depth
  const bgY1 = useTransform(scrollY, [0, 5000], [0, -500]);
  const bgY2 = useTransform(scrollY, [0, 5000], [0, -800]);
  const gridY = useTransform(scrollY, [0, 5000], [0, -300]);

  // Mouse parallax
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX / window.innerWidth - 0.5) * 50;
      const moveY = (clientY / window.innerHeight - 0.5) * 50;
      springX.set(moveX);
      springY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* 1. Base Gradient Mesh (Static) */}
      <div 
        className="absolute inset-0 bg-[#050505]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(157, 0, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.1) 0%, transparent 100%)
          `
        }}
      />

      {/* 2. Cyber Grid Overlay (Parallax) */}
      <motion.div 
        style={{ y: gridY }}
        className="absolute inset-x-0 -inset-y-1/2 opacity-[0.03]"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)"
          }}
        />
      </motion.div>

      {/* 3. Floating Glowing Orbs (Depth Layer 1 - Far) */}
      <motion.div 
        style={{ y: bgY1, x: springX }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-[var(--neon-blue)] blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.03, 0.02]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-[var(--neon-purple)] blur-[150px] rounded-full"
        />
      </motion.div>

      {/* 4. Depth Layer 2 (Mid - Faster Parallax) */}
      <motion.div 
        style={{ y: bgY2, x: useTransform(springX, (v) => v * 1.5) }}
        className="absolute inset-0"
      >
        <div className="absolute top-[60%] left-[40%] w-[250px] h-[250px] bg-[var(--neon-pink)] opacity-[0.02] blur-[100px] rounded-full" />
        <div className="absolute top-[10%] right-[30%] w-[150px] h-[150px] bg-[var(--neon-blue)] opacity-[0.015] blur-[80px] rounded-full" />
      </motion.div>

      {/* 5. Scanning Line Effect */}
      <motion.div
        animate={{ y: ["0%", "1000%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,240,255,0.1)] to-transparent opacity-20 pointer-events-none"
      />
    </div>
  );
}
