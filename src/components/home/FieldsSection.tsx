'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, Box, Layout, ArrowRight } from 'lucide-react';

export default function FieldsSection() {
  const fields = [
    { id: 'ai', title: 'AI & Automation', icon: Sparkles, desc: 'System prompt architecture, multi-agent workflows, context optimization, and practical AI tooling.', points: ['Prompt Engineering & Schema Validation', 'Agent Workflows with Tools', 'Provider Routing', 'Context Optimization'], link: '/lab/ai-lite', linkText: 'Explore AI Tools' },
    { id: 'minecraft', title: 'Minecraft Bedrock Modding', icon: Box, desc: 'Script API engineering, custom gameplay systems, performance-focused add-ons, and multiplayer tooling.', points: ['@minecraft/server', 'Gameplay Systems', 'Realms & BDS Optimization', '350,000+ Downloads'], link: '/projects', linkText: 'View Bedrock Add-ons' },
    { id: 'web', title: 'Modern Web Development', icon: Layout, desc: 'Full-stack Next.js applications, TypeScript, responsive interfaces, and focused developer utilities.', points: ['Next.js App Router', 'React & TypeScript', 'Responsive UI Systems', 'Interactive Developer Tools'], link: '/lab', linkText: 'Open Lab Workspace' }
  ];

  return <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
    <div className="text-center max-w-2xl mx-auto mb-12"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">Specialized Disciplines</div><h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Core Engineering Fields</h2><p className="text-sm text-neutral-400">Where technical precision meets useful creator tooling and interactive systems.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{fields.map((field, idx) => { const Icon = field.icon; return <motion.div key={field.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="glass-panel hover-surface p-6 sm:p-7 rounded-2xl flex flex-col justify-between group"><div><div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform"><Icon className="w-6 h-6 text-neutral-200" /></div><h3 className="text-lg font-bold text-white mb-2">{field.title}</h3><p className="text-xs text-neutral-400 leading-relaxed mb-5">{field.desc}</p><ul className="space-y-2 mb-6">{field.points.map((pt) => <li key={pt} className="text-xs text-neutral-300 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/60" /><span>{pt}</span></li>)}</ul></div><Link href={field.link} className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-200 hover:text-white transition-colors pt-4 border-t border-white/5"><span>{field.linkText}</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></Link></motion.div>})}</div>
  </section>;
}
