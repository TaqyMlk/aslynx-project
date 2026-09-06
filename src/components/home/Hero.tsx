'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Terminal, Cpu } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formattedDownloads = new Intl.NumberFormat('en-US').format(totalDownloads || 350000);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 pt-24 pb-12">
      {/* Subtle background - no distracting gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-[480px] bg-slate-900/5 rounded-full absolute" />
      </div>
      
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02 }}
        className="flex flex-col items-center"
      >
        {/* Minimalist tag - no marketing fluff */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 text-slate-600">AI & Bedrock Systems</span>
        </div>

        {/* Clean, professional title */}
        <h1 className="text-4xl sm:text-7xl md:text-6xl font-bold tracking-tight text-white text-balance mt-6 mb-6">
          ASLYNX
        </h1>

        {/* Professional, factual description */}
        <p className="text-lg sm:text-lg text-slate-300 max-w-2xl leading-relaxed mt-6">
          AI Prompt Specialist and Bedrock Script API Developer creating high-performance Minecraft add-ons and open-source tools.
        </p>

        {/* Clean, minimal CTAs with proper spacing */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-all shadow-lg"
          >
            <span>Explore Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lab"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-slate-900/80 text-slate-200 font-medium border border-white/10 hover:border-slate-700 hover:bg-slate-800/80 transition-all"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Developer Lab</span>
          </Link>
        </div>

        {/* Subtle accent line - no decorative shapes */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </motion.div>
    </section>
  );
}