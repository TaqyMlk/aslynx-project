'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Palette, Copy, Check, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState('#00f2fe');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Derive palettes
  const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16) / 255;
      g = parseInt(hex.slice(3, 5), 16) / 255;
      b = parseInt(hex.slice(5, 7), 16) / 255;
    }
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hsl = hexToHsl(baseColor);

  const palette = [
    { label: 'Base', hex: baseColor },
    { label: 'Complementary', hex: `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'Analogous 1', hex: `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'Analogous 2', hex: `hsl(${(hsl.h + 330) % 360}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'Triadic 1', hex: `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'Triadic 2', hex: `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)` }
  ];

  const handleCopyColor = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Color Harmony & WCAG Contrast"
        category="Utilities"
        badge="Design Systems"
        description="Generate mathematical color harmonies (Analogous, Complementary, Triadic) and test dark background contrast ratios."
      />

      <div className="bg-[#12141c] p-6 rounded-2xl border border-white/10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-14 h-14 rounded-2xl cursor-pointer bg-transparent border-0"
          />
          <div>
            <span className="text-xs text-zinc-400 block mb-0.5">Base Color HEX</span>
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm uppercase focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%
        </div>
      </div>

      {/* Palette Swatches */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {palette.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel p-3 rounded-2xl border-white/5 space-y-3 flex flex-col items-center text-center group"
          >
            <div
              className="w-full h-24 rounded-xl shadow-md border border-white/10 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: item.hex }}
            />
            <div className="w-full">
              <span className="text-[11px] text-zinc-400 font-medium block truncate">{item.label}</span>
              <button
                onClick={() => handleCopyColor(item.hex, idx)}
                className="mt-1 w-full py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-zinc-200 transition-colors flex items-center justify-center gap-1"
              >
                {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === idx ? 'Copied' : item.hex}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
