'use client';

import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCES } from '@/src/data/experience';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 flex items-center justify-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />Timeline & Milestones</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Professional Experience</h2>
        <p className="text-sm text-neutral-400">A track record of building Minecraft systems, AI tooling, and full-stack web platforms.</p>
      </div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.12 }} className="space-y-5">
        {EXPERIENCES.map((exp) => (
          <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="bg-[#0f1219] hover:bg-white/[0.03] p-6 sm:p-8 rounded-2xl border border-white/8 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-400">{exp.organization}</p>
              </div>
              <div className="flex flex-col sm:items-end text-xs text-neutral-400 gap-1 mt-1 sm:mt-0 shrink-0">
                <div className="flex items-center gap-1.5 text-neutral-300"><Calendar className="w-3.5 h-3.5" /><span>{exp.period}</span></div>
                <div className="flex items-center gap-1.5 text-neutral-500"><MapPin className="w-3.5 h-3.5" /><span>{exp.location}</span></div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">{exp.description.en}</p>
            <ul className="space-y-2.5">{exp.highlights.map((h) => <li key={h} className="flex items-start gap-2.5 text-xs text-neutral-400"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" /><span>{h}</span></li>)}</ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}