'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { Sparkles, Box, Layout, ArrowRight } from 'lucide-react';

export default function FieldsSection() {
  const fields = [
    { id: 'ai', title: 'AI & Automation', icon: Sparkles, desc: 'System prompt architecture, multi-agent workflows, context optimization, and practical AI tooling.', points: ['Prompt Engineering & Schema Validation', 'Agent Workflows with Tools', 'Provider Routing', 'Context Optimization'], link: '/lab/ai-lite', linkText: 'Explore AI Tools' },
    { id: 'minecraft', title: 'Minecraft Bedrock Modding', icon: Box, desc: 'Script API engineering, custom gameplay systems, performance-focused add-ons, and multiplayer tooling.', points: ['@minecraft/server', 'Gameplay Systems', 'Realms & BDS Optimization', '350,000+ Downloads'], link: '/projects', linkText: 'View Bedrock Add-ons' },
    { id: 'web', title: 'Modern Web Development', icon: Layout, desc: 'Full-stack Next.js applications, TypeScript, responsive interfaces, and focused developer utilities.', points: ['Next.js App Router', 'React & TypeScript', 'Responsive UI Systems', 'Interactive Developer Tools'], link: '/lab', linkText: 'Open Lab Workspace' }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 block">Specialized Disciplines</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Core Engineering Fields</h2>
        <p className="text-sm text-neutral-400">Where technical precision meets useful creator tooling and interactive systems.</p>
      </div>
      <motion.div variants={containerVariants as Variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <motion.div key={field.id} variants={itemVariants} className="bg-[#020617] hover:bg-white/[0.03] p-6 sm:p-7 rounded-2xl flex flex-col justify-between border border-white/8 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5"><Icon className="w-6 h-6 text-neutral-200" /></div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{field.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-5">{field.desc}</p>
                <ul className="space-y-2 mb-6">{field.points.map((pt) => <li key={pt} className="text-xs text-neutral-300 flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" /><span>{pt}</span></li>)}</ul>
              </div>
              <Link href={field.link} className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-200 hover:text-cyan-400 transition-colors pt-4 border-t border-white/8 group">
                <span>{field.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}