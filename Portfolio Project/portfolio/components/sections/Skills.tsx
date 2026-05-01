"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          number="02" 
          title="Technical Arsenal" 
          subtitle="A comprehensive toolkit of analytical technologies, automation frameworks, and AI systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              <GlassCard 
                className="p-8 h-full flex flex-col group"
                hoverGlow={category.isAI ? "purple" : "blue"}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.isAI ? "bg-neon-purple/10 text-neon-purple" : "bg-neon-blue/10 text-neon-blue"}`}>
                    <category.icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-[0.2em] uppercase">
                    {category.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill}
                      className={`text-[10px] px-3 py-1.5 rounded-md font-mono tracking-wider transition-all duration-300 border ${
                        category.isAI 
                          ? "bg-neon-purple/5 border-neon-purple/10 text-neon-purple/80 hover:bg-neon-purple/20 hover:text-white" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-neon-blue/10 hover:text-white hover:border-neon-blue/30"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {category.isAI && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <span className="text-[8px] font-mono text-neon-purple tracking-[0.3em] uppercase">AI ENHANCED</span>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
