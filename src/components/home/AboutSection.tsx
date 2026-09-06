'use client';

import { User, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const philosophies = [
    { title: 'Precision Prompt Engineering', desc: 'Treating AI instructions as rigorous system specifications with clear boundaries and reliable outputs.' },
    { title: 'Minecraft Bedrock Systems', desc: 'Building performant Script API systems, gameplay mechanics, and practical multiplayer add-ons.' },
    { title: 'Modern Web Interfaces', desc: 'Crafting responsive Next.js experiences with focused interaction, accessible UI, and refined visual systems.' }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-5/12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="w-12 h-12 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white mb-4">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Muhammad Abdulhadi Taqy</h3>
          <p className="text-sm text-slate-400 mb-4">Known as AsLynx</p>
          <p className="text-sm text-slate-500 mb-6">Developer and AI practitioner focused on AI tooling, Minecraft Bedrock systems, and modern web applications.</p>
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Primary Domain</span>
              <span className="text-white font-medium">AI & Bedrock Systems</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Downloads</span>
              <span className="text-white font-medium">350,000+</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Location</span>
              <span className="text-white font-medium">Indonesia · Remote</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-7/12 space-y-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-2 block">Core Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Engineering with purpose, craftsmanship, and depth</h2>
          </div>
          <div className="space-y-3">
            {philosophies.map((item) => (
              <div key={item.title} className="bg-slate-900/40 p-5 rounded-2xl flex gap-4 items-start border border-white/5">
                <div className="w-5 h-5 rounded border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}