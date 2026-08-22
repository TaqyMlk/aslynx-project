'use client';

import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCES } from '@/src/data/experience';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Timeline & Milestones</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Professional Experience
        </h2>
        <p className="text-sm text-zinc-400">
          A track record of shipping production-grade Minecraft add-ons, AI prompts, and full-stack web platforms.
        </p>
      </div>

      <div className="space-y-6">
        {EXPERIENCES.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-panel hover:glass-panel-elevated p-6 sm:p-8 rounded-3xl border-white/5 hover:border-white/15 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2">
                  {exp.badge}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                <p className="text-xs sm:text-sm font-medium text-zinc-400">{exp.organization}</p>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-zinc-400 gap-1 mt-1 sm:mt-0">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{exp.period}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
              {exp.description.en}
            </p>

            {/* Highlights bullet points */}
            <div className="space-y-2 mb-6">
              {exp.highlights.map((h, hIdx) => (
                <div key={hIdx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Technology tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
              {exp.technologies.map((t, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
