'use client';

import { motion } from 'motion/react';
import { EXPERIENCES } from '@/src/data/experience';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 flex items-center justify-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Timeline & Milestones
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Professional Experience</h2>
        <p className="text-sm text-slate-400">A track record of building Minecraft systems, AI tooling, and full-stack web platforms.</p>
      </div>
      <div className="space-y-4">
        {EXPERIENCES.map((exp) => (
          <div key={exp.id} className="bg-slate-900/40 hover:bg-white/[0.02] p-6 sm:p-8 rounded-2xl border border-white/5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{exp.role}</h3>
                <p className="text-xs sm:text-sm font-medium text-slate-400">{exp.organization}</p>
              </div>
              <div className="flex flex-col sm:items-end text-xs text-slate-400 gap-1 mt-1 sm:mt-0 shrink-0">
                <div className="flex items-center gap-1.5 text-slate-300"><Calendar className="w-3.5 h-3.5" /><span>{exp.period}</span></div>
                <div className="flex items-center gap-1.5 text-slate-500"><MapPin className="w-3.5 h-3.5" /><span>{exp.location}</span></div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">{exp.description.en}</p>
            <ul className="space-y-2">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}