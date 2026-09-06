'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Sparkles, Box, Layout } from 'lucide-react';

const fields = [
  {
    id: 'ai',
    title: 'AI & Automation',
    icon: Sparkles,
    desc: 'Prompt architecture, multi-agent workflows, context optimization, and production AI tooling.',
    points: ['Prompt engineering & schema validation', 'Agent workflows with tools', 'Provider routing', 'Context optimization'],
    link: '/lab/ai-lite',
    linkText: 'Explore AI Tools',
  },
  {
    id: 'minecraft',
    title: 'Minecraft Bedrock Systems',
    icon: Box,
    desc: 'Script API engineering, custom gameplay mechanics, performance-focused add-ons for Realms and BDS.',
    points: ['@minecraft/server', 'Gameplay systems', 'Realms & BDS optimization', '350,000+ installs'],
    link: '/projects',
    linkText: 'View Bedrock Add-ons',
  },
  {
    id: 'web',
    title: 'Modern Web Development',
    icon: Layout,
    desc: 'Next.js applications, TypeScript, responsive interfaces, and interactive developer utilities.',
    points: ['Next.js App Router', 'React & TypeScript', 'Responsive UI systems', 'Developer tools'],
    link: '/lab',
    linkText: 'Open Lab Workspace',
  },
];

export default function FieldsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-400 mb-3 block">
          Specialized disciplines
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
          Core engineering fields
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Where technical precision meets practical tooling and interactive systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map((field, index) => {
          const Icon = field.icon;
          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group bg-[#0b1224]/60 hover:bg-[#0b1224]/90 border border-white/[0.07] hover:border-cyan-500/25 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center mb-5"
                >
                  <Icon className="w-5 h-5 text-slate-200 group-hover:text-cyan-300 transition-colors" />
                </motion.div>

                <h3 className="text-base font-semibold text-white mb-2 tracking-tight group-hover:text-cyan-100 transition-colors">
                  {field.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">{field.desc}</p>

                <ul className="space-y-2 mb-5">
                  {field.points.map((pt) => (
                    <li key={pt} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-cyan-400/70 shrink-0 transition-colors" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={field.link}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 group-hover:text-cyan-400 transition-colors pt-4 border-t border-white/5"
              >
                <span>{field.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
