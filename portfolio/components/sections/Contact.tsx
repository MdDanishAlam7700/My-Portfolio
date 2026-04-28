"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { contact, personal } = portfolioData;
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-20 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          number="05" 
          title="Connect" 
          subtitle="Open for collaboration on data-driven projects, automation architectures, or analytical inquiries."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Contact Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-12 h-full flex flex-col justify-center">
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Ready to optimize <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">your data flow?</span>
              </h3>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-4">
                <button 
                  onClick={copyEmail}
                  className="group relative flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:bg-neon-blue/10 hover:border-neon-blue/30 transition-all duration-300 w-full md:w-auto"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Direct Email</span>
                    <span className="text-lg font-medium text-white">{personal.email}</span>
                  </div>
                  <div className="ml-auto w-10 h-10 rounded-lg glass flex items-center justify-center">
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-neon-blue" />}
                  </div>
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Social Sidebar */}
          <div className="grid grid-cols-1 gap-6">
            {contact.socials.map((social, idx) => (
              <motion.a
                key={social.label}
                href={social.href || "#"}
                target={social.href ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group flex items-center justify-between p-6 rounded-2xl glass border-white/5 hover:border-white/20 transition-all duration-400 ${!social.href ? 'cursor-default' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div 
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                    style={{ color: social.color }}
                  >
                    <social.icon size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{social.label}</span>
                    <span className="text-base font-medium text-white group-hover:text-neon-blue transition-colors">
                      {social.label === "Email" ? personal.email : social.label === "Location" ? personal.location : social.label}
                    </span>
                  </div>
                </div>
                {social.href && (
                  <ArrowUpRight size={20} className="text-slate-700 group-hover:text-neon-blue group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
