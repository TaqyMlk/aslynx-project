'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, FileCode2 } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formatted = new Intl.NumberFormat('en-US').format(totalDownloads || 350000);

  return (
    <section className="relative w-full px-4 sm:px-6 pt-20 sm:pt-28 pb-8 sm:pb-16 overflow-hidden">
      {/* atmosphere — barely there */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-15%] h-[560px] w-[720px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />
        <div className="absolute top-[48%] left-[-12%] h-[460px] w-[560px] rounded-full bg-indigo-500/[0.03] blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
        {/* left — words first */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="min-w-0 pt-4 sm:pt-8"
        >
          <p className="text-xs font-mono tracking-[0.18em] uppercase text-cyan-400 mb-5">
            AsLynx · Muhammad Abdulhadi Taqy
          </p>

          <h1 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-medium tracking-[-0.02em] leading-[1.05] text-white text-balance max-w-[18ch]">
            Saya bikin sistem Bedrock yang jalan
            <br />
            <span className="font-light text-slate-400">tanpa bikin server nangis</span>
          </h1>

          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-slate-300">
            Prompt specialist. Script API developer. Saya tulis add-on Minecraft yang ringan di Realms & BDS, framework prompt yang kepakai, dan tool web kecil yang beneran membantu orang — bukan cuma demo.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Lihat project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Buka lab <span aria-hidden>→</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
              <FileCode2 className="h-3.5 w-3.5" /> 12 tools di lab
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] leading-none">
            <span className="text-slate-500">Stack:</span>
            <span className="rounded-full bg-white/[0.03] border border-white/10 px-2.5 py-1 text-slate-300">Script API</span>
            <span className="rounded-full bg-white/[0.03] border border-white/10 px-2.5 py-1 text-slate-300">@minecraft/server</span>
            <span className="rounded-full bg-white/[0.03] border border-white/10 px-2.5 py-1 text-slate-300">Next.js 15</span>
            <span className="rounded-full bg-white/[0.03] border border-white/10 px-2.5 py-1 text-slate-300">TypeScript</span>
          </div>
        </motion.div>

        {/* right — code card yang nggak rapi simetris */}
        <motion.div
          initial={{ opacity: 0, y: 16, rotate: 0.8 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div className="relative rounded-[22px] border border-white/10 bg-[#0b1224]/90 backdrop-blur overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            {/* window chrome */}
            <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
              </div>
              <span className="font-mono text-[11px] text-slate-400">lynx-core/scripts/tick.ts</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                verified on Realms
              </span>
            </div>

            <pre className="overflow-x-auto p-4 sm:p-5 font-mono text-[11.5px] leading-[1.7] text-slate-300 tab-size-2">
              <code>{`import { world, system } from "@minecraft/server";

// interval 20 tick (1 detik) — hemat, bukan spam per-frame
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
});`}</code>
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 bg-white/[0.02] px-4 py-3">
              <span className="font-mono text-[11px] text-slate-500">~42kb gzipped · cold start <120ms di BDS</span>
              <Link href="/projects" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">
                lihat add-on →
              </Link>
            </div>
          </div>

          {/* floating note — personal, nggak di grid */}
          <div className="absolute -bottom-3 sm:-bottom-2 -left-3 sm:-left-5 rotate-[-1.5deg] rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
            <p className="font-mono text-[11px] leading-tight text-slate-300">
              <span className="text-white">Note:</span> tested on potato phone. works.
              <span className="text-slate-500"> — AsLynx</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}