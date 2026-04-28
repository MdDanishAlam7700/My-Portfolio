"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue as motionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import { ExternalLink, Code2, X, Globe, Layers } from "lucide-react";

const categories = ["All", "Analytics", "Automation", "Dashboards"];

const projects = [
  {
    id: 1,
    title: "Healthcare Performance Analytics",
    tagline: "Clinical & Operational Intelligence",
    description:
      "Architected a comprehensive analytics system for healthcare data, identifying operational bottlenecks and optimizing resource allocation. Delivered interactive reports that improved patient flow visibility by 30%.",
    tags: ["Power BI", "Healthcare Data", "SQL"],
    category: "Analytics",
    gradient: "from-[#00d4ff] to-[#0066aa]",
    accent: "var(--neon-blue)",
    github: "https://github.com/MdDanishAlam7700",
    live: "https://example.com",
    featured: true,
  },
  {
    id: 2,
    title: "HR Analytics & Workforce Optimization",
    tagline: "People Data Strategy",
    description:
      "Developed an HR intelligence dashboard to track employee performance, turnover rates, and hiring efficiency. Provided data-backed insights that assisted in reducing recruitment lead time by 15%.",
    tags: ["HR Analytics", "Data Visualization", "Excel"],
    category: "Dashboards",
    gradient: "from-[#a855f7] to-[#7c3aed]",
    accent: "var(--neon-purple)",
    github: "https://github.com/MdDanishAlam7700",
    live: "https://example.com",
    featured: true,
  },
  {
    id: 3,
    title: "Banking & Financial Risk Analysis",
    tagline: "Quantitative Risk & Growth Modeling",
    description:
      "Built advanced financial models to assess banking risks and project future growth scenarios. Integrated automated data verification to ensure 99.9% accuracy in monthly reporting cycles.",
    tags: ["Financial Analysis", "Banking", "Automation"],
    category: "Analytics",
    gradient: "from-[#f0abfc] to-[#a855f7]",
    accent: "#f0abfc",
    github: "https://github.com/MdDanishAlam7700",
    live: "https://example.com",
    featured: false,
  }
];

function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-2xl glass rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{ borderColor: `${project.accent}20` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient bar */}
        <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {project.title}
              </h3>
              <p style={{ color: project.accent }} className="text-sm">
                {project.tagline}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 glass rounded-full border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full font-mono"
                style={{
                  background: `${project.accent}14`,
                  border: `1px solid ${project.accent}40`,
                  color: project.accent,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            <NeonButton
              variant="blue"
              size="sm"
              onClick={() => window.open(project.live, "_blank")}
            >
              <Globe size={14} />
              Live Demo
            </NeonButton>
            <NeonButton
              variant="outline"
              size="sm"
              onClick={() => window.open(project.github, "_blank")}
            >
              <Code2 size={14} />
              Source Code
            </NeonButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={() => {}}
        onClick={() => setSelected(true)}
        className="group relative glass rounded-xl overflow-hidden border border-white/5 transition-all duration-400 cursor-pointer"
        style={{
          boxShadow: hovered ? `0 0 30px ${project.accent}15, 0 10px 40px rgba(0,0,0,0.3)` : "none",
          borderColor: hovered ? `${project.accent}30` : "rgba(255,255,255,0.05)",
        }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative z-10">
        {/* Top gradient accent bar */}
        <div className={`h-1 bg-gradient-to-r ${project.gradient} transition-all duration-300`}
          style={{ opacity: hovered ? 1 : 0.6 }} />

        {/* Card body */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              {project.featured && (
                <span
                  className="text-[10px] tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{
                    background: `${project.accent}14`,
                    border: `1px solid ${project.accent}30`,
                    color: project.accent,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  FEATURED
                </span>
              )}
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {project.title}
              </h3>
            </div>
            <div className="flex gap-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 glass rounded-full text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                <Code2 size={14} />
              </a>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 glass rounded-full text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-4" style={{ color: project.accent, opacity: 0.9 }}>
            {project.tagline}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[11px] rounded font-mono"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgb(148 163 184)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover click prompt */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute bottom-4 right-4 text-xs tracking-widest flex items-center gap-1"
          style={{ color: project.accent, fontFamily: "JetBrains Mono, monospace" }}
        >
          <Layers size={10} />
          VIEW MORE
        </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={project} onClose={() => setSelected(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = projects.filter(
    (p) => activeFilter === "All" || p.category === activeFilter
  );

  return (
    <section id="projects" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          number="08"
          title="My Projects"
          subtitle="Click any card to explore the full details, tech stack, and live demos."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-[rgba(0,212,255,0.12)] border-[rgba(0,212,255,0.5)] text-[var(--neon-blue)] shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
