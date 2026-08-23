'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Layers, HardDrive, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AssetOptimizerPage() {
  const [textureCount, setTextureCount] = useState(24);
  const [avgTextureRes, setAvgTextureRes] = useState<'16x' | '32x' | '64x' | '128x'>('16x');
  const [audioSeconds, setAudioSeconds] = useState(45);
  const [scriptLines, setScriptLines] = useState(850);

  // Calculations
  const resBytes = { '16x': 1024, '32x': 4096, '64x': 16384, '128x': 65536 }[avgTextureRes];
  const textureMemoryBytes = textureCount * resBytes * 4; // 32-bit RGBA in VRAM
  const audioMemoryBytes = audioSeconds * 44100 * 2 * 2; // 44.1kHz 16-bit stereo PCM uncompressed in memory
  const scriptMemoryBytes = scriptLines * 120; // approximate AST & scope overhead

  const totalVramMB = (textureMemoryBytes / (1024 * 1024)).toFixed(2);
  const totalAudioMB = (audioMemoryBytes / (1024 * 1024)).toFixed(2);
  const totalScriptMB = (scriptMemoryBytes / (1024 * 1024)).toFixed(2);
  const totalEstMemoryMB = ((textureMemoryBytes + audioMemoryBytes + scriptMemoryBytes) / (1024 * 1024)).toFixed(2);

  const isOptimal = parseFloat(totalEstMemoryMB) < 15.0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Pack Asset & Memory Optimizer"
        category="Minecraft Tools"
        badge="VRAM Budget"
        description="Estimate add-on memory consumption, texture VRAM allocations, and audio buffer weight for Minecraft Bedrock mobile & console performance."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Form (Left 6 cols) */}
        <div className="lg:col-span-6 glass-panel-elevated p-6 rounded-3xl border-white/10 space-y-5">
          <h3 className="text-base font-bold text-white mb-2">Asset Parameters</h3>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1.5">
              <span>Texture Count</span>
              <span className="font-mono text-cyan-400 font-bold">{textureCount} items/blocks</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={textureCount}
              onChange={(e) => setTextureCount(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Texture Resolution (PNG)</label>
            <div className="grid grid-cols-4 gap-2">
              {(['16x', '32x', '64x', '128x'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => setAvgTextureRes(res)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    avgTextureRes === res
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1.5">
              <span>Custom Audio Length (OGG)</span>
              <span className="font-mono text-blue-400 font-bold">{audioSeconds}s total</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={audioSeconds}
              onChange={(e) => setAudioSeconds(parseInt(e.target.value, 10))}
              className="w-full accent-blue-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1.5">
              <span>Script Lines (@minecraft/server)</span>
              <span className="font-mono text-purple-400 font-bold">{scriptLines} lines</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={scriptLines}
              onChange={(e) => setScriptLines(parseInt(e.target.value, 10))}
              className="w-full accent-purple-400"
            />
          </div>
        </div>

        {/* Results Card (Right 6 cols) */}
        <div className="lg:col-span-6 glass-panel-elevated p-6 sm:p-8 rounded-3xl border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Estimated Memory Footprint</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                isOptimal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {isOptimal ? 'Mobile Optimized' : 'Heavy Add-on'}
            </span>
          </div>

          <div className="text-center py-4">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
              {totalEstMemoryMB} <span className="text-xl text-cyan-400 font-sans">MB</span>
            </span>
            <p className="text-xs text-zinc-400 mt-2">Predicted in-game runtime heap & VRAM allocation</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
              <span className="text-zinc-300">Texture VRAM ({avgTextureRes})</span>
              <span className="font-mono font-bold text-cyan-300">{totalVramMB} MB</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
              <span className="text-zinc-300">Audio Buffers</span>
              <span className="font-mono font-bold text-blue-300">{totalAudioMB} MB</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
              <span className="text-zinc-300">Script Engine Memory</span>
              <span className="font-mono font-bold text-purple-300">{totalScriptMB} MB</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-zinc-300 leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Recommendation:</strong> Keep vanilla texture resolutions at 16x to ensure compatibility with 2GB RAM mobile devices and low-tier Realm servers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
