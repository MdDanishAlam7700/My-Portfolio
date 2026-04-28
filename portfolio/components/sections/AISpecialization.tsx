"use client";

import { motion } from "framer-motion";
import { Brain, Cpu, Workflow, BarChart2, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

const aiTracks = [
  {
    title: "Generative AI (IIT Patna)",
    progress: 85,
    description: "Deep dive into LLMs, prompt engineering, and RAG architectures at IIT Patna's specialized program.",
    icon: Brain,
    color: "#9d00ff",
    metrics: ["LLM Integration", "RAG Systems", "Prompt Ops"]
  },
  {
    title: "AI Workflows",
    progress: 90,
    description: "Automating business processes by integrating AI agents into Sheets, Excel, and custom Python scripts.",
    icon: Workflow,
    color: "#00f0ff",
    metrics: ["Agentic Workflows", "API Integration", "Auto-Labeling"]
  },
  {
    title: "Advanced Analytics",
    progress: 95,
    description: "Using AI to perform complex financial modeling, anomaly detection, and predictive growth analysis.",
    icon: BarChart2,
    color: "#00f0ff",
    metrics: ["Predictive Models", "Anomaly Detection", "Forecasting"]
  }
];

export default function AISpecialization() {
  return (
    <section id="ai-specialization" className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          number="05"
          title="AI Specialization"
          subtitle="Advancing the frontier of data analysis with Generative AI and automated intelligence."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {aiTracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <GlassCard className="p-8 h-full flex flex-col group relative overflow-hidden" hoverGlow={track.color === "#9d00ff" ? "purple" : "blue"}>
                  {/* Subtle background glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: track.color }} />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center border border-white/10" style={{ color: track.color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{track.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Sparkles size={12} className="text-yellow-500/80" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Track</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-slate-400">Mastery Level</span>
                      <span className="text-xs font-mono" style={{ color: track.color }}>{track.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${track.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ 
                          background: `linear-gradient(to right, ${track.color}aa, ${track.color})`,
                          boxShadow: `0 0 10px ${track.color}40`
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    {track.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 relative z-10">
                    {track.metrics.map(metric => (
                      <span key={metric} className="text-[9px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono group-hover:border-[var(--neon-blue)]/30 group-hover:text-white transition-all duration-300">
                        {metric}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
