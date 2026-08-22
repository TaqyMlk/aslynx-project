'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgentMessage } from '@/src/types';
import {
  Bot, Send, Trash2, Database, Search, Code2, Calendar, Sparkles,
  Zap, ShieldCheck, Plus, Menu, X, Copy, Check, Settings2, ChevronDown,
  PanelLeft, RotateCcw, Clock3, Wrench, Brain, MessageSquare
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Analyze my current project architecture and suggest improvements.',
  'Create a Minecraft Bedrock Script API solution for a performance-sensitive feature.',
  'Explain the latest approach I should use for a Next.js App Router API.',
  'Remember that I prefer concise, production-ready code.'
];

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('auto');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [desktopSidebar, setDesktopSidebar] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memoryStats, setMemoryStats] = useState({ totalMessages: 0, engine: 'Persistent Memory' });
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => {
    fetch('/api/agent/chat')
      .then((r) => r.json())
      .then((data) => {
        if (data.history) {
          setMessages(data.history);
          setMemoryStats({ totalMessages: data.history.length, engine: 'Persistent Memory' });
        }
      })
      .catch(() => {});
  }, []);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter((m) => m.content.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setSearchOpen(false);

    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode: 'general', provider, enableTools: true })
      });
      const data = await res.json();
      if (!res.ok || !data.message) throw new Error(data.error || 'Unknown response failure');
      setMessages((prev) => [...prev, data.message]);
      setMemoryStats((prev) => ({ ...prev, totalMessages: prev.totalMessages + 2 }));
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clear = async () => {
    if (!window.confirm('Clear the current Agent memory and conversation?')) return;
    try { await fetch('/api/agent/chat', { method: 'DELETE' }); }
    finally {
      setMessages([]);
      setMemoryStats((prev) => ({ ...prev, totalMessages: 0 }));
    }
  };

  const copyMessage = async (message: AgentMessage) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const newChat = () => {
    setInput('');
    setSearchQuery('');
    setSearchOpen(false);
    inputRef.current?.focus();
  };

  return (
    <main className="fixed inset-0 md:static md:min-h-[100dvh] w-full bg-black/20 text-white overflow-hidden">
      <div className="mx-auto flex h-[100dvh] w-full max-w-[1600px] md:pt-20 md:px-4 md:pb-4 gap-3">
        {/* Desktop sidebar */}
        <aside className={`${desktopSidebar ? 'md:flex' : 'md:hidden'} hidden w-[260px] shrink-0 flex-col rounded-2xl border border-white/10 bg-black/35 backdrop-blur-2xl overflow-hidden`}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400"><Bot className="w-4 h-4" /></div><div><div className="text-sm font-semibold">Lynx Agent</div><div className="text-[9px] text-zinc-500">Private AI workspace</div></div></div>
            <button onClick={() => setDesktopSidebar(false)} className="w-7 h-7 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center"><PanelLeft className="w-3.5 h-3.5" /></button>
          </div>
          <div className="p-3 space-y-2">
            <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-xs font-medium transition"><Plus className="w-4 h-4" /> New conversation</button>
            <button onClick={() => setSearchOpen((v) => !v)} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-zinc-400 hover:text-white transition"><Search className="w-4 h-4" /> Search conversation</button>
          </div>
          <div className="px-3 pt-2 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Workspace</div>
          <div className="p-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/8 border border-cyan-400/10 text-xs text-zinc-200"><MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Current chat</div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-500"><Brain className="w-3.5 h-3.5 text-purple-400" /> Persistent memory</div>
          </div>
          <div className="mt-auto p-3 border-t border-white/5 space-y-2">
            <div className="rounded-xl bg-black/25 border border-white/5 p-3"><div className="text-[9px] text-zinc-600 uppercase tracking-wider">Memory</div><div className="mt-1 text-sm font-semibold">{memoryStats.totalMessages} messages</div><div className="mt-0.5 text-[9px] text-zinc-600">{memoryStats.engine}</div></div>
            <button onClick={clear} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-[10px] text-zinc-500 hover:text-rose-300 transition"><Trash2 className="w-3.5 h-3.5" /> Clear memory</button>
          </div>
        </aside>

        {!desktopSidebar && <button onClick={() => setDesktopSidebar(true)} className="hidden md:flex fixed left-5 top-24 z-40 w-9 h-9 rounded-xl glass-panel border-white/10 items-center justify-center text-zinc-400 hover:text-white"><PanelLeft className="w-4 h-4" /></button>}

        {/* Main app */}
        <section className="flex min-w-0 flex-1 flex-col rounded-none md:rounded-2xl border-x md:border border-white/10 bg-black/20 md:bg-black/25 backdrop-blur-2xl overflow-hidden">
          {/* Mobile / desktop app header */}
          <header className="shrink-0 h-14 md:h-16 flex items-center justify-between gap-2 px-3 sm:px-5 border-b border-white/5 bg-black/25 backdrop-blur-xl">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setMobileMenu(true)} className="md:hidden w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-400"><Menu className="w-4 h-4" /></button>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/15 hidden sm:flex items-center justify-center text-cyan-400"><Bot className="w-4 h-4" /></div>
              <div className="min-w-0"><div className="text-sm font-semibold truncate">Lynx Agent</div><div className="flex items-center gap-1 text-[9px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · Memory enabled</div></div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search" className="w-9 h-9 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center"><Search className="w-4 h-4" /></button>
              <button onClick={newChat} aria-label="New chat" className="hidden sm:flex w-9 h-9 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white items-center justify-center"><Plus className="w-4 h-4" /></button>
              <button onClick={clear} aria-label="Clear memory" className="w-9 h-9 rounded-xl hover:bg-rose-500/10 text-zinc-500 hover:text-rose-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          </header>

          {searchOpen && <div className="shrink-0 px-3 sm:px-5 py-2 border-b border-white/5 bg-black/20"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" /><input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messages..." className="w-full h-9 pl-9 pr-9 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400/40" /><button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-white"><X className="w-3.5 h-3.5" /></button></div></div>}

          {/* Capability / provider bar */}
          <div className="shrink-0 px-3 sm:px-5 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <div className="relative shrink-0"><Settings2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-400 pointer-events-none" /><select value={provider} onChange={(e) => setProvider(e.target.value)} className="h-8 pl-7 pr-7 rounded-lg bg-white/5 border border-white/8 text-[10px] text-zinc-300 focus:outline-none"><option value="auto">Auto Router</option><option value="gemini">Gemini</option><option value="openrouter">OpenRouter</option><option value="groq">Groq</option></select></div>
            <span className="h-5 w-px bg-white/10 shrink-0" />
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-500"><Search className="w-3 h-3 text-cyan-400" /> Web Search</span>
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-500"><Code2 className="w-3 h-3 text-blue-400" /> Code</span>
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-500"><Calendar className="w-3 h-3 text-purple-400" /> Time</span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-600"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Private</span>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-8 py-5 sm:py-7">
            <div className="mx-auto w-full max-w-3xl space-y-6">
              {filteredMessages.length === 0 ? (
                <div className="min-h-full flex items-center justify-center py-12 sm:py-24">
                  <div className="w-full max-w-xl text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400"><Bot className="w-7 h-7" /></div>
                    <h1 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight">How can Lynx help?</h1>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-500">Personal AI workspace with memory and developer-focused tools.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 text-left">
                      {QUICK_PROMPTS.map((q) => <button key={q} onClick={() => send(q)} className="p-3 rounded-xl border border-white/7 bg-white/[0.025] hover:bg-white/[0.06] hover:border-cyan-400/15 text-[10px] sm:text-xs text-zinc-400 hover:text-zinc-200 transition">{q}</button>)}
                    </div>
                  </div>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <article key={msg.id} className="group">
                    <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role !== 'user' && <div className="hidden sm:flex shrink-0 w-7 h-7 mt-1 rounded-lg bg-cyan-500/10 border border-cyan-400/15 items-center justify-center text-cyan-400"><Bot className="w-3.5 h-3.5" /></div>}
                      <div className={`min-w-0 max-w-[94%] sm:max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] text-zinc-600"><span>{msg.role === 'user' ? 'You' : 'Lynx Agent'}</span><span>·</span><Clock3 className="w-2.5 h-2.5" /><span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{msg.provider && <><span>·</span><span>{msg.provider}</span></>}</div>
                        <div className={`rounded-2xl px-3.5 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm' : 'bg-transparent text-zinc-200'}`}>{msg.content}
                          {msg.toolCalls?.length ? <div className="mt-3 pt-2 border-t border-white/8 space-y-1.5"><div className="text-[9px] uppercase tracking-wider text-cyan-400 flex items-center gap-1"><Wrench className="w-3 h-3" /> Tool activity</div>{msg.toolCalls.map((tc, i) => <div key={i} className="flex items-center gap-2 rounded-lg bg-black/25 border border-white/5 px-2 py-1.5 text-[9px] text-zinc-500 font-mono"><Zap className="w-3 h-3 text-cyan-400" />{tc.name}</div>)}</div> : null}
                        </div>
                        {msg.role === 'assistant' && <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition"><button onClick={() => copyMessage(msg)} className="px-2 py-1 rounded-lg hover:bg-white/5 text-[9px] text-zinc-600 hover:text-zinc-300 flex items-center gap-1">{copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copiedId === msg.id ? 'Copied' : 'Copy'}</button></div>}
                      </div>
                    </div>
                  </article>
                ))
              )}
              {loading && <div className="flex items-center gap-2 text-[10px] text-zinc-500"><div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /></div><span>Lynx is thinking…</span></div>}
              <div ref={endRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 px-3 sm:px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-black/45 to-transparent">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl p-2 focus-within:border-cyan-400/25 transition">
                <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} placeholder="Message Lynx Agent…" className="w-full max-h-32 min-h-11 resize-none bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none" />
                <div className="flex items-center justify-between gap-2 px-1 pt-1"><div className="flex items-center gap-1.5 text-[9px] text-zinc-600"><Brain className="w-3 h-3 text-purple-400" /><span className="hidden sm:inline">Memory enabled</span><span>·</span><span>Enter to send</span></div><button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message" className="w-9 h-9 sm:w-auto sm:px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black flex items-center justify-center gap-1.5 text-xs font-bold disabled:opacity-35 transition active:scale-95"><Send className="w-4 h-4" /><span className="hidden sm:inline">Send</span></button></div>
              </div>
              <div className="text-center text-[8px] text-zinc-700 mt-1.5">Lynx Agent can make mistakes. Verify important information.</div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile drawer */}
      {mobileMenu && <div className="fixed inset-0 z-[100] md:hidden"><button aria-label="Close menu" onClick={() => setMobileMenu(false)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" /><aside className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[320px] bg-[#0b0b0d] border-r border-white/10 shadow-2xl p-4 flex flex-col animate-slideIn"><div className="flex items-center justify-between pb-4 border-b border-white/5"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/15 flex items-center justify-center text-cyan-400"><Bot className="w-4 h-4" /></div><div><div className="text-sm font-semibold">Lynx Agent</div><div className="text-[9px] text-zinc-600">Private AI workspace</div></div></div><button onClick={() => setMobileMenu(false)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-500"><X className="w-4 h-4" /></button></div><button onClick={() => { newChat(); setMobileMenu(false); }} className="mt-4 w-full flex items-center gap-2 px-3 py-3 rounded-xl bg-white/7 border border-white/8 text-xs"><Plus className="w-4 h-4" /> New conversation</button><button onClick={() => { setSearchOpen(true); setMobileMenu(false); }} className="mt-2 w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-white/5 text-xs text-zinc-400"><Search className="w-4 h-4" /> Search conversation</button><div className="mt-5 text-[9px] uppercase tracking-wider text-zinc-600">Tools</div><div className="mt-2 space-y-1"><div className="px-3 py-2.5 rounded-xl bg-white/[0.03] text-xs text-zinc-400 flex gap-2"><Search className="w-3.5 h-3.5 text-cyan-400" /> Web Search</div><div className="px-3 py-2.5 rounded-xl bg-white/[0.03] text-xs text-zinc-400 flex gap-2"><Code2 className="w-3.5 h-3.5 text-blue-400" /> Code Evaluator</div><div className="px-3 py-2.5 rounded-xl bg-white/[0.03] text-xs text-zinc-400 flex gap-2"><Calendar className="w-3.5 h-3.5 text-purple-400" /> Time</div></div><div className="mt-auto pt-4 border-t border-white/5"><div className="rounded-xl border border-white/5 bg-black/30 p-3"><div className="text-[9px] text-zinc-600">MEMORY</div><div className="text-sm font-semibold mt-1">{memoryStats.totalMessages} messages</div></div><button onClick={() => { clear(); setMobileMenu(false); }} className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-xs text-rose-300"><Trash2 className="w-3.5 h-3.5" /> Clear memory</button></div></aside></div>}
    </main>
  );
}
