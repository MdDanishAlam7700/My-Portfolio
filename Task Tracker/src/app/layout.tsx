import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEURAL TRACKER | Departmental Task Hub",
  description: "Secure, AMOLED-optimized internal task tracking with cyberpunk aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="noise-overlay" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
