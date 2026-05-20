"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const haloX = useSpring(cursorX, { damping: 40, stiffness: 80 });
  const haloY = useSpring(cursorY, { damping: 40, stiffness: 80 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none hidden md:block">
      {/* Outer Halo / Trail */}
      <motion.div
        className="absolute w-16 h-16 rounded-full border border-neon-blue/20 bg-neon-blue/[0.02]"
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 40px rgba(0, 240, 255, 0.1)"
        }}
      />
      
      {/* Main Cursor Core */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Brand Accent Dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-neon-blue"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}
