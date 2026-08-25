'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Bot, Send, Copy, Check, ShieldCheck, Gauge, Code2, RotateCcw, Trash2, Settings2, RefreshCw, Zap, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
}

type Provider = 'auto' | 'gemini' | 'openrouter' | 'groq';

const presets = [
  ['Bedrock Vein Miner Script', 'Write a zero-lag Minecraft Bedrock Script API (@minecraft/server) script that detects and mines connected iron ore blocks when broken with an iron pickaxe.'],
  ['Treecapitator', 'Create a Minecraft Bedrock script that breaks log blocks above a harvested tree trunk and automatically places a sapling on the ground.'],
  ['System Prompt', 'Draft a strict system prompt for a TypeScript code generation agent enforcing strict types, no placeholder code, and error handling.'],
  ['Next.js API Route', 'Create a clean Next.js 15 App Router route handler in TypeScript that fetches external JSON data with a 10-minute cache.']
] as const;

const providerLabels: Record<Provider, string> = { auto: 'Auto Router', gemini: 'Gemini', openrouter: 'OpenRouter', groq: 'Groq' };

export default function AILitePage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'general' | 'coding'>('coding');
  const [provider, setProvider] = useState<Provider>('auto');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lastAssistant = useMemo(() => [...messages].reverse().find((message) => message.role === 'assistant'), [messages]);

  const handleSend = async (override?: string) => {
    const text = (override ?? prompt).trim();
    if (!text || loading) return;
    setPrompt('');
    setLoading(true);
    setError(null);
    setLastPrompt(text);

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    const assistantId = `assistant-stream`;
    setMessages((m) => [...m, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/ai-lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          mode,
          preferredProvider: provider
        })
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({} as any));
        throw new Error(d?.error || 'Failed to generate response');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Stream unavailable');
      const decoder = new TextDecoder();
      let fullText = '';
      let streamProvider: string | undefined;
      let model: string | undefined;
      let latencyMs: number | undefined;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.type === 'token') {
              fullText += parsed.text;
              setMessages((current) => current.map((m) => m.id === assistantId ? { ...m, content: fullText } : m));
            } else if (parsed.type === 'done') {
              streamProvider = parsed.provider;
              model = parsed.model;
              latencyMs = parsed.latencyMs;
            } else if (parsed.type === 'error') {
              throw new Error(parsed.message || 'Stream error');
            }
          } catch { /* skip bad chunk */ }
        }
      }

      if (!fullText) throw new Error('Empty response');

      const finalMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fullText,
        provider: streamProvider,
        model,
        latencyMs
      };

      setMessages((current) => current.map((m) => m.id === assistantId ? finalMessage : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPrompt(text);
      setMessages((current) => current.filter((message) => message.id !== userMessage.id && message.id !== assistantId));
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  const copy = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError('Clipboard access is unavailable');
    }
  };

  const reset = () => {
    if (messages.length > 0 && !window.confirm('Clear this conversation? The chat history cannot be recovered.')) return;
    setPrompt('');
    setMessages([]);
    setError(null);
    setLastPrompt('');
    window.setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <main className="w-full min-h-[100dvh] bg-[#020617] text-white px-3 sm:px-6 pt-24 sm:pt-28 pb-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-[0.16em] text-cyan-400/80 mb-2 block font-medium">AI Lite</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Fast AI workspace</h1>
            <p className="mt-1.5 text-sm leading-6 text-neutral-400 max-w-2xl">A lightweight client-side conversation with selectable providers. The server remains stateless; this page keeps only the current chat.</p>
          </div>
          <button onClick={reset} aria-label="Clear AI Lite conversation" className="shrink-0 w-9 h-9 rounded-lg border border-white/10 bg-[#020617] text-neutral-500 hover:text-white hover:bg-[#020617] flex items-center justify-center transition-colors"><Trash2 className="w-4 h-4" /></button>
        </header>

        <section className="flex flex-col sm:flex-row gap-2 mb-5 p-1 rounded-xl border border-white/8 bg-[#020617]">
          <button onClick={() => setMode('coding')} aria-pressed={mode === 'coding'} className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all ${mode === 'coding' ? 'bg-[#020617] text-cyan-300 border border-white/10' : 'text-neutral-500 hover:text-neutral-300'}`}><Code2 className="w-4 h-4" /> Coding Specialist</button>
          <button onClick={() => setMode('general')} aria-pressed={mode === 'general'} className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all ${mode === 'general' ? 'bg-[#020617] text-neutral-200 border border-white/10' : 'text-neutral-500 hover:text-neutral-300'}`}><Bot className="w-4 h-4" /> General Knowledge</button>
        </section>

        <section className="mb-5 flex flex-wrap items-center gap-2">
          <div className="relative"><Settings2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400 pointer-events-none" /><select value={provider} onChange={(event) => setProvider(event.target.value as Provider)} aria-label="Preferred AI provider" className="h-9 pl-8 pr-7 rounded-lg bg-[#020617] border border-white/10 text-xs text-neutral-300 focus:outline-none focus:border-cyan-400/25"><option value="auto">Auto Router</option><option value="gemini">Gemini</option><option value="openrouter">OpenRouter</option><option value="groq">Groq</option></select></div>
          <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/8 bg-[#020617] text-[10px] text-neutral-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" /> Current chat only</span>
          {lastAssistant?.provider && <span className="text-[10px] text-neutral-500">Last: {lastAssistant.provider} · {lastAssistant.latencyMs ?? 0}ms</span>}
          <button onClick={() => lastPrompt && void handleSend(lastPrompt)} disabled={loading || !lastPrompt} className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/8 bg-[#020617] text-[10px] text-neutral-500 hover:text-neutral-300 disabled:opacity-30 transition-colors"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button>
        </section>

        {messages.length === 0 && <section className="mb-5"><div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500"><Zap className="w-3 h-3" /> Start with a template</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">{presets.map(([title, text]) => <button key={title} type="button" onClick={() => { setPrompt(text); window.setTimeout(() => inputRef.current?.focus(), 50); }} className="min-h-[94px] p-3.5 rounded-xl border border-white/8 bg-[#020617] hover:bg-[#020617] hover:border-white/12 text-left transition-colors"><span className="block text-xs font-medium text-neutral-300">{title}</span><span className="block mt-1 text-[11px] leading-5 text-neutral-500 line-clamp-3">{text}</span></button>)}</div></section>}

        {error && <div role="alert" className="mb-4 px-3 py-2.5 rounded-xl border border-rose-400/15 bg-rose-400/5 text-xs text-rose-200 flex items-center justify-between gap-3"><span className="min-w-0">{error}</span><button type="button" onClick={() => setError(null)} aria-label="Dismiss error" className="shrink-0 rounded p-1 hover:bg-white/10 transition-colors">×</button></div>}

        {messages.length > 0 && <section className="mb-5 space-y-5">{messages.map((message) => <article key={message.id} className="flex gap-3"><div className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center ${message.role === 'user' ? 'bg-white/[0.04] border-white/8 text-neutral-500' : 'bg-cyan-500/10 border-cyan-500/15 text-cyan-400'}`}>{message.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5 mb-1.5 text-[9px] text-neutral-500"><span>{message.role === 'user' ? 'You' : 'AI Lite'}</span>{message.provider && <><span>·</span><span>{message.provider}</span></>}{message.model && <><span>·</span><span className="hidden sm:inline">{message.model}</span></>}{message.latencyMs != null && <><span>·</span><Gauge className="w-2.5 h-2.5" /><span>{message.latencyMs}ms</span></>}</div><div className="rounded-xl border border-white/8 bg-[#020617] px-3.5 py-3 text-[13px] leading-6 text-neutral-200 whitespace-pre-wrap break-words">{message.content}</div>{message.role === 'assistant' && <button onClick={() => void copy(message)} className="mt-1 inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-[10px] text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] transition-colors">{copiedId === message.id ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>}</div></article>)}</section>}

        <section className="sticky bottom-[4.75rem] md:bottom-3 z-20 rounded-xl border border-white/10 bg-[#020617] focus-within:border-cyan-300/25 transition-colors">
          <textarea ref={inputRef} value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={handleKeyDown} rows={3} aria-label="AI Lite prompt" placeholder={mode === 'coding' ? 'Ask for code, debugging, architecture, or implementation help…' : 'Ask a question…'} className="w-full resize-none bg-transparent px-3.5 pt-3 pb-2 text-[13px] leading-6 text-white placeholder:text-neutral-600 focus:outline-none min-h-[78px] max-h-48" />
          <div className="flex items-center justify-between gap-3 border-t border-white/8 px-3 py-2"><span className="text-[10px] text-neutral-500">{prompt.length} chars · Enter to send · Shift+Enter newline</span><button onClick={() => void handleSend()} disabled={loading || !prompt.trim()} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-cyan-400 text-[#071014] text-xs font-bold hover:bg-cyan-300 disabled:opacity-30 disabled:pointer-events-none transition-colors">{loading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}{loading ? 'Working' : 'Send'}</button></div>
        </section>
      </div>
    </main>
  );
}