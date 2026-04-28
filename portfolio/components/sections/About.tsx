"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default function About() {
  const { services } = portfolioData;

  return (
    <section id="about" className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          number="01" 
          title="What I Do" 
          subtitle="Combining analytical rigor with AI-powered efficiency to drive strategic business outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <GlassCard 
                className="p-8 group h-full"
                hoverGlow={service.color === "#00f0ff" ? "blue" : "purple"}
              >
                <div className="flex items-start gap-6">
                  <div 
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500"
                    style={{ color: service.color, boxShadow: `0 0 20px ${service.color}20` }}
                  >
                    <service.icon size={24} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-neon-blue transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-base leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
