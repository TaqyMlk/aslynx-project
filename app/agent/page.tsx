'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgentMessage } from '@/src/types';
import {
  Bot, Send, Trash2, Search, Code2, Calendar, Sparkles, Zap, ShieldCheck,
  Plus, Menu, X, Copy, Check, Settings2, PanelLeft, Clock3, Brain, MessageSquare
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
        if (Array.isArray(data.history)) {
          setMessages(data.history);
          setMemoryStats({ totalMessages: data.history.length, engine: 'Persistent Memory' });
        }
      })
      .catch(() => {});
  }, []);

  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) => message.content.toLowerCase().includes(query));
  }, [messages, searchQuery]);

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setSearchOpen(false);
    setLoading(true);

    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}-user`,
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
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clear = async () => {
    if (!window.confirm('Clear the current Agent memory and conversation?')) return;
    try {
      await fetch('/api/agent/chat', { method: 'DELETE' });
    } finally {
      setMessages([]);
      setMemoryStats((prev) => ({ ...prev, totalMessages: 0 }));
    }
  };

  const copyMessage = async (message: AgentMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {}
  };

  const newChat = () => {
    setInput('');
    setSearchQuery('');
    setSearchOpen(false);
    setMobileMenu(false);
    inputRef.current?.focus();
  };

  return (
    <main className="relative w-full min-h-[100dvh] pt-[5.5rem] pb-[6.5rem] md:pt-[6rem] md:pb-8 text-white">
      <div className="mx-auto w-full max-w-[1600px] h-[calc(100dvh-12rem)] min-h-[520px] md:h-[calc(100dvh-7.5rem)] md:min-h-[620px] px-0 sm:px-4 flex gap-3">
        {/* Desktop sidebar */}
        {desktopSidebar && (
          <aside className="hidden md:flex w-[260px] shrink-0 flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400"><Bot className="w-4 h-4" /></div>
                <div className="min-w-0"><div className="text-sm font-semibold truncate">Lynx Agent</div><div className="text-[9px] text-zinc-500">Private AI workspace</div></div>
              </div>
              <button onClick={() => setDesktopSidebar(false)} aria-label="Hide sidebar" className="w-7 h-7 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center"><PanelLeft className="w-3.5 h-3.5" /></button>
            </div>
            <div className="p-3 space-y-2">
              <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-xs font-medium"><Plus className="w-4 h-4" /> New conversation</button>
              <button onClick={() => setSearchOpen((value) => !value)} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-zinc-400 hover:text-white"><Search className="w-4 h-4" /> Search conversation</button>
            </div>
            <div className="px-3 pt-2 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Workspace</div>
            <div className="p-3 space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/8 border border-cyan-400/10 text-xs text-zinc-200"><MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Current chat</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-500"><Brain className="w-3.5 h-3.5 text-purple-400" /> Persistent memory</div>
            </div>
            <div className="mt-auto p-3 border-t border-white/5 space-y-2">
              <div className="rounded-xl bg-black/25 border border-white/5 p-3"><div className="text-[9px] text-zinc-600 uppercase tracking-wider">Memory</div><div className="mt-1 text-sm font-semibold">{memoryStats.totalMessages} messages</div><div className="mt-0.5 text-[9px] text-zinc-600">{memoryStats.engine}</div></div>
              <button onClick={clear} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-[10px] text-zinc-500 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /> Clear memory</button>
            </div>
          </aside>
        )}

        {!desktopSidebar && <button onClick={() => setDesktopSidebar(true)} aria-label="Show sidebar" className="hidden md:flex fixed left-5 top-24 z-40 w-9 h-9 rounded-xl glass-panel border-white/10 items-center justify-center text-zinc-400 hover:text-white"><PanelLeft className="w-4 h-4" /></button>}

        {/* Agent workspace */}
        <section className="relative flex min-w-0 flex-1 flex-col rounded-none sm:rounded-2xl border-x sm:border border-white/10 bg-black/30 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <header className="shrink-0 h-14 md:h-16 flex items-center justify-between gap-2 px-3 sm:px-5 border-b border-white/5 bg-black/35 backdrop-blur-xl">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setMobileMenu(true)} aria-label="Open Agent menu" className="md:hidden w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-400"><Menu className="w-4 h-4" /></button>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/15 hidden sm:flex items-center justify-center text-cyan-400"><Bot className="w-4 h-4" /></div>
              <div className="min-w-0"><div className="text-sm font-semibold truncate">Lynx Agent</div><div className="flex items-center gap-1 text-[9px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · Memory enabled</div></div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen((value) => !value)} aria-label="Search conversation" className="w-9 h-9 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center"><Search className="w-4 h-4" /></button>
              <button onClick={newChat} aria-label="New conversation" className="hidden sm:flex w-9 h-9 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white items-center justify-center"><Plus className="w-4 h-4" /></button>
              <button onClick={clear} aria-label="Clear memory" className="w-9 h-9 rounded-xl hover:bg-rose-500/10 text-zinc-500 hover:text-rose-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          </header>

          {searchOpen && (
            <div className="shrink-0 px-3 sm:px-5 py-2 border-b border-white/5 bg-black/25">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search messages..." className="w-full h-9 pl-9 pr-9 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400/40" /><button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} aria-label="Close search" className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-white"><X className="w-3.5 h-3.5" /></button></div>
            </div>
          )}

          <div className="shrink-0 px-3 sm:px-5 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <div className="relative shrink-0"><Settings2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-400 pointer-events-none" /><select value={provider} onChange={(event) => setProvider(event.target.value)} className="h-8 pl-7 pr-7 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300 focus:outline-none"><option value="auto">Auto Router</option><option value="gemini">Gemini</option><option value="openrouter">OpenRouter</option><option value="groq">Groq</option></select></div>
            <span className="h-5 w-px bg-white/10 shrink-0" />
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-500"><Search className="w-3 h-3 text-cyan-400" /> Web Search</span>
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-500"><Code2 className="w-3 h-3 text-blue-400" /> Code</span>
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-500"><Calendar className="w-3 h-3 text-purple-400" /> Time</span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 shrink-0 text-[9px] text-zinc-600"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Private</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-8 py-5 sm:py-7">
            <div className="mx-auto w-full max-w-3xl space-y-6">
              {filteredMessages.length === 0 ? (
                <div className="min-h-full flex items-center justify-center py-10 sm:py-20">
                  <div className="w-full max-w-xl text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400"><Bot className="w-7 h-7" /></div>
                    <h1 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight">How can Lynx help?</h1>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-500">Private AI workspace with persistent memory and developer tools.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 text-left">{QUICK_PROMPTS.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="p-3 rounded-xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.06] hover:border-cyan-400/15 text-[10px] sm:text-xs text-zinc-400 hover:text-zinc-200 transition">{prompt}</button>)}</div>
                  </div>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <article key={message.id} className="group">
                    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role !== 'user' && <div className="hidden sm:flex shrink-0 w-7 h-7 mt-1 rounded-lg bg-cyan-500/10 border border-cyan-400/15 items-center justify-center text-cyan-400"><Bot className="w-3.5 h-3.5" /></div>}
                      <div className={`min-w-0 max-w-[94%] sm:max-w-[82%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] text-zinc-600"><span>{message.role === 'user' ? 'You' : 'Lynx Agent'}</span><span>·</span><Clock3 className="w-2.5 h-2.5" /><span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{message.provider && <><span>·</span><span>{message.provider}</span></>}</div>
                        <div className={`rounded-2xl px-3.5 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${message.role === 'user' ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm' : 'text-zinc-200'}`}>{message.content}</div>
                        <div className="mt-1 px-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"><button onClick={() => copyMessage(message)} aria-label="Copy response" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] text-zinc-600 hover:text-white hover:bg-white/5">{copiedId === message.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copiedId === message.id ? 'Copied' : 'Copy'}</button></div>
                        {message.toolCalls?.length ? <div className="mt-2 w-full max-w-sm rounded-xl border border-cyan-400/10 bg-cyan-500/[0.03] p-2"><div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-cyan-400"><Zap className="w-3 h-3" /> Tools used</div><div className="mt-1 space-y-1">{message.toolCalls.map((tool, index) => <div key={`${tool.name}-${index}`} className="text-[9px] font-mono text-zinc-600">{tool.name}</div>)}</div></div> : null}
                      </div>
                    </div>
                  </article>
                ))
              )}
              {loading && <div className="flex items-center gap-2 text-[10px] text-zinc-500 px-1"><Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Lynx Agent is thinking…</div>}
              <div ref={endRef} />
            </div>
          </div>

          <div className="shrink-0 p-2 sm:p-3 border-t border-white/5 bg-black/30 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/35 shadow-xl p-2">
              <div className="flex items-end gap-2"><textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} rows={1} placeholder="Message Lynx Agent…" className="flex-1 min-h-10 max-h-32 resize-none bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none" /><button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message" className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black flex items-center justify-center disabled:opacity-40">{loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button></div>
              <div className="px-2 pt-1 text-[9px] text-zinc-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Private session · persistent memory enabled</div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile drawer */}
      {mobileMenu && <div className="md:hidden fixed inset-0 z-[80]">
        <button aria-label="Close Agent menu" onClick={() => setMobileMenu(false)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
        <aside className="relative h-full w-[82%] max-w-[320px] bg-[#0b0c12]/95 border-r border-white/10 backdrop-blur-2xl shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-5"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400"><Bot className="w-4 h-4" /></div><div><div className="text-sm font-semibold">Lynx Agent</div><div className="text-[9px] text-zinc-500">Private AI workspace</div></div></div><button onClick={() => setMobileMenu(false)} aria-label="Close" className="w-9 h-9 rounded-xl hover:bg-white/5 text-zinc-400 flex items-center justify-center"><X className="w-4 h-4" /></button></div>
          <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-3 rounded-xl bg-white/8 border border-white/10 text-xs font-medium"><Plus className="w-4 h-4" /> New conversation</button>
          <button onClick={() => { setSearchOpen(true); setMobileMenu(false); }} className="w-full mt-2 flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-white/5 text-xs text-zinc-400"><Search className="w-4 h-4" /> Search conversation</button>
          <div className="mt-6 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Workspace</div>
          <div className="mt-2 space-y-1"><div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-cyan-500/8 border border-cyan-400/10 text-xs"><MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Current chat</div><div className="flex items-center gap-2 px-3 py-3 rounded-xl text-xs text-zinc-500"><Brain className="w-3.5 h-3.5 text-purple-400" /> Persistent memory</div></div>
          <div className="mt-auto rounded-xl border border-white/5 bg-black/25 p-3"><div className="text-[9px] text-zinc-600 uppercase tracking-wider">Memory</div><div className="mt-1 text-sm font-semibold">{memoryStats.totalMessages} messages</div><div className="mt-0.5 text-[9px] text-zinc-600">{memoryStats.engine}</div><button onClick={clear} className="mt-3 w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-rose-500/10 text-[10px] text-zinc-500 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /> Clear memory</button></div>
        </aside>
      </div>}
    </main>
  );
}
