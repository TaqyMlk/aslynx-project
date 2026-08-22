'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { CheckSquare, Check, Copy, AlertCircle, Minimize2, Maximize2, Trash2 } from 'lucide-react';

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
        badge="Syntax & Format"
        description="Inspect, validate, prettify, and minify JSON schemas with line error tracking and node statistics."
        onReset={handleReset}
        onCopy={handleCopy}
        copied={copied}
      />

      {/* Action Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border-white/10 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => validateAndFormat(false)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Beautify / Format</span>
          </button>

          <button
            onClick={() => validateAndFormat(true)}
            className="px-3.5 py-1.5 rounded-xl glass-panel hover:glass-panel-elevated border border-white/10 text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify (Compact)</span>
          </button>
        </div>

        {stats && (
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>Keys: <strong className="text-white font-mono">{stats.keys}</strong></span>
            <span>•</span>
            <span>Size: <strong className="text-cyan-400 font-mono">{stats.sizeBytes} bytes</strong></span>
          </div>
        )}
      </div>

      {/* Editor & Feedback */}
      <div className="glass-panel-elevated p-6 rounded-3xl border-white/10 space-y-4">
        {error ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span><strong>Invalid JSON Syntax:</strong> {error}</span>
          </div>
        ) : (
          stats && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span><strong>Valid JSON Structure:</strong> Parsed cleanly with zero syntax warnings.</span>
            </div>
          )
        )}

        <textarea
          rows={16}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste raw JSON here to validate and format..."
          className="w-full p-4 font-mono text-xs text-zinc-200 bg-black/60 border border-white/10 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
