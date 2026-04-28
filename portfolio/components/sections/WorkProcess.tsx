"use client";

import { motion } from "framer-motion";
import { Database, BarChart2, Brain, Lightbulb, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Raw Data",
    description: "Ingesting fragmented datasets from SQL, Excel, and APIs.",
    icon: Database,
    color: "#00f0ff"
  },
  {
    title: "Analysis",
    description: "Cleaning and processing with Python and advanced modeling.",
    icon: BarChart2,
    color: "#9d00ff"
  },
  {
    title: "AI Integration",
    description: "Applying Generative AI to automate complex reasoning.",
    icon: Brain,
    color: "#00f0ff"
  },
  {
    title: "Insight",
    description: "Delivering actionable intelligence and strategic value.",
    icon: Lightbulb,
    color: "#9d00ff"
  }
];

function FlowArrow({ delay }: { delay: number }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-full px-4 pt-12">
      <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay,
            ease: "linear"
          }}
          className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-[var(--neon-blue)] to-transparent opacity-50"
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <ArrowRight size={12} className="text-[var(--neon-blue)] opacity-20" />
        </div>
      </div>
    </div>
  );
}

export default function WorkProcess() {
  return (
    <section id="process" className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          number="03"
          title="The Intelligence Pipeline"
          subtitle="My systematic approach to transforming chaotic datasets into strategic business advantages."
        />

        <div className="grid grid-cols-1 lg:grid-cols-7 mt-20 items-start">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="contents">
                {/* Step Item */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="lg:col-span-1 flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    {/* Outer Ring */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-4 border border-dashed border-white/10 rounded-full group-hover:border-[var(--neon-blue)]/30 transition-colors"
                    />
                    
                    <div 
                      className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-white/5 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] group-hover:border-[var(--neon-blue)]/30 relative z-10"
                      style={{ color: step.color }}
                    >
                      <Icon size={28} />
                    </div>
                  </div>
                  
                  <h3 className="text-white font-bold mb-3 tracking-tight group-hover:text-[var(--neon-blue)] transition-colors">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[180px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow Column (except for last item) */}
                {i < steps.length - 1 && (
                  <div className="lg:col-span-1">
                    <FlowArrow delay={i * 0.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
