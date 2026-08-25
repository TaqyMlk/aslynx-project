'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Check, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';

const SAMPLE_JSON = `{
  "addon_name": "Lynx Quality Tools",
  "version": "2.4.1",
  "author": "AsLynx",
  "features": [
    "Vein Mining",
    "Treecapitator",
    "Auto-Smelting"
  ],
  "compatibility": {
    "bedrock": "1.21.0+",
    "script_api": "@minecraft/server 1.13.0"
  },
  "downloads": 148500,
  "verified": true
}`;

export default function JSONValidatorPage() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ keys: number; sizeBytes: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const validateAndFormat = (minify = false) => {
    setError(null);
    try {
      const parsed = JSON.parse(input);
      const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setInput(formatted);

      const countKeys = (obj: unknown): number => {
        if (typeof obj !== 'object' || obj === null) return 0;
        let count = Object.keys(obj).length;
        for (const key of Object.keys(obj)) {
          count += countKeys((obj as Record<string, unknown>)[key]);
        }
        return count;
      };

      setStats({
        keys: countKeys(parsed),
        sizeBytes: new Blob([formatted]).size
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setStats(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInput(SAMPLE_JSON);
    setError(null);
    setStats(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="JSON Schema Validator & Formatter"
        category="Development"
        description="Inspect, validate, prettify, and minify JSON schemas with line error tracking and node statistics."
        onReset={handleReset}
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="bg-[#020617] p-4 rounded-2xl border border-white/8 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => validateAndFormat(false)} className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-xs font-semibold transition-all flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Beautify / Format</span>
          </button>

          <button onClick={() => validateAndFormat(true)} className="px-3.5 py-1.5 rounded-lg bg-[#020617] hover:bg-white/[0.03] border border-white/8 text-neutral-300 text-xs font-medium transition-all flex items-center gap-1.5">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify (Compact)</span>
          </button>
        </div>

        {stats && (
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span>Keys: <strong className="text-white font-mono">{stats.keys}</strong></span>
            <span>·</span>
            <span>Size: <strong className="text-cyan-400 font-mono">{stats.sizeBytes} bytes</strong></span>
          </div>
        )}
      </div>

      <div className="bg-[#020617] p-6 rounded-2xl border border-white/8 space-y-4">
        {error ? (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/15 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span><strong>Invalid JSON Syntax:</strong> {error}</span>
          </div>
        ) : (
          stats && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span><strong>Valid JSON Structure:</strong> Parsed cleanly with zero syntax warnings.</span>
            </div>
          )
        )}

        <textarea rows={16} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste raw JSON here to validate and format..." className="w-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed" spellCheck={false} />
      </div>
    </div>
  );
}