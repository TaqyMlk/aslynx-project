'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SKILL_CATEGORIES } from '@/src/data/skills';
import { Sparkles, Box, Layout, Cpu } from 'lucide-react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const icons: Record<string, React.ReactNode> = { Sparkles: <Sparkles className="w-4 h-4" />, Box: <Box className="w-4 h-4" />, Layout: <Layout className="w-4 h-4" />, Cpu: <Cpu className="w-4 h-4" /> };
  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeCategory) || SKILL_CATEGORIES[0];

  return <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
    <div className="text-center max-w-2xl mx-auto mb-10"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-3">Technical Proficiencies</div><h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Skills & Technical Expertise</h2><p className="text-sm text-neutral-400">Technical knowledge across AI, Minecraft Bedrock, web engineering, and developer tooling.</p></div>
    <div className="flex items-center justify-center gap-2 flex-wrap mb-8">{SKILL_CATEGORIES.map((cat) => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-white/10 text-white border border-white/20 shadow-md' : 'glass-panel text-neutral-400 hover:text-white border-white/5 hover:border-white/15'}`}>{icons[cat.iconName]}<span>{cat.name}</span></button>)}</div>
    <motion.div key={activeCategory} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">{currentCategory.skills.map((skill, idx) => <div key={idx} className={`glass-panel hover-surface p-5 rounded-2xl border ${skill.highlight ? 'border-white/15' : 'border-white/5'}`}><div className="flex items-center justify-between gap-2 mb-2"><h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2"><span>{skill.name}</span>{skill.highlight && <span className="px-2 py-0.5 rounded-md bg-white/[0.07] text-neutral-200 text-[10px] font-semibold">Core</span>}</h4><span className="text-xs font-medium text-neutral-200 px-2 py-0.5 rounded-md bg-white/[0.06]">{skill.level}</span></div><p className="text-xs text-neutral-400 leading-relaxed mb-3">{skill.description}</p><div className="flex flex-wrap gap-1.5">{skill.tags.map((tag) => <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/5">{tag}</span>)}</div></div>)}</motion.div>
  </section>;
}
