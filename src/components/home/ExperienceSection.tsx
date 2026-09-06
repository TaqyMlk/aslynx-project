'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { EXPERIENCES } from '@/src/data/experience';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-400 mb-3 block">
          <Briefcase className="w-3.5 h-3.5 inline mr-1.5 relative -top-[1px]" />
          Timeline & milestones
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
          Professional experience
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Building Minecraft systems, AI tooling, and full-stack platforms.
        </p>
      </motion.div>

      <div className="space-y-4">
        {EXPERIENCES.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.15)' }}
            className="group bg-gradient-to-b from-[#0e1628]/70 to-[#070d1d]/80 hover:from-[#121e37]/80 hover:to-[#0d1328]/85 border border-white/[0.08] hover:border-white/18 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-cyan-100 transition-colors">
                  {exp.role}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{exp.organization}</p>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-slate-400 gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400/70" />
                  <span>{exp.period}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-5">
              {exp.description.en}
            </p>

            <ul className="space-y-2.5">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-400">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="mt-0.5 shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </motion.div>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}