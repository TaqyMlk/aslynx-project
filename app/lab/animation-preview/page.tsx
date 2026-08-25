'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Sparkles, Play, Copy, Check } from 'lucide-react';

export default function AnimationPreviewPage() {
  const [duration, setDuration] = useState(1.0);
  const [easing, setEasing] = useState<'ease' | 'linear' | 'ease-in-out' | 'cubic-bezier(0.16, 1, 0.3, 1)'>('cubic-bezier(0.16, 1, 0.3, 1)');
  const [animKey, setAnimKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const triggerAnimation = () => {
    setAnimKey((prev) => prev + 1);
  };

  const cssCode = `transition: all ${duration}s ${easing};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="CSS & Spring Animation Studio"
        category="Utilities"
        description="Preview easing curves, custom cubic-bezier timing functions, and spring transition dynamics in real time."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        <div className="lg:col-span-5 bg-[#020617] p-6 rounded-2xl border border-white/8 space-y-5">
          <h3 className="text-base font-bold text-white tracking-tight">Motion Parameters</h3>

          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1.5">
              <span>Duration</span>
              <span className="font-mono text-cyan-400 font-bold">{duration}s</span>
            </div>
            <input type="range" min="0.2" max="3.0" step="0.1" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Easing Curve</label>
            <div className="space-y-2">
              {[
                { label: 'iOS Spring (0.16, 1, 0.3, 1)', val: 'cubic-bezier(0.16, 1, 0.3, 1)' as const },
                { label: 'Standard Ease-in-out', val: 'ease-in-out' as const },
                { label: 'Standard Ease', val: 'ease' as const },
                { label: 'Linear', val: 'linear' as const }
              ].map((item) => (
                <button key={item.val} onClick={() => setEasing(item.val)} className={`w-full py-2 px-3 rounded-lg text-left text-xs font-mono transition-all ${easing === item.val ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-white/5 text-neutral-400 hover:text-white border border-white/8'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={triggerAnimation} className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-900 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Replay Animation</span>
          </button>
        </div>

        <div className="lg:col-span-7 bg-[#020617] p-8 rounded-2xl border border-white/8 flex flex-col items-center justify-center min-h-[360px] relative">
          <div className="w-full h-40 flex items-center justify-center relative">
            <div key={animKey} className="w-24 h-24 rounded-2xl bg-cyan-400 flex items-center justify-center text-neutral-900 font-bold text-xs" style={{ animation: `bounceExample ${duration}s ${easing} infinite alternate` }}>
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <style>{`
            @keyframes bounceExample {
              0% { transform: scale(0.6) rotate(-15deg) translateY(20px); opacity: 0.5; }
              100% { transform: scale(1.15) rotate(15deg) translateY(-20px); opacity: 1; }
            }
          `}</style>

          <div className="mt-8 w-full p-3 rounded-xl bg-black/60 border border-white/8 text-center font-mono text-xs text-cyan-400">
            {cssCode}
          </div>
        </div>
      </div>
    </div>
  );
}