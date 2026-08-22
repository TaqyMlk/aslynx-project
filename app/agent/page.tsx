'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Database, Search, Code2, Calendar, Sparkles, Zap, ShieldCheck, RotateCcw } from 'lucide-react';
import { AgentMessage } from '@/src/types';

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('auto');
  const [memoryStats, setMemoryStats] = useState({ totalMessages: 0, engine: 'In-Memory' });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => {
    fetch('/api/agent/chat').then(r => r.json()).then(data => {
      if (data.history) { setMessages(data.history); setMemoryStats({ totalMessages: data.history.length, engine: 'Persistent Memory' }); }
    }).catch(() => {});
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim(); setInput(''); setLoading(true);
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() }]);
    try {
      const res = await fetch('/api/agent/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, mode: 'general', provider }) });
      const data = await res.json();
      if (!res.ok || !data.message) throw new Error(data.error || 'Unknown response failure');
      setMessages(prev => [...prev, data.message]); setMemoryStats(prev => ({ ...prev, totalMessages: prev.totalMessages + 2 }));
    } catch (err) {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: `Error: ${err instanceof Error ? err.message : String(err)}`, timestamp: Date.now() }]);
    } finally { setLoading(false); }
  };

  const clear = async () => { try { await fetch('/api/agent/chat', { method: 'DELETE' }); } finally { setMessages([]); setMemoryStats(prev => ({ ...prev, totalMessages: 0 })); } };

  return (
    <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-24 sm:pt-32 pb-[calc(6rem+env(safe-area-inset-bottom))] h-[100dvh] flex flex-col">
      <header className="flex items-center justify-between gap-3 mb-4 shrink-0">
        <div className="min-w-0"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cyan-400 mb-1"><Bot className="w-3.5 h-3.5" /> Private AI</div><h1 className="text-xl sm:text-2xl font-bold text-white truncate">Lynx Agent</h1><p className="text-[11px] text-zinc-500 mt-0.5">Persistent memory · developer tools</p></div>
        <div className="flex items-center gap-1.5 shrink-0"><div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-panel border-white/10 text-[10px] text-zinc-400"><Database className="w-3 h-3 text-purple-400" /> {memoryStats.totalMessages} messages</div><button onClick={clear} aria-label="Clear memory" className="w-9 h-9 rounded-xl glass-panel border-white/10 text-zinc-400 hover:text-rose-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button></div>
      </header>

      <section className="glass-panel rounded-2xl border-white/10 p-2 mb-3 flex flex-col sm:flex-row gap-2 shrink-0">
        <select value={provider} onChange={e => setProvider(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"><option value="auto">Auto · Smart Fallback</option><option value="gemini">Gemini</option><option value="openrouter">OpenRouter</option><option value="groq">Groq</option></select>
        <div className="flex items-center justify-center gap-3 px-2 text-[10px] text-zinc-500"><span className="flex items-center gap-1"><Search className="w-3 h-3 text-cyan-400" /> Web</span><span className="flex items-center gap-1"><Code2 className="w-3 h-3 text-blue-400" /> Code</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-purple-400" /> Time</span></div>
      </section>

      <section className="flex-1 min-h-0 glass-panel-elevated rounded-2xl border-white/10 overflow-y-auto px-3 py-4 sm:p-5 space-y-4 overscroll-contain">
        {messages.length === 0 ? <div className="h-full flex items-center justify-center"><div className="max-w-sm text-center"><div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400"><Bot className="w-6 h-6" /></div><h2 className="mt-3 text-sm font-semibold text-white">Lynx Agent Ready</h2><p className="mt-1 text-[11px] leading-relaxed text-zinc-500">Private assistant with persistent memory and developer-focused tools.</p></div></div> : messages.map(msg => <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className="max-w-[92%] sm:max-w-[78%]"><div className="px-1 mb-1 text-[9px] text-zinc-600">{msg.role === 'user' ? 'You' : 'Lynx Agent'} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div><div className={`px-3.5 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm' : 'bg-black/35 border border-white/10 text-zinc-200 rounded-tl-sm'}`}>{msg.content}{msg.toolCalls?.length ? <div className="mt-3 pt-2 border-t border-white/10 space-y-1"><div className="text-[9px] uppercase tracking-wider text-cyan-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Tools</div>{msg.toolCalls.map((tc, i) => <div key={i} className="rounded-lg bg-black/30 p-2 text-[9px] text-zinc-500 font-mono overflow-x-auto">{tc.name}</div>)}</div> : null}</div></div></div>)}
        {loading && <div className="flex items-center gap-2 text-[10px] text-zinc-500 px-1"><Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Lynx Agent is thinking…</div>}
        <div ref={endRef} />
      </section>

      <section className="mt-3 glass-panel-elevated rounded-2xl border-white/10 p-2 shrink-0 sticky bottom-2 backdrop-blur-xl">
        <div className="flex items-end gap-2"><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} placeholder="Message Lynx Agent…" className="flex-1 min-h-10 max-h-28 resize-none bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none" /><button onClick={send} disabled={loading || !input.trim()} aria-label="Send message" className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black flex items-center justify-center disabled:opacity-40">{loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button></div>
        <div className="px-2 pt-1 text-[9px] text-zinc-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Private session · memory enabled</div>
      </section>
    </main>
  );
}
