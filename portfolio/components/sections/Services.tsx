"use client";

import { motion } from "framer-motion";
import { Sparkles, LayoutDashboard, TrendingUp, Zap, BarChart2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

const services = [
  {
    title: "Financial Analytics & Forecasting",
    description: "Building robust financial models and predictive growth forecasts to help businesses plan with confidence and analytical precision.",
    icon: TrendingUp,
    color: "#00f0ff",
  },
  {
    title: "Dashboard Development",
    description: "Creating interactive, high-impact dashboards in Power BI and Tableau that turn complex datasets into clear, actionable insights.",
    icon: LayoutDashboard,
    color: "#9d00ff",
  },
  {
    title: "Business Data Analysis",
    description: "Performing deep-dive analysis into business metrics to identify trends, optimize operations, and drive data-backed decisions.",
    icon: BarChart2,
    color: "#00f0ff",
  },
  {
    title: "Workflow Automation",
    description: "Streamlining operations by building automated systems in Excel, Google Sheets, and AI-driven tools to eliminate manual work.",
    icon: Zap,
    color: "#9d00ff",
  },
  {
    title: "Data Cleaning & Processing",
    description: "Transforming raw, messy datasets into clean, reliable sources of truth through advanced processing and validation techniques.",
    icon: Sparkles,
    color: "#00f0ff",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          number="02"
          title="What I Do"
          subtitle="Combining analytical precision with AI innovation to solve modern business challenges."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard 
                  className="p-8 h-full flex flex-col group"
                  hoverGlow={service.color === "#9d00ff" ? "purple" : "blue"}
                >
                  <motion.div 
                    animate={{ 
                      boxShadow: ["0 0 10px rgba(0,0,0,0)", `0 0 20px ${service.color}40`, "0 0 10px rgba(0,0,0,0)"] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-all duration-500"
                    style={{ color: service.color }}
                  >
                    <Icon size={24} />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[var(--neon-blue)] transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
