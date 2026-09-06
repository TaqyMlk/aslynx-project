'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { User, CheckCircle2, Globe, Download, MapPin, Terminal, Zap } from 'lucide-react';

const philosophies = [
  {
    title: 'Prompt engineering as system design',
    desc: 'Treat instructions like code — explicit boundaries, deterministic outputs, versionable and testable.',
  },
  {
    title: 'Bedrock systems that respect resources',
    desc: 'Script API on Realms and BDS with event-driven patterns, minimal tick overhead, and graceful degradation.',
  },
  {
    title: 'Web interfaces that earn their keep',
    desc: 'Next.js 15 + React 19 with focused interactions, accessible defaults, and visual clarity over decoration.',
  },
];

const stats = [
  { icon: Terminal, label: 'Add-ons published', value: '12+' },
  { icon: Download, label: 'Total installs', value: '350k+' },
  { icon: Globe, label: 'Platforms', value: 'Realms · BDS · MCPE' },
  { icon: MapPin, label: 'Based', value: 'Indonesia · Remote' },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="w-full lg:w-5/12 bg-[#0b1224]/60 border border-white/[0.07] rounded-2xl p-6 sm:p-8"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center mb-5"
          >
            <User className="w-6 h-6 text-slate-300" />
          </motion.div>

          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
            Muhammad Abdulhadi Taqy
          </h3>
          <p className="text-sm text-slate-400 mb-5">Known as AsLynx</p>

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Script API developer and prompt specialist. Building reliable Bedrock systems, practical AI tooling, and focused web applications.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/5">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                className="flex items-center gap-3"
              >
                <item.icon className="w-4 h-4 text-cyan-400/80 shrink-0" />
                <span className="text-sm text-slate-500 shrink-0">{item.label}</span>
                <span className="text-sm font-medium text-slate-200 font-mono">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="w-full lg:w-7/12 space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-400 mb-2 block">
              Core philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-[1.15]">
              Engineering with precision, restraint, and purpose
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {philosophies.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
                whileHover={{ x: 4 }}
                className="group bg-[#0b1224]/60 hover:bg-[#0b1224]/90 border border-white/[0.07] hover:border-cyan-500/20 rounded-2xl p-5 flex gap-4 items-start transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-5 h-5 rounded border border-white/10 bg-white/[0.02] flex items-center justify-center shrink-0 mt-0.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </motion.div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1.5 group-hover:text-cyan-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}