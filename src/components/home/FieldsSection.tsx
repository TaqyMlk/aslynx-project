'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Box, Layout } from 'lucide-react';

const fields = [
  { id: 'ai', title: 'AI & Automation', icon: Sparkles, desc: 'System prompt architecture, multi-agent workflows, context optimization, and practical AI tooling.', points: ['Prompt Engineering & Schema Validation', 'Agent Workflows with Tools', 'Provider Routing', 'Context Optimization'], link: '/lab/ai-lite', linkText: 'Explore AI Tools' },
  { id: 'minecraft', title: 'Minecraft Bedrock Modding', icon: Box, desc: 'Script API engineering, custom gameplay systems, performance-focused add-ons, and multiplayer tooling.', points: ['@minecraft/server', 'Gameplay Systems', 'Realms & BDS Optimization', '350,000+ Downloads'], link: '/projects', linkText: 'View Bedrock Add-ons' },
  { id: 'web', title: 'Modern Web Development', icon: Layout, desc: 'Full-stack Next.js applications, TypeScript, responsive interfaces, and focused developer utilities.', points: ['Next.js App Router', 'React & TypeScript', 'Responsive UI Systems', 'Interactive Developer Tools'], link: '/lab', linkText: 'Open Lab Workspace' }
];

export default function FieldsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 block">Specialized Disciplines</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Core Engineering Fields</h2>
        <p className="text-sm text-slate-400">Where technical precision meets useful creator tooling and interactive systems.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.id} className="bg-slate-900/40 hover:bg-white/[0.02] p-6 rounded-2xl flex flex-col justify-between border border-white/5 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-slate-200" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">{field.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{field.desc}</p>
                <ul className="space-y-2 mb-5">
                  {field.points.map((pt) => (
                    <li key={pt} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={field.link} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-colors pt-3 border-t border-white/5 group">
                <span>{field.linkText}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}