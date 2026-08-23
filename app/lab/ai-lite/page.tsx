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

  const handleSend = async () => {
    const text = prompt.trim();
    if (!text || loading) return;
    setLoading(true);
    setResponse(null);
    setTelemetry(null);
    try {
      const res = await fetch('/api/ai-lite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: text, mode }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate response');
      setResponse(data.text);
      setTelemetry({ provider: data.provider || 'AI', model: data.model || 'Default', latencyMs: data.latencyMs || 0 });
    } catch (err) {
      setResponse(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const reset = () => {
    setPrompt('');
    setResponse(null);
    setTelemetry(null);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-28">
      <section className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-cyan-300 mb-2"><Bot className="w-3.5 h-3.5" /> AI & prompts</div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">AI Lite</h1>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">Fast stateless AI with multi-provider fallback for coding and technical questions.</p>
        </div>
        <button onClick={reset} aria-label="Reset AI Lite" className="shrink-0 w-9 h-9 rounded-xl border border-white/10 bg-white/[0.035] text-zinc-500 hover:text-white hover:bg-white/[0.07] flex items-center justify-center transition-colors"><RotateCcw className="w-4 h-4" /></button>
      </section>

      <section aria-label="AI mode" className="bg-[#11131a] rounded-2xl border border-white/10 p-1.5 mb-6 flex flex-col sm:flex-row gap-1.5">
        <button onClick={() => setMode('coding')} aria-pressed={mode === 'coding'} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === 'coding' ? 'bg-white/[0.08] text-cyan-200 border border-white/10' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.035]'}`}><Code2 className="w-4 h-4" /> Coding Specialist</button>
        <button onClick={() => setMode('general')} aria-pressed={mode === 'general'} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === 'general' ? 'bg-white/[0.08] text-blue-200 border border-white/10' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.035]'}`}><Bot className="w-4 h-4" /> General Knowledge</button>
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-2.5 text-[11px] uppercase tracking-[0.14em] text-zinc-600"><Zap className="w-3 h-3" /> Start with a template</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map(([title, text]) => (
            <button key={title} type="button" onClick={() => setPrompt(text)} className="bg-[#14171f] hover:bg-[#191d27] rounded-xl border border-white/[0.07] hover:border-white/[0.13] p-3.5 text-left transition-colors min-h-[84px]">
              <span className="block text-sm font-medium text-zinc-200">{title}</span>
              <span className="block mt-1 text-xs leading-5 text-zinc-600 line-clamp-2">Loads the prompt into the editor. Review it before sending.</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-[#14171f] rounded-2xl border border-white/10 p-3 sm:p-4 sticky bottom-3 z-20 shadow-[0_18px_45px_-28px_rgba(0,0,0,.95)]">
        <label htmlFor="ai-lite-prompt" className="sr-only">AI prompt</label>
        <textarea id="ai-lite-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} rows={3} placeholder="Ask a technical question or paste a task..." className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none px-2 py-1.5 leading-6" />
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-2.5 mt-2">
          <span className="text-xs text-zinc-600">{prompt.length} chars · Stateless</span>
          <button onClick={handleSend} disabled={loading || !prompt.trim()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-300 text-[#071014] text-sm font-semibold hover:bg-cyan-200 active:bg-cyan-400 disabled:opacity-35 disabled:cursor-not-allowed transition-colors">{loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {loading ? 'Thinking' : 'Send'}</button>
        </div>
      </section>

      {response && <section className="mt-6 bg-[#14171f] rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2 text-xs text-zinc-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span className="text-zinc-300">Response</span>{telemetry && <><span>·</span><span>{telemetry.provider} / {telemetry.model}</span><Gauge className="w-3 h-3 ml-1" /><span>{telemetry.latencyMs}ms</span></>}</div>
          <button onClick={copy} className="flex items-center gap-1.5 min-h-8 px-2 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors">{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <pre className="p-4 sm:p-5 text-sm leading-6 text-zinc-200 whitespace-pre-wrap break-words overflow-x-auto max-h-[65vh] overflow-y-auto font-mono">{response}</pre>
      </section>}
    </main>
  );
}
