'use client';

import React from 'react';
import { motion } from 'motion/react';
import { User, Cpu, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const philosophies = [
    {
      title: 'Precision Prompt Engineering',
      desc: 'Treating LLM system prompts as rigorous software specifications with strict boundary constraints and zero ambiguity.'
    },
    {
      title: 'Zero-Lag Minecraft Bedrock Systems',
      desc: 'Optimizing @minecraft/server Script API tick loops and memory structures so survival gameplay remains 60fps on all devices.'
    },
    {
      title: 'Modern Reactive Web Interfaces',
      desc: 'Crafting responsive Next.js and Tailwind experiences that pair instant interactivity with aesthetic dark matte glass surfaces.'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Left: About Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#0e1017] p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border border-white/10 flex items-center justify-center text-cyan-400 mb-6">
            <User className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Muhammad Abdulhadi Taqy</h3>
          <p className="text-sm font-medium text-cyan-400 mb-4">Known as AsLynx</p>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
            A developer and creator passionate about the intersection of AI prompt engineering, Minecraft Bedrock scripting, and modern web application design. Focused on building tools and add-ons that deliver real, measurable utility.
          </p>

          <div className="space-y-2.5 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Primary Domain</span>
              <span className="text-white font-medium">AI & Bedrock Modding</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Downloads</span>
              <span className="text-emerald-400 font-medium">350,000+</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Location</span>
              <span className="text-white font-medium">Indonesia (Remote)</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Core Pillars & Philosophy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-7/12 space-y-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineering with Purpose, Craftsmanship & Depth
            </h2>
          </div>

          <div className="space-y-4">
            {philosophies.map((item, idx) => (
              <div key={idx} className="bg-[#12141c] hover:bg-[#181b25] p-5 rounded-2xl border border-white/5 flex gap-4 items-start transition-colors">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
