"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          number="03" 
          title="Career Trajectory" 
          subtitle="Real-world professional history focused on driving operational efficiency and data-informed decision making."
        />

        <div className="relative border-l border-white/5 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
          {experience.map((exp, idx) => (
            <motion.div
              key={exp.company + exp.period}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div 
                className="absolute -left-[45px] md:-left-[61px] top-4 w-4 h-4 rounded-full border-2 border-cyber-dark z-10"
                style={{ backgroundColor: exp.color, boxShadow: `0 0 15px ${exp.color}` }}
              />

              <GlassCard 
                className="p-8 group"
                hoverGlow={exp.color === "#00f0ff" ? "blue" : "purple"}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-neon-blue transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-neon-blue font-mono text-[10px] tracking-[0.3em] uppercase mt-1">
                      {exp.company}
                    </div>
                  </div>
                  
                  <div className="px-4 py-1 rounded-full glass border-white/5 text-[10px] font-mono text-slate-500 uppercase tracking-widest h-fit">
                    {exp.period}
                  </div>
                </div>

                <ul className="space-y-4">
                  {exp.description.map((point, i) => (
                    <li key={i} className="flex gap-4 group/item">
                      <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/10 group-hover/item:bg-neon-blue transition-colors shrink-0" />
                      <p className="text-slate-400 text-sm leading-relaxed font-light group-hover/item:text-slate-200 transition-colors">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
