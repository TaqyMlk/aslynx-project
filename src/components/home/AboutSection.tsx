'use client';

import { motion } from 'motion/react';
import { User, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const philosophies = [
    { title: 'Precision Prompt Engineering', desc: 'Treating AI instructions as rigorous system specifications with clear boundaries and reliable outputs.' },
    { title: 'Minecraft Bedrock Systems', desc: 'Building performant Script API systems, gameplay mechanics, and practical multiplayer add-ons.' },
    { title: 'Modern Web Interfaces', desc: 'Crafting responsive Next.js experiences with focused interaction, accessible UI, and refined visual systems.' }
  ];

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="w-full lg:w-5/12 bg-[#0f1219] p-6 sm:p-8 rounded-2xl border border-white/8">
          <div className="w-14 h-14 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-6"><User className="w-7 h-7" /></div>
          <h3 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Muhammad Abdulhadi Taqy</h3>
          <p className="text-sm font-medium text-neutral-300 mb-4">Known as AsLynx</p>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">Developer and AI practitioner focused on AI tooling, Minecraft Bedrock systems, and modern web applications.</p>
          <div className="space-y-2.5 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs"><span className="text-neutral-500">Primary Domain</span><span className="text-white font-medium">AI & Bedrock Systems</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-neutral-500">Downloads</span><span className="text-neutral-200 font-medium">350,000+</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-neutral-500">Location</span><span className="text-white font-medium">Indonesia · Remote</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="w-full lg:w-7/12 space-y-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-2 block">Core Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Engineering with Purpose, Craftsmanship & Depth</h2>
          </div>
          <div className="space-y-3">
            {philosophies.map((item, idx) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="bg-[#0f1219] p-5 rounded-2xl flex gap-4 items-start border border-white/8">
                <div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}