"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { Award, Timer } from "lucide-react";

export default function Certifications() {
  const { certifications } = portfolioData;

  return (
    <section id="certifications" className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          number="04" 
          title="Verified Credentials" 
          subtitle="Continuous learning and industry-standard certifications in Data Science, Project Management, and Generative AI."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard 
                className="p-6 h-full flex flex-col group border-white/5 hover:border-white/20"
                hoverGlow="none"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0"
                    style={{ color: cert.color, backgroundColor: `${cert.color}05` }}
                  >
                    {cert.status === "In Progress" ? <Timer size={20} className="animate-spin-slow" /> : <Award size={20} />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white leading-snug group-hover:text-neon-blue transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1 uppercase">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className={`text-[9px] font-mono tracking-[0.2em] uppercase ${cert.status === "In Progress" ? "text-yellow-500" : "text-neon-blue/60"}`}>
                    {cert.status || cert.date}
                  </span>
                  {cert.status === "In Progress" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
