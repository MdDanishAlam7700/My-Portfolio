import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import BackgroundWrapper from "@/components/ui/BackgroundWrapper";
import Navbar from "@/components/layout/Navbar";
import CustomCursor from "@/components/layout/CustomCursor";
import { portfolioData } from "@/data/portfolio";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${portfolioData.personal.name} | ${portfolioData.personal.role}`,
  description: "Data Analyst specializing in AI, automation, and financial analytics. Explore my portfolio to see how I turn data into clear business decisions.",
  keywords: ["Data Analyst", "AI Automation", "Financial Analytics", "Dashboards", "Power BI", "SQL", "Python"],
  openGraph: {
    title: `${portfolioData.personal.name} — Portfolio`,
    description: "Turning data into clear business decisions with AI and automation.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-cyber-dark selection:bg-neon-blue/30 selection:text-white`}>
        <Providers>
          <CustomCursor />
          <BackgroundWrapper />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Subtle Footer */}
          <footer className="py-12 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-[10px] font-mono text-slate-600 tracking-[0.4em] uppercase">
                © 2026 {portfolioData.personal.name} — Built for Impact
              </div>
              
              <div className="flex items-center gap-8">
                {portfolioData.contact.socials.slice(0, 3).map((social) => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    className="text-slate-600 hover:text-neon-blue transition-colors"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
