'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formatted = new Intl.NumberFormat('en-US').format(totalDownloads || 350000);

  return (
    <section className="relative w-full flex flex-col justify-center overflow-hidden px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,black_40%,transparent_75%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-cyan-500/[0.07] blur-[90px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 max-w-5xl mx-auto w-full"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-8 bg-cyan-400/60" aria-hidden />
          <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-cyan-400">
            AI & Bedrock Systems — {formatted} downloads
          </span>
        </div>

        <h1 className="text-[2.6rem] sm:text-6xl md:text-[4.5rem] font-[800] tracking-[-0.04em] leading-[0.9] text-white">
          ASLYNX
        </h1>

        <h2 className="mt-4 text-[1.35rem] sm:text-2xl md:text-[1.85rem] font-[600] tracking-[-0.025em] leading-tight text-slate-200 max-w-2xl">
          Intelligent systems & modular Bedrock ecosystems, built with precision.
        </h2>

        <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-slate-400 max-w-xl">
          AI prompt specialist and Bedrock Script API developer. High-performance Minecraft add-ons, prompt frameworks, and open tooling used by builders worldwide.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Explore showcase <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lab"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-white/10 text-slate-200 text-sm font-medium hover:bg-white/[0.1] hover:border-white/15 transition-colors"
          >
            <Terminal className="w-4 h-4 text-cyan-400" /> Developer lab
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">Next.js 15</span>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">Bedrock Script API</span>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">Prompt Systems</span>
        </div>
      </motion.div>
    </section>
  );
}
