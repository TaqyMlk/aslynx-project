'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, Box, Layout, ArrowRight } from 'lucide-react';

export default function FieldsSection() {
  const fields = [
    {
      id: 'ai',
      title: 'AI & Automation',
      icon: Sparkles,
      color: 'from-purple-500/20 to-blue-500/20 text-purple-400',
      border: 'border-purple-500/20',
      desc: 'System prompt architecture, multi-agent pipelines with tool execution loops, context token optimization, and intelligent provider routing.',
      points: ['Prompt Engineering & Schema Validation', 'Multi-Agent Loops with Memory & Tools', 'Provider Routing (Gemini, OpenRouter, Groq)', 'Context Token Budget Optimization'],
      link: '/lab/ai-lite',
      linkText: 'Explore AI Tools'
    },
    {
      id: 'minecraft',
      title: 'Minecraft Bedrock Modding',
      icon: Box,
      color: 'from-cyan-500/20 to-emerald-500/20 text-cyan-400',
      border: 'border-cyan-500/20',
      desc: 'Official @minecraft/server Script API add-on engineering, custom gameplay systems, zero-lag vein mining, and interactive modal forms.',
      points: ['Bedrock Script API (@minecraft/server)', 'Zero-Lag Vein Mining & Treecapitator Algorithms', 'Realms & BDS Multiplayer Performance Tuning', '350,000+ CurseForge Player Community'],
      link: '/projects',
      linkText: 'View Bedrock Add-ons'
    },
    {
      id: 'web',
      title: 'Modern Web Development',
      icon: Layout,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400',
      border: 'border-blue-500/20',
      desc: 'Full-stack Next.js App Router applications, iOS-inspired Dark Matte Glossy Glass design systems, TypeScript type safety, and interactive utility workspaces.',
      points: ['Next.js 15+ App Router & Server Components', 'React 19 & Strict TypeScript Type Safety', 'Dark Matte Glossy Glass Design System', '12+ Interactive Browser Utilities & Sandbox'],
      link: '/lab',
      linkText: 'Open Lab Workspace'
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <span>Specialized Disciplines</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Core Engineering Fields
        </h2>
        <p className="text-sm text-zinc-400">
          Where technical precision meets interactive creator tooling and seamless gameplay systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel hover:glass-panel-elevated p-6 sm:p-7 rounded-3xl border-white/5 hover:border-white/15 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${field.color} border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{field.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-5">{field.desc}</p>

                <ul className="space-y-2 mb-6">
                  {field.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs text-zinc-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={field.link}
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors pt-4 border-t border-white/5"
              >
                <span>{field.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
