'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, FileCode2, Terminal, Check, Copy } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

const CODE_SNIPPET = `import { world, system } from "@minecraft/server";

// interval 20 tick (1s) — hemat, bukan spam per-frame
system.runInterval(() => {
  for (const p of world.getAllPlayers()) {
    if (p.getDynamicProperty("lynx:ready")) {
      p.sendMessage("§aLynx §7— ready.");
    }
  }
}, 20);

// listener event-driven, bukan polling
world.afterEvents.playerSpawn.subscribe((e) => {
  const p = e.player;
  p.setDynamicProperty("lynx:ready", true);
  p.sendMessage("§7Welcome back. §aLynx §7active.");
});`;

export default function Hero({ totalDownloads }: HeroProps) {
  const formatted = new Intl.NumberFormat('en-US').format(totalDownloads || 350000);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveCategory] = useState<'script' | 'prompt'>('script');

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full px-4 sm:px-6 pt-20 sm:pt-28 pb-8 sm:pb-16 overflow-hidden">
      {/* Animated subtle atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.04, 0.07, 0.04],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-[-15%] h-[560px] w-[720px] rounded-full bg-cyan-500 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[48%] left-[-12%] h-[460px] w-[560px] rounded-full bg-indigo-500 blur-[110px]"
        />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
        {/* Left — Animated Copy Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="min-w-0 pt-4 sm:pt-8"
        >
          {/* Badge with live pulse */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <p className="text-xs font-mono tracking-[0.18em] uppercase text-cyan-400">
              AsLynx · Indonesia · remote
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-medium tracking-[-0.02em] leading-[1.05] text-white text-balance max-w-[18ch]"
          >
            Saya bikin sistem Bedrock yang jalan
            <br />
            <motion.span
              animate={{
                color: ['#94a3b8', '#38bdf8', '#94a3b8'],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="font-light italic"
            >
              tanpa bikin server nangis
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-slate-300"
          >
            Prompt specialist. Script API developer. Saya tulis add-on Minecraft yang ringan di Realms & BDS, framework prompt yang kepakai, dan tool web kecil yang beneran membantu orang — bukan cuma demo.
          </motion.p>

          {/* Action CTAs with hover animation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors shadow-lg shadow-white/5"
              >
                Lihat project <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/lab"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2.5 px-3"
              >
                Buka lab <span aria-hidden>→</span>
              </Link>
            </motion.div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
              <FileCode2 className="h-3.5 w-3.5" /> 12 tools di lab
            </span>
          </motion.div>

          {/* Interactive Stack Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center gap-2 text-[11px] leading-none"
          >
            <span className="text-slate-500">Stack:</span>
            {['Script API', '@minecraft/server', 'Next.js 15', 'TypeScript'].map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="rounded-full bg-white/[0.03] border border-white/10 px-2.5 py-1 text-slate-300 transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Interactive Animated Code Window */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 0.5 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ rotate: 0, scale: 1.01 }}
          className="relative transition-all duration-300"
        >
          <div className="relative rounded-[22px] border border-white/10 bg-[#0b1224]/90 backdrop-blur overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            {/* Window Chrome / Bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/60" />
                <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="font-mono text-[11px] text-slate-400">lynx-core/scripts/tick.ts</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span className="font-mono text-[10px]">{copied ? 'copied!' : 'copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <pre className="overflow-x-auto p-4 sm:p-5 font-mono text-[11.5px] leading-[1.7] text-slate-300">
              <code>{CODE_SNIPPET}</code>
            </pre>

            {/* Status Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] text-slate-400">~42kb gzipped · &lt;120ms cold start</span>
              </div>
              <Link href="/projects" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                lihat add-on →
              </Link>
            </div>
          </div>

          {/* Floating Note with Subtle Wiggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="absolute -bottom-3 sm:-bottom-2 -left-3 sm:-left-5 rotate-[-1.5deg] rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] cursor-pointer"
          >
            <p className="font-mono text-[11px] leading-tight text-slate-300">
              <span className="text-emerald-400 font-semibold">Note:</span> tested on potato phone. works.
              <span className="text-slate-500"> — AsLynx</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
