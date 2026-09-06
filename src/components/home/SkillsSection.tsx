'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { SKILL_CATEGORIES } from '@/src/data/skills';
import { Sparkles, Box, Layout, Cpu } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Box,
  Layout,
  Cpu,
};

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].id);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const currentCategory =
    SKILL_CATEGORIES.find((c) => c.id === activeCategory) ?? SKILL_CATEGORIES[0];

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-8"
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-400 mb-3 block">
          Technical proficiencies
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
          Skills & technical expertise
        </h2>
        <p className="text-sm text-slate-400">
          Knowledge across AI tooling, Bedrock systems, web engineering, and developer workflows.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-center gap-2 flex-wrap mb-8"
      >
        {SKILL_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] ?? Sparkles;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="skill-pill"
                  className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {!isActive && (
                <span className="absolute inset-0 rounded-lg bg-[#0b1224]/40 border border-white/[0.07]" />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{cat.name}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {currentCategory.skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl flex flex-col gap-1.5 border transition-all shadow-[0_6px_24px_-8px_rgba(0,0,0,0.4)] ${
                skill.highlight
                  ? 'bg-gradient-to-b from-[#0e1628] to-[#070d1d] border-cyan-500/25'
                  : 'bg-gradient-to-b from-[#0e1628]/80 to-[#070d1d]/80 border-white/[0.07] hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>{skill.name}</span>
                  {skill.highlight && (
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                      core
                    </span>
                  )}
                </h4>
                <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded bg-white/[0.04] shrink-0">
                  {skill.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
