'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Copy, Check, ShieldCheck, Gauge, Code2, RotateCcw, Zap } from 'lucide-react';

export default function AILitePage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'general' | 'coding'>('coding');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<{ provider: string; model: string; latencyMs: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    ['Bedrock Vein Miner Script', 'Write a zero-lag Minecraft Bedrock Script API (@minecraft/server) script that detects and mines connected iron ore blocks when broken with an iron pickaxe.'],
    ['Treecapitator', 'Create a Minecraft Bedrock script that breaks log blocks above a harvested tree trunk and automatically places a sapling on the ground.'],
    ['System Prompt', 'Draft a strict system prompt for a TypeScript code generation agent enforcing strict types, no placeholder code, and error handling.'],
    ['Next.js API Route', 'Create a clean Next.js 15 App Router route handler in TypeScript that fetches external JSON data with a 10-minute cache.']
  ];

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || prompt;
    if (!text.trim() || loading) return;
    setLoading(true); setResponse(null); setTelemetry(null);
    try {
      const res = await fetch('/api/ai-lite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: text, mode }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate response');
      setResponse(data.text);
      setTelemetry({ provider: data.provider || 'AI', model: data.model || 'Default', latencyMs: data.latencyMs || 0 });
    } catch (err) { setResponse(`Error: ${err instanceof Error ? err.message : String(err)}`); }
    finally { setLoading(false); }
  };

  const copy = async () => { if (!response) return; await navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const reset = () => { setPrompt(''); setResponse(null); setTelemetry(null); };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24">
      <section className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cyan-400 mb-2"><Bot className="w-3.5 h-3.5" /> AI & Prompts</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Lite</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl">Fast stateless AI with multi-provider fallback. Built for coding and technical queries.</p>
        </div>
        <button onClick={reset} aria-label="Reset" className="shrink-0 w-9 h-9 rounded-xl glass-panel border-white/10 text-zinc-400 hover:text-white flex items-center justify-center"><RotateCcw className="w-4 h-4" /></button>
      </section>

      <section className="glass-panel rounded-2xl border-white/10 p-2 mb-5 flex flex-col sm:flex-row gap-2">
        <button onClick={() => setMode('coding')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${mode === 'coding' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><Code2 className="w-4 h-4" /> Coding Specialist</button>
        <button onClick={() => setMode('general')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${mode === 'general' ? 'bg-blue-500/15 text-blue-300 border border-blue-400/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><Bot className="w-4 h-4" /> General Knowledge</button>
      </section>

      <section className="mb-5">
        <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-zinc-500"><Zap className="w-3 h-3" /> Quick start</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map(([title, text]) => <button key={title} onClick={() => { setPrompt(text); handleSend(text); }} className="bg-[#12141c] hover:bg-[#181b25] rounded-xl border border-white/5 hover:border-white/10 p-3 text-left transition min-h-[72px]"><span className="block text-xs font-semibold text-zinc-200">{title}</span><span className="block mt-1 text-[10px] text-zinc-500 line-clamp-2">{text}</span></button>)}
        </div>
      </section>

      <section className="glass-panel-elevated rounded-2xl border-white/10 p-3 sm:p-4 sticky bottom-3 z-20 backdrop-blur-xl">
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} placeholder="Ask anything technical..." className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none px-2 py-1" />
        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2"><span className="text-[10px] text-zinc-600">{prompt.length} chars · Stateless</span><button onClick={() => handleSend()} disabled={loading || !prompt.trim()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-bold disabled:opacity-40">{loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {loading ? 'Thinking' : 'Send'}</button></div>
      </section>

      {response && <section className="mt-5 bg-[#12141c] rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/5 bg-black/10">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span className="text-zinc-200">Response</span>{telemetry && <><span>·</span><span>{telemetry.provider} / {telemetry.model}</span><Gauge className="w-3 h-3" /><span>{telemetry.latencyMs}ms</span></>}</div>
          <button onClick={copy} className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white">{copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <pre className="p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap break-words overflow-x-auto max-h-[65vh] overflow-y-auto font-mono">{response}</pre>
      </section>}
    </main>
  );
}
