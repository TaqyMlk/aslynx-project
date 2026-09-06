'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, FileCode2, Check, Copy } from 'lucide-react';

interface HeroProps {
  totalDownloads: number;
}

const CODE_LINES = [
  { text: 'import { world, system } from "@minecraft/server";', delay: 0 },
  { text: '', delay: 0 },
  { text: '// interval 20 tick (1s) — hemat, bukan spam', delay: 200 },
  { text: 'system.runInterval(() => {', delay: 400 },
  { text: '  for (const p of world.getAllPlayers()) {', delay: 700 },
  { text: '    if (p.getDynamicProperty("lynx:ready")) {', delay: 1000 },
  { text: '      p.sendMessage("§aLynx §7— ready.");', delay: 1300 },
  { text: '    }', delay: 1600 },
  { text: '  }', delay: 1700 },
  { text: '}, 20);', delay: 1900 },
  { text: '', delay: 0 },
  { text: '// listener event-driven, bukan polling', delay: 2200 },
  { text: 'world.afterEvents.playerSpawn.subscribe((e) => {', delay: 2400 },
  { text: '  const p = e.player;', delay: 2700 },
  { text: '  p.setDynamicProperty("lynx:ready", true);', delay: 2900 },
  { text: '  p.sendMessage("§7Welcome back. §aLynx §7active.");', delay: 3100 },
  { text: '});', delay: 3300 },
];

function TypewriterCode() {
  const [typedLines, setTypedLines] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const totalDuration = CODE_LINES.reduce((acc, line) => acc + line.delay, 0) + 1500;
    const interval = setInterval(() => {
      setTypedLines((prev) => {
        if (prev >= CODE_LINES.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 40);

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-[280px]">
      {CODE_LINES.slice(0, typedLines).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="font-mono text-[11.5px] leading-[1.7] text-slate-300 whitespace-pre"
        >
          {line.text || '\u00A0'}
        </motion.div>
      ))}
      {typedLines < CODE_LINES.length && (
        <div className="font-mono text-[11.5px] leading-[1.7] text-cyan-400">
          <span className="inline-block w-2 h-4 bg-cyan-400 align-middle" style={{ opacity: cursorVisible ? 1 : 0 }} />
        </div>
      )}
    </div>
  );
}

function KineticText({ children, className }: { children: React.ReactNode; className?: string }) {
  const words = String(children).split(/(\s+)/);
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word === ' ' ? '\u00A0' : word}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formatted = new Intl.NumberFormat('en-US').format(totalDownloads || 350000);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  const handleCopy = () => {
    const code = CODE_LINES.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      {/* Parallax atmosphere */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 right-[-20%] h-[700px] w-[900px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
        <div className="absolute top-[55%] left-[-15%] h-[560px] w-[680px] rounded-full bg-indigo-500/[0.04] blur-[130px]" />
        {/* Grid noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </motion.div>

      <motion.div style={{ opacity, scale }} className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start px-4 sm:px-6 pt-20 sm:pt-28 pb-8 sm:pb-16">

        {/* Left — kinetic copy */}
        <div className="min-w-0 pt-4 sm:pt-8">
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-6"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-emerald-400 block"
            />
            <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-slate-400">
              AsLynx · Indonesia · remote · {formatted} installs
            </span>
          </motion.div>

          {/* Title — word-by-word entrance */}
          <h1 className="overflow-hidden">
            <div className="text-[1.65rem] sm:text-[2.1rem] lg:text-[2.5rem] font-medium tracking-[-0.025em] leading-[1.1] text-white">
              <KineticText>
                Saya bikin sistem Bedrock yang jalan
              </KineticText>
            </div>
            <div className="text-[1.65rem] sm:text-[2.1rem] lg:text-[2.5rem] font-light italic tracking-[-0.025em] leading-[1.1] mt-1">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-cyan-300"
              >
                <KineticText>tanpa bikin server nangis</KineticText>
              </motion.span>
            </div>
          </h1>

          {/* Description — slide up */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-slate-400"
          >
            Prompt specialist. Script API developer. Saya tulis add-on Minecraft yang ringan di Realms & BDS, framework prompt yang kepakai, dan tool web kecil yang beneran membantu — bukan cuma demo.
          </motion.p>

          {/* CTA — spring buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                href="#projects"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-white/10"
              >
                Lihat project
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors py-3"
              >
                <FileCode2 className="h-4 w-4 text-cyan-400/70" />
                Buka lab
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono"
            >
              12 tools
            </motion.span>
          </motion.div>

          {/* Stack pills — each staggered in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-7 flex flex-wrap items-center gap-2"
          >
            {['Script API', '@minecraft/server', 'Next.js 15', 'TypeScript'].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.15 + i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.07)' }}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300 font-mono cursor-default transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right — code window with typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotate: 0, scale: 1.01, y: -4 }}
          className="relative"
        >
          <div className="relative rounded-[20px] border border-white/10 bg-[#0b1224]/90 backdrop-blur-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.55)]">

            {/* Window bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ backgroundColor: ['rgba(251,113,133,0.5)', 'rgba(251,113,133,0.9)', 'rgba(251,113,133,0.5)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="h-2.5 w-2.5 rounded-full block"
                />
                <motion.span
                  animate={{ backgroundColor: ['rgba(251,191,36,0.5)', 'rgba(251,191,36,0.9)', 'rgba(251,191,36,0.5)'] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="h-2.5 w-2.5 rounded-full block"
                />
                <motion.span
                  animate={{ backgroundColor: ['rgba(52,211,153,0.5)', 'rgba(52,211,153,0.9)', 'rgba(52,211,153,0.5)'] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  className="h-2.5 w-2.5 rounded-full block"
                />
              </div>
              <span className="font-mono text-[11px] text-slate-500">lynx-core/scripts/tick.ts</span>
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="copied" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> copied
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Code body */}
            <div className="p-4 sm:p-5 overflow-x-auto">
              <TypewriterCode />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 block"
                />
                <span className="font-mono text-[11px] text-slate-500">~42kb · &lt;120ms cold start</span>
              </div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-[11px] text-cyan-400 font-mono"
              >
                verified on Realms ✓
              </motion.span>
            </div>
          </div>

          {/* Floating note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ scale: 1.06, rotate: -3, y: -6 }}
            className="absolute -bottom-4 -left-4 sm:-left-6 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-2.5 shadow-[0_20px_48px_rgba(0,0,0,0.5)] cursor-default"
          >
            <p className="font-mono text-[11px] leading-tight text-slate-300">
              <span className="text-emerald-400 font-semibold">Note:</span> tested on potato phone.
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-slate-500"
              >
                {' '}works.
              </motion.span>
              <span className="text-slate-600 ml-1">— AsLynx</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
