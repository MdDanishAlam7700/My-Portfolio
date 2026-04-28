"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Download, ExternalLink } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import NeonButton from "@/components/ui/NeonButton";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
          scrolled
            ? "bg-cyber-dark/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" aria-label="Home" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue">
            <div className="w-8 h-8 rounded-lg bg-neon-blue flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform">
              <Zap size={18} className="text-black" fill="currentColor" />
            </div>
            <span className="font-bold text-sm tracking-widest text-white">
              DANISH<span className="text-neon-blue">.DATA</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono tracking-widest text-slate-400 hover:text-neon-blue transition-colors uppercase"
              >
                {link.label}
              </a>
            ))}
            
            <NeonButton 
              variant="outline" 
              size="sm"
              onClick={() => window.open(portfolioData.personal.resume, "_blank")}
            >
              Resume
              <ExternalLink size={12} className="ml-2" />
            </NeonButton>
          </div>

          {/* Mobile Trigger */}
          <button
            className="md:hidden text-neon-blue"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 bg-cyber-dark/95 backdrop-blur-2xl flex flex-col pt-32 px-10 gap-8"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold text-white hover:text-neon-blue transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-auto mb-20">
              <NeonButton 
                variant="blue" 
                className="w-full"
                onClick={() => window.open(portfolioData.personal.resume, "_blank")}
              >
                View Resume
                <Download size={18} className="ml-2" />
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
