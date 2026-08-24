'use client';

import React, { useState, useMemo } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Binary, Check, Copy, AlertCircle } from 'lucide-react';

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('lynx:([a-z_]+)_v([0-9]+)');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('Active addons:\n- lynx:quality_tools_v2\n- lynx:simple_treecapitator_v3\n- minecraft:zombie_v1\n- lynx:vein_miner_v2');
  const [copied, setCopied] = useState(false);

  const { matches, error } = useMemo(() => {
    try {
      if (!pattern) return { matches: [], error: null };
      const regex = new RegExp(pattern, flags);
      const results: { match: string; index: number; groups: string[] }[] = [];

      let match: RegExpExecArray | null;
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({ match: match[0], index: match.index, groups: match.slice(1) });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) results.push({ match: match[0], index: match.index, groups: match.slice(1) });
      }

      return { matches: results, error: null };
    } catch (err: unknown) {
      return { matches: [], error: err instanceof Error ? err.message : String(err) };
    }
  }, [pattern, flags, testString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Regex Tester & Inspector"
        category="Utilities"
        description="Test regular expressions in real-time with capture group extraction, flags configuration, and match breakdown."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-neutral-500 text-sm">/</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regular expression pattern..." className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/8 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-neutral-500 text-sm">/</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-neutral-400 font-mono">Flags:</span>
            <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g, i, m" className="w-20 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-cyan-400 font-mono text-xs text-center focus:outline-none focus:border-cyan-400 transition-colors" />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/15 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 space-y-3">
          <label htmlFor="regex-test-string" className="block text-xs font-semibold text-neutral-300">Test String</label>
          <textarea id="regex-test-string" rows={10} value={testString} onChange={(e) => setTestString(e.target.value)} className="w-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed" />
        </div>

        <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
            <span className="font-semibold text-white">Capture Results</span>
            <span className="font-mono text-cyan-400 font-bold">{matches.length} matches found</span>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {matches.length > 0 ? matches.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">Match #{idx + 1}</span>
                  <span className="text-neutral-500 text-[11px]">Index: {m.index}</span>
                </div>
                <div className="text-neutral-200 bg-black/40 p-2 rounded-lg border border-white/8 break-all">{m.match}</div>
                {m.groups.length > 0 && (
                  <div className="pt-1 text-[11px] text-neutral-400 space-y-0.5">
                    {m.groups.map((g, gIdx) => (
                      <div key={gIdx} className="flex gap-2">
                        <span className="text-cyan-400 font-semibold">Group {gIdx + 1}:</span>
                        <span className="text-neutral-200">{g}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <span className="text-xs text-neutral-500 block py-6 text-center">No match captured with current pattern.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}