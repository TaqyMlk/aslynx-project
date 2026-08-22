'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Download, Terminal, Code2, Box, Flame } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formattedDownloads = totalDownloads > 0 ? `${(totalDownloads / 1000).toFixed(0)}K+` : '350K+';

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* Eyebrow / Available Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-medium text-zinc-300 mb-6 shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>AI Prompt Engineer & Bedrock Modder</span>
        <span className="text-zinc-500">•</span>
        <span className="text-cyan-400 font-semibold">{formattedDownloads} Downloads</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6"
      >
        Engineering Next-Gen{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI Workflows
        </span>{' '}
        & Minecraft Bedrock Systems
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-8"
      >
        Muhammad Abdulhadi Taqy (<span className="text-zinc-200 font-semibold">AsLynx</span>) — Crafting high-performance Minecraft add-ons, precision system prompts, and responsive modern web architectures.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mb-12"
      >
        <Link
          href="/projects"
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Box className="w-4 h-4" />
          <span>Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="#google-drive-export"
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 font-semibold text-sm transition-all active:scale-95 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Import ke Drive</span>
        </a>

        <Link
          href="/lab"
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel hover:glass-panel-elevated border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-sm transition-all active:scale-95"
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>My Lab</span>
        </Link>
      </motion.div>

      {/* Live Highlights / Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl"
      >
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center border-white/5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xl sm:text-2xl mb-1">
            <Flame className="w-5 h-5" />
            <span>{formattedDownloads}</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium">CurseForge Downloads</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center border-white/5">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xl sm:text-2xl mb-1">
            <Box className="w-5 h-5" />
            <span>8+</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium">Add-ons Released</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center border-white/5">
          <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xl sm:text-2xl mb-1">
            <Sparkles className="w-5 h-5" />
            <span>12+</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium">Public Lab Tools</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center border-white/5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xl sm:text-2xl mb-1">
            <Code2 className="w-5 h-5" />
            <span>100%</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium">Zero-Lag Scripting</span>
        </div>
      </motion.div>
    </section>
  );
}
