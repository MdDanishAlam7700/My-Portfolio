"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import GlassCard from "@/components/ui/GlassCard";

export default function Impact() {
  const { impact } = portfolioData;

  return (
    <section id="impact" className="relative py-20 bg-gradient-to-b from-transparent via-neon-blue/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impact.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-8 text-center border-none shadow-none bg-transparent">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 + 0.2 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-[10px] md:text-xs font-mono text-neon-blue tracking-[0.3em] uppercase mb-2">
                  {metric.label}
                </div>
                <div className="text-[10px] text-slate-600 font-light max-w-[120px] mx-auto uppercase tracking-widest">
                  {metric.description}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
