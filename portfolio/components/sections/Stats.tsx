"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, TrendingUp, Zap, Globe, LucideIcon } from "lucide-react";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

function Counter({ value, suffix = "", label, icon: Icon, color }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 20,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 group">
      <div 
        className="w-12 h-12 rounded-2xl glass mb-4 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300"
        style={{ color }}
      >
        <Icon size={24} />
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span className="text-4xl md:text-5xl font-bold text-white neon-text-white tracking-tighter">
          {displayValue}
        </motion.span>
        <span className="text-2xl font-bold" style={{ color }}>{suffix}</span>
      </div>
      <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-[0.3em] mt-2">
        {label}
      </p>
    </div>
  );
}

export default function Stats() {
  const stats = [
    { value: 3, suffix: "", label: "Core Sectors", icon: Globe, color: "var(--neon-blue)" },
    { value: 40, suffix: "%", label: "Efficiency Gain", icon: TrendingUp, color: "var(--neon-purple)" },
    { value: 15, suffix: "+", label: "Hours Saved/Wk", icon: Zap, color: "var(--neon-blue)" },
    { value: 100, suffix: "%", label: "Data Accuracy", icon: CheckCircle2, color: "var(--neon-purple)" },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="glass rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden relative group">
          {/* Internal Glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--neon-blue)]/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--neon-purple)]/5 blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
            {stats.map((stat, i) => (
              <Counter key={i} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
