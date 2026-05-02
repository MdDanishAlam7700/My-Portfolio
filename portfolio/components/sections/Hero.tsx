"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, MousePointer2, Sparkles } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import NeonButton from "@/components/ui/NeonButton";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";

const Planet = dynamic(() => import("@/components/ui/Planet"), { ssr: false });

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { hero, personal } = portfolioData;

  return (
    <section id="hero" className="relative min-h-[110vh] flex items-center pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-neon-blue text-[10px] font-mono tracking-[0.3em] uppercase mb-10 shadow-2xl backdrop-blur-md"
            >
              <Sparkles size={12} className="animate-pulse" />
              Recruiter-Ready Analytics Portfolio
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
              <span className="block">{hero.title.split(" ")[0]}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">
                {hero.title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <div className="flex flex-col gap-6 mb-12">
              <p className="text-2xl md:text-3xl text-white font-medium tracking-tight">
                {hero.subtitle}
              </p>
              <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-light">
                {hero.subtext}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <NeonButton 
                variant="blue" 
                size="lg"
                onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Expertise
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </NeonButton>
              
              <a 
                href={personal.resume} 
                target="_blank"
                className="group flex items-center gap-3 text-xs font-mono tracking-[0.2em] text-slate-200 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-blue/50 group-hover:bg-neon-blue/5 transition-all">
                  <Download size={16} />
                </div>
                <span>DOWNLOAD CV</span>
              </a>
            </div>
          </motion.div>

          {/* Side Info / Visual Weight */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="lg:col-span-2 hidden lg:flex flex-col gap-12"
          >
            {/* 3D Planet Interactive Element */}
            <div className="relative h-[400px] w-full flex items-center justify-center cursor-move">
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-transparent to-neon-purple/10 blur-[100px] rounded-full" />
              {mounted && (
                <div className="absolute inset-0">
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    gl={{ antialias: false, alpha: true }}
                    dpr={[1, 1.5]}
                  >
                    <Planet />
                  </Canvas>
                </div>
              )}
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-sm relative z-10">
              <div className="text-[10px] font-mono text-neon-blue tracking-[0.4em] uppercase mb-4 opacity-50">Identity</div>
              <p className="text-white text-sm leading-relaxed font-light italic">
                &quot;Solving real-world business problems through data-driven architectures, 
                automated financial models, and strategic AI integration.&quot;
              </p>
            </div>


            <div className="flex items-center gap-4 px-8">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <MousePointer2 size={16} className="text-white/20 animate-bounce" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] font-mono text-slate-700 tracking-[0.5em] uppercase">Scroll to Discover</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-neon-blue/40 via-neon-purple/20 to-transparent" />
      </motion.div>
    </section>
  );
}
