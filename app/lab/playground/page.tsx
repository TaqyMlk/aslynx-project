'use client';

import React, { useRef, useEffect, useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { RotateCw, Play, Sparkles, Zap } from 'lucide-react';

export default function PlaygroundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(1);
  const [starCount, setStarCount] = useState(300);
  const [theme, setTheme] = useState<'cyan' | 'amber' | 'emerald'>('cyan');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 480);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 480;
    };
    window.addEventListener('resize', handleResize);

    const stars: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width
      });
    }

    const colors = {
      cyan: { hex: '#00f2fe', glow: 'rgba(0, 242, 254, 0.4)' },
      amber: { hex: '#facc15', glow: 'rgba(250, 204, 21, 0.4)' },
      emerald: { hex: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' }
    };

    const render = () => {
      ctx.fillStyle = 'rgba(9, 10, 15, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        star.z -= speed * 3;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = (1 - star.z / width) * 3;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, size), 0, Math.PI * 2);
          ctx.fillStyle = colors[theme].hex;
          ctx.shadowBlur = 8;
          ctx.shadowColor = colors[theme].glow;
          ctx.fill();
        }
      });

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed, starCount, theme]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Quantum Starlight Particle Nexus"
        category="Experiments"
        description="High-performance hardware-accelerated warp-speed starfield renderer with dynamic relativistic projection and spectral palette tuning."
      />

      <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 space-y-6">
        <div className="w-full h-[480px] bg-[#020617] rounded-2xl border border-white/8 overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-300">
              <span>Warp Speed</span>
              <span className="font-mono text-cyan-400 font-bold">{speed}x</span>
            </div>
            <input type="range" min="0.2" max="5" step="0.2" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-300">
              <span>Starfield Density</span>
              <span className="font-mono text-cyan-400 font-bold">{starCount}</span>
            </div>
            <input type="range" min="50" max="800" step="50" value={starCount} onChange={(e) => setStarCount(parseInt(e.target.value, 10))} className="w-full accent-cyan-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1.5">
            <span className="text-xs text-neutral-300 block">Spectral Color</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['cyan', 'amber', 'emerald'] as const).map((t) => (
                <button key={t} onClick={() => setTheme(t)} className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${theme === t ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-white/5 text-neutral-400 hover:text-white border border-white/8'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}