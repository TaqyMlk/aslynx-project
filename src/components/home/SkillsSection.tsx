'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SKILL_CATEGORIES } from '@/src/data/skills';
import { Sparkles, Box, Layout, Cpu } from 'lucide-react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const icons: Record<string, React.ReactNode> = { Sparkles: <Sparkles className="w-4 h-4" />, Box: <Box className="w-4 h-4" />, Layout: <Layout className="w-4 h-4" />, Cpu: <Cpu className="w-4 h-4" /> };
  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeCategory) || SKILL_CATEGORIES[0];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 block">Technical Proficiencies</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Skills & Technical Expertise</h2>
        <p className="text-sm text-neutral-400">Technical knowledge across AI, Minecraft Bedrock, web engineering, and developer tooling.</p>
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">{SKILL_CATEGORIES.map((cat) => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} aria-pressed={activeCategory === cat.id} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#0f1219] text-neutral-400 hover:text-white border border-white/8 hover:border-white/15'}`}>{icons[cat.iconName]}<span>{cat.name}</span></button>)}</div>
      <motion.div key={`${activeCategory}-${currentCategory.id}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCategory.skills.map((skill, idx) => (
          <motion.div key={`${activeCategory}-${skill.name}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className={`p-5 rounded-2xl flex flex-col gap-2 border ${skill.highlight ? 'bg-[#0f1219] border-white/12' : 'bg-[#0f1219] border-white/8'}`}>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{skill.name}</span>
                {skill.highlight && <span className="text-xs font-semibold text-neutral-200 bg-white/[0.07] px-2 py-0.5 rounded-md">Core</span>}
              </h4>
              <span className="text-[11px] font-medium text-neutral-200 px-2 py-0.5 rounded-md bg-white/[0.06] shrink-0">{skill.level}</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{skill.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">{skill.tags.map((tag) => <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/8">{tag}</span>)}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}