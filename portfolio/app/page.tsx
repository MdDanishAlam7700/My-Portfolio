"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Impact from "@/components/sections/Impact";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      {/* Hero Section */}
      <Hero />
      
      <div className="space-y-40 mb-40">
        {/* Main Content Sections */}
        <section className="relative">
          <About />
        </section>

        <section className="relative">
          <Skills />
        </section>

        <section className="relative">
          <Impact />
        </section>

        <section className="relative">
          <Experience />
        </section>

        <section className="relative">
          <Certifications />
        </section>

        <section className="relative">
          <Contact />
        </section>
      </div>

      {/* Subtle Background Glows (Page Level) */}
      <div className="fixed top-1/4 left-0 w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-glow" />
      <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-glow" style={{ animationDelay: "1s" }} />
    </div>
  );
}
