'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Terminal, Cpu, Sparkles } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formattedDownloads = new Intl.NumberFormat('en-US').format(totalDownloads || 350000);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 pt-24 pb-12">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-1/3 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center"
      >
        {/* Eyebrow / Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400">AI & BEDROCK ENGINEERING</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">{formattedDownloads}+ Add-on Downloads</span>
        </div>

        {/* Oversized Branding Title */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-white mb-6 select-none">
          ASLYNX<span className="text-cyan-400">.</span>
        </h1>

        {/* Large Vision Statement */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-200 max-w-3xl leading-tight mb-6">
          Architecting Intelligent Systems & Modular Bedrock Ecosystems
        </h2>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10 font-normal">
          AI Prompt Specialist, Bedrock Script API Developer, and Digital Builder. Creating high-performance Minecraft add-ons, prompt frameworks, and open-source software tools.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lab"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900/80 text-slate-200 font-medium border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all backdrop-blur-md"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Developer Lab</span>
          </Link>
        </div>
      </motion.div>

      {/* Futuristic Grid Line / Accent at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
    </section>
  );
}
