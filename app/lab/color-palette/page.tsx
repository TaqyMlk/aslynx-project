'use client';

import React, { useMemo, useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Palette, Copy, Check, AlertTriangle } from 'lucide-react';

const HEX_RE = /^#([0-9a-f]{6})$/i;

function hexToHsl(hex: string) {
  if (!HEX_RE.test(hex)) return { h: 0, s: 0, l: 0 };
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360 / 360;
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const lig = Math.min(100, Math.max(0, l)) / 100;
  if (sat === 0) {
    const v = Math.round(lig * 255);
    return [v, v, v];
  }
  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - lig * sat;
  const p = 2 * lig - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [
    Math.round(channel(hue + 1 / 3) * 255),
    Math.round(channel(hue) * 255),
    Math.round(channel(hue - 1 / 3) * 255)
  ];
}

function contrastRatio(rgbA: [number, number, number], rgbB: [number, number, number]): number {
  const luminance = ([r, g, b]: [number, number, number]) => {
    const lin = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };
  const la = luminance(rgbA);
  const lb = luminance(rgbB);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

interface ContrastCheck {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  onWhiteIsReadable: boolean;
}

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState('#00f2fe');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const validHex = HEX_RE.test(baseColor);
  const normalizedHex = validHex ? baseColor.toLowerCase() : '#000000';
  const hsl = hexToHsl(normalizedHex);

  const palette = useMemo(() => {
    if (!validHex) return [];
    return [
      { label: 'Base', hex: normalizedHex },
      { label: 'Complementary', hex: `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'Analogous 1', hex: `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'Analogous 2', hex: `hsl(${(hsl.h + 330) % 360}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'Triadic 1', hex: `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'Triadic 2', hex: `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)` }
    ];
  }, [validHex, normalizedHex, hsl.h, hsl.s, hsl.l]);

  const contrastChecks = useMemo<ContrastCheck[]>(() => {
    if (!validHex) return [];
    const siteBg: [number, number, number] = [9, 10, 14];
    return palette.map((item) => {
      const match = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(item.hex);
      const rgb: [number, number, number] = match
        ? hslToRgb(Number(match[1]), Number(match[2]), Number(match[3]))
        : [parseInt(normalizedHex.slice(1, 3), 16), parseInt(normalizedHex.slice(3, 5), 16), parseInt(normalizedHex.slice(5, 7), 16)];
      const ratioVsSiteBg = contrastRatio(rgb, siteBg);
      const ratioVsWhite = contrastRatio(rgb, [255, 255, 255]);
      return {
        ratio: ratioVsSiteBg,
        aaNormal: ratioVsSiteBg >= 4.5,
        aaLarge: ratioVsSiteBg >= 3,
        aaaNormal: ratioVsSiteBg >= 7,
        onWhiteIsReadable: ratioVsWhite >= 4.5
      };
    });
  }, [palette, validHex, normalizedHex]);

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
        description="Generate mathematical color harmonies (Analogous, Complementary, Triadic) with real WCAG 2.1 contrast ratios against the site's dark background."
      />

      <div className="bg-[#020617] p-6 rounded-2xl border border-white/8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <input type="color" aria-label="Pick base color" value={validHex ? baseColor : '#000000'} onChange={(e) => setBaseColor(e.target.value)} className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-0" />
          <div>
            <label htmlFor="base-hex" className="text-xs text-neutral-400 block mb-0.5">Base Color HEX</label>
            <input id="base-hex" type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} maxLength={7} spellCheck={false} aria-invalid={!validHex} className={`px-3 py-1.5 rounded-xl bg-black/40 border text-white font-mono text-sm uppercase focus:outline-none focus:border-cyan-400 transition-colors ${validHex ? 'border-white/8' : 'border-rose-400/60'}`} />
            {!validHex && <p role="alert" className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-300"><AlertTriangle className="w-3 h-3" /> Use a 6-digit hex like #00f2fe.</p>}
          </div>
        </div>

        <div className="text-xs text-neutral-400 font-mono">HSL: {validHex ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '—'}</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {palette.map((item, idx) => (
          <div key={idx} className="bg-white/[0.03] hover:bg-white/[0.06] p-3 rounded-2xl border border-white/8 space-y-3 flex flex-col items-center text-center group transition-colors">
            <div className="w-full h-24 rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: item.hex }} />
            <div className="w-full">
              <span className="text-[11px] text-neutral-400 font-medium block truncate">{item.label}</span>
              <button type="button" onClick={() => handleCopyColor(item.hex, idx)} aria-label={`Copy ${item.label} color ${item.hex}`} className="mt-1 w-full py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-neutral-200 transition-colors flex items-center justify-center gap-1">
                {copiedIndex === idx ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy className="w-3 h-3" /><span>{item.hex}</span></>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {validHex && contrastChecks.length > 0 && (
        <section aria-labelledby="wcag-heading">
          <h2 id="wcag-heading" className="text-lg font-bold text-white mb-1">WCAG 2.1 Contrast Report</h2>
          <p className="text-xs text-neutral-500 mb-4">Ratios are computed against the site background (#090a0e). AA requires ≥ 4.5:1 normal text or ≥ 3:1 large text; AAA requires ≥ 7:1.</p>
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/[0.03] text-left text-neutral-400">
                  <th scope="col" className="px-4 py-2.5 font-medium">Swatch</th>
                  <th scope="col" className="px-4 py-2.5 font-medium text-right">Ratio</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">AA Normal</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">AA Large</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">AAA</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">On White</th>
                </tr>
              </thead>
              <tbody className="[&_td]:py-2.5 [&_td]:px-4 divide-y divide-white/5">
                {contrastChecks.map((check, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-neutral-300">{palette[idx].hex}</td>
                    <td className="text-right font-mono tabular-nums text-neutral-200">{check.ratio.toFixed(2)}:1</td>
                    <td><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${check.aaNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-500/15 text-neutral-500'}`}>{check.aaNormal ? 'PASS' : 'FAIL'}</span></td>
                    <td><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${check.aaLarge ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-500/15 text-neutral-500'}`}>{check.aaLarge ? 'PASS' : 'FAIL'}</span></td>
                    <td><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${check.aaaNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-500/15 text-neutral-500'}`}>{check.aaaNormal ? 'AAA' : '—'}</span></td>
                    <td className="text-neutral-500">{check.onWhiteIsReadable ? 'Readable' : 'Low'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}