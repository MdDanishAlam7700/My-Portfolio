"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  number: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ number, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-24 text-left">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-6 mb-6"
      >
        <span className="text-xs font-mono text-neon-blue tracking-[0.5em] font-bold uppercase">
          {number}
        </span>
        <div className="h-[1px] w-16 bg-gradient-to-r from-neon-blue via-neon-purple to-transparent opacity-50" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <span className="text-white inline-block">
          {title.split(' ')[0]}
        </span>
        {" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 inline-block">
          {title.split(' ').slice(1).join(' ')}
        </span>
      </motion.h2>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-slate-500 max-w-3xl leading-relaxed font-light italic"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
