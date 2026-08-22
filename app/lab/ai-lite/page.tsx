'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Bot, Send, Sparkles, Terminal, Trash2, Copy, Check, ShieldCheck, Gauge, Code2 } from 'lucide-react';

export default function AILitePage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'general' | 'coding'>('coding');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<{ provider: string; model: string; latencyMs: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    { title: 'Bedrock Vein Miner Script', text: 'Write a zero-lag Minecraft Bedrock Script API (@minecraft/server) script that detects and mines connected iron ore blocks when broken with an iron pickaxe.' },
    { title: 'Treecapitator with Auto-Replant', text: 'Create a Minecraft Bedrock script that breaks log blocks above a harvested tree trunk and automatically places a sapling on the ground.' },
    { title: 'System Prompt Architecture', text: 'Draft a bulletproof system prompt for a TypeScript code generation agent enforcing strict types, no placeholder code, and error handling.' },
    { title: 'Next.js API Route with Cache', text: 'Create a clean Next.js 15 App Router route handler in TypeScript that fetches external JSON data with a 10-minute in-memory cache.' }
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    setTelemetry(null);

    try {
      const res = await fetch('/api/ai-lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, mode })
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.text);
        setTelemetry({
          provider: data.provider || 'AI Provider',
          model: data.model || 'Default',
          latencyMs: data.latencyMs || 0
        });
      } else {
        setResponse(`Error: ${data.error || 'Failed to generate response'}`);
      }
    } catch (err: unknown) {
      setResponse(`Request Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrompt('');
    setResponse(null);
    setTelemetry(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="AI Lite"
        category="AI & Prompts"
        badge="Strict Stateless"
        description="Fresh, zero-retention AI chat engine with automatic multi-provider fallback (Gemini, OpenRouter, Groq) and specialized coding mode."
        onReset={handleReset}
        onCopy={response ? handleCopy : undefined}
        copied={copied}
      />

      {/* Mode Selector & Stateless Badge */}
      <div className="glass-panel p-4 rounded-2xl border-white/10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('coding')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'coding'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Coding Specialist</span>
          </button>
          <button
            onClick={() => setMode('general')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'general'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>General Knowledge</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero memory leakage • Fresh every query</span>
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="mb-6 space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Starter Presets:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.text);
                handleSend(p.text);
              }}
              className="glass-panel hover:glass-panel-elevated p-3 rounded-xl border-white/5 hover:border-white/15 text-left text-xs transition-all group"
            >
              <span className="font-semibold text-white group-hover:text-cyan-300 block mb-0.5">{p.title}</span>
              <span className="text-zinc-500 line-clamp-1">{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-panel-elevated p-4 rounded-3xl border-white/10 mb-6 space-y-3">
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a technical coding question, request a Bedrock script, or test a prompt structure..."
          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-zinc-500">{prompt.length} characters</span>

          <button
            onClick={() => handleSend()}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Processing...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* Response Panel */}
      {response && (
        <div className="glass-panel-elevated p-6 rounded-3xl border-white/10 space-y-4 animate-fadeIn">
          {/* Telemetry Bar */}
          {telemetry && (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-mono font-medium">
                  {telemetry.provider} ({telemetry.model})
                </span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{telemetry.latencyMs}ms</span>
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Output'}</span>
              </button>
            </div>
          )}

          <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-mono bg-black/40 p-4 rounded-2xl border border-white/5 overflow-x-auto max-h-[600px] overflow-y-auto">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}
