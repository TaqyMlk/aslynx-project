'use client';

import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '@/src/data/skills';
import { Sparkles, Box, Layout, Cpu } from 'lucide-react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const icons: Record<string, React.ReactNode> = { Sparkles: <Sparkles className="w-4 h-4" />, Box: <Box className="w-4 h-4" />, Layout: <Layout className="w-4 h-4" />, Cpu: <Cpu className="w-4 h-4" /> };
  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeCategory) || SKILL_CATEGORIES[0];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 block">Technical Proficiencies</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Skills & Technical Expertise</h2>
        <p className="text-sm text-slate-400">Technical knowledge across AI, Minecraft Bedrock, web engineering, and developer tooling.</p>
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'bg-slate-900/40 text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
            }`}
          >
            {icons[cat.iconName]}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentCategory.skills.map((skill, idx) => (
          <div
            key={`${activeCategory}-${skill.name}`}
            className={`p-4 rounded-2xl flex flex-col gap-1.5 border ${
              skill.highlight ? 'bg-slate-900/40 border-white/10' : 'bg-slate-900/40 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{skill.name}</span>
                {skill.highlight && (
                  <span className="text-[10px] font-semibold text-slate-200 bg-white/[0.05] px-1.5 py-0.5 rounded">Core</span>
                )}
              </h4>
              <span className="text-[10px] font-medium text-slate-300 px-2 py-0.5 rounded bg-white/[0.04] shrink-0">{skill.level}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {skill.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}