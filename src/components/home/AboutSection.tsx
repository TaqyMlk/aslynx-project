'use client';

import React from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const philosophies = [
    { title: 'Precision Prompt Engineering', desc: 'Treating AI instructions as rigorous system specifications with clear boundaries and reliable outputs.' },
    { title: 'Minecraft Bedrock Systems', desc: 'Building performant Script API systems, gameplay mechanics, and practical multiplayer add-ons.' },
    { title: 'Modern Web Interfaces', desc: 'Crafting responsive Next.js experiences with focused interaction, accessible UI, and refined visual systems.' }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-[#0f1219] w-full md:w-5/12 p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-6"><User className="w-8 h-8" /></div>
          <h3 className="text-2xl font-bold text-white mb-2">Muhammad Abdulhadi Taqy</h3>
          <p className="text-sm font-medium text-neutral-300 mb-4">Known as AsLynx</p>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">Developer and AI practitioner focused on AI tooling, Minecraft Bedrock systems, and modern web applications.</p>
          <div className="space-y-2.5 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs"><span className="text-neutral-500">Primary Domain</span><span className="text-white font-medium">AI & Bedrock Systems</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-neutral-500">Downloads</span><span className="text-neutral-200 font-medium">350,000+</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-neutral-500">Location</span><span className="text-white font-medium">Indonesia · Remote</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-full md:w-7/12 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2"><Sparkles className="w-3.5 h-3.5" />Core Philosophy</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Engineering with Purpose, Craftsmanship & Depth</h2>
          </div>
          <div className="space-y-4">
            {philosophies.map((item) => <div key={item.title} className="bg-[#0f1219] p-5 rounded-2xl flex gap-4 items-start hover:bg-white/[0.03] transition-colors"><div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4" /></div><div><h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4><p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p></div></div>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
