'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot, Send, Trash2, Search, Code2, Clock3, Plus, Menu, X, Copy, Check,
  PanelLeft, Brain, MessageSquare, Settings2, ShieldCheck, ChevronLeft,
  MoreHorizontal, RefreshCw, Database, Sparkles
} from 'lucide-react';
import type { AgentMessage, AgentSession, MemoryFact } from '@/src/types';

type Provider = 'auto' | 'gemini' | 'openrouter' | 'groq';

const QUICK_PROMPTS = [
  ['Architecture review', 'Analyze my current project architecture and suggest practical improvements.'],
  ['Bedrock scripting', 'Create a production-ready Minecraft Bedrock Script API solution for a performance-sensitive feature.'],
  ['Next.js API', 'Explain the best current pattern for a Next.js App Router API route with validation, caching, and error handling.'],
  ['Remember a preference', 'Remember: I prefer concise, production-ready code with no placeholder sections.']
] as const;

const providerLabels: Record<Provider, string> = {
  auto: 'Auto Router',
  gemini: 'Gemini',
  openrouter: 'OpenRouter',
  groq: 'Groq'
};

function makeSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AgentPage() {
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [sessionId, setSessionId] = useState('default-session');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>('auto');
  const [mode, setMode] = useState<'general' | 'coding'>('general');
  const [desktopSidebar, setDesktopSidebar] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [facts, setFacts] = useState<MemoryFact[]>([]);
  const [factsLoading, setFactsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<{ provider?: string; model?: string; latencyMs?: number; tools?: string[] } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentSession = sessions.find((session) => session.id === sessionId);

  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) => message.content.toLowerCase().includes(query));
  }, [messages, searchQuery]);

  const loadSessions = async () => {
    const response = await fetch('/api/agent/memory?action=sessions', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load conversations');
    const data = await response.json();
    return Array.isArray(data.sessions) ? data.sessions as AgentSession[] : [];
  };

  const loadConversation = async (id: string) => {
    const response = await fetch(`/api/agent/chat?sessionId=${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load conversation');
    const data = await response.json();
    setSessionId(id);
    setMessages(Array.isArray(data.history) ? data.history : []);
    setLastRun(null);
    setSearchQuery('');
    setSearchOpen(false);
    setMobileMenu(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const loaded = await loadSessions();
        setSessions(loaded);
        const target = loaded[0]?.id || 'default-session';
        await loadConversation(target);
      } catch {
        setSessionId('default-session');
        setMessages([]);
      }
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const refreshMemory = async () => {
    setFactsLoading(true);
    try {
      const response = await fetch('/api/agent/memory', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load memory');
      setFacts(Array.isArray(data.facts) ? data.facts : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load memory');
    } finally {
      setFactsLoading(false);
    }
  };

  const openMemory = async () => {
    setMemoryOpen(true);
    await refreshMemory();
  };

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;

    setInput('');
    setSearchOpen(false);
    setError(null);
    setLoading(true);

    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages((previous) => [...previous, userMessage]);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          mode,
          provider
        })
      });
      const data = await response.json();
      if (!response.ok || !data.message) throw new Error(data.error || 'Agent request failed');

      setMessages((previous) => [...previous, data.message]);
      setLastRun({ provider: data.provider, model: data.model, latencyMs: data.latencyMs, tools: data.toolsUsed });

      const nextTitle = currentSession?.title && currentSession.title !== 'New Session'
        ? currentSession.title
        : text.slice(0, 42) + (text.length > 42 ? '…' : '');
      setSessions((previous) => {
        const exists = previous.some((item) => item.id === sessionId);
        const updated: AgentSession = {
          id: sessionId,
          title: nextTitle,
          createdAt: currentSession?.createdAt || Date.now(),
          updatedAt: Date.now(),
          messageCount: (currentSession?.messageCount || 0) + 2
        };
        return [updated, ...previous.filter((item) => item.id !== sessionId)];
      });
      if (text.toLowerCase().startsWith('ingat:') || text.toLowerCase().startsWith('remember:') || text.toLowerCase().includes('simpan fakta:')) {
        await refreshMemory();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setMessages((previous) => previous.filter((item) => item.id !== userMessage.id));
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  const newChat = () => {
    const id = makeSessionId();
    const session: AgentSession = {
      id,
      title: 'New conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0
    };
    setSessionId(id);
    setSessions((previous) => [session, ...previous]);
    setMessages([]);
    setInput('');
    setSearchQuery('');
    setSearchOpen(false);
    setMobileMenu(false);
    setLastRun(null);
    setError(null);
    window.setTimeout(() => inputRef.current?.focus(), 60);
  };

  const clearConversation = async () => {
    if (!messages.length) return;
    if (!window.confirm('Hapus semua pesan dari percakapan ini? Memory tersimpan tidak ikut dihapus.')) return;
    try {
      const response = await fetch(`/api/agent/chat?sessionId=${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Conversation could not be cleared');
      setMessages([]);
      setLastRun(null);
      setSessions((previous) => previous.map((item) => item.id === sessionId ? { ...item, messageCount: 0, updatedAt: Date.now() } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversation clear failed');
    }
  };

  const deleteSession = async (id: string) => {
    if (!window.confirm('Hapus percakapan ini secara permanen?')) return;
    try {
      const response = await fetch(`/api/agent/memory?sessionId=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Session could not be deleted');
      const next = sessions.filter((item) => item.id !== id);
      setSessions(next);
      if (id === sessionId) {
        const target = next[0]?.id;
        if (target) await loadConversation(target);
        else newChat();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Session delete failed');
    }
  };

  const deleteFact = async (id: string) => {
    try {
      const response = await fetch(`/api/agent/memory?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Memory item could not be deleted');
      setFacts((previous) => previous.filter((fact) => fact.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Memory delete failed');
    }
  };

  const copyMessage = async (message: AgentMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError('Clipboard access is unavailable');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? 'fixed inset-y-0 left-0 z-[70] w-[min(88vw,360px)] md:hidden' : 'hidden md:flex w-[270px] shrink-0'} flex-col border-r border-white/8 bg-[#0d0f14] overflow-hidden`}>
      <div className="h-16 shrink-0 px-4 flex items-center justify-between border-b border-white/8">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-300/15 flex items-center justify-center text-cyan-300"><Bot className="w-4 h-4" /></div>
          <div className="min-w-0"><div className="text-sm font-semibold truncate">Lynx Agent</div><div className="text-[10px] text-zinc-600">Private workspace</div></div>
        </div>
        {mobile ? <button onClick={() => setMobileMenu(false)} aria-label="Close menu" className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"><X className="w-4 h-4" /></button> : <button onClick={() => setDesktopSidebar(false)} aria-label="Hide sidebar" className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"><PanelLeft className="w-4 h-4" /></button>}
      </div>

      <div className="p-3 space-y-1.5 border-b border-white/8">
        <button onClick={newChat} className="w-full h-10 flex items-center gap-2 px-3 rounded-lg bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] text-xs font-medium"><Plus className="w-4 h-4" /> New conversation</button>
        <button onClick={() => setSearchOpen((value) => !value)} className="w-full h-9 flex items-center gap-2 px-3 rounded-lg text-xs text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"><Search className="w-3.5 h-3.5" /> Search messages</button>
      </div>

      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Conversations</span>
        <span className="text-[10px] text-zinc-700">{sessions.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {sessions.length === 0 && <div className="px-3 py-6 text-xs text-zinc-700">Belum ada percakapan.</div>}
        {sessions.map((item) => (
          <div key={item.id} className={`group flex items-center gap-1 rounded-lg ${item.id === sessionId ? 'bg-white/[0.06] text-zinc-100' : 'text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-300'}`}>
            <button onClick={() => void loadConversation(item.id)} className="min-w-0 flex-1 flex items-center gap-2 px-3 py-2.5 text-left">
              <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span className="truncate text-xs">{item.title || 'New conversation'}</span>
            </button>
            <button onClick={() => void deleteSession(item.id)} aria-label={`Delete ${item.title}`} className="w-8 h-8 mr-1 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 text-zinc-600 hover:text-rose-300 hover:bg-rose-400/5"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/8 space-y-1.5">
        <button onClick={() => void openMemory()} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"><Brain className="w-4 h-4 text-violet-300/70" /> Persistent memory</button>
        <button onClick={() => void clearConversation()} disabled={!messages.length} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-zinc-600 hover:text-rose-300 hover:bg-rose-400/5 disabled:opacity-30 disabled:pointer-events-none"><Trash2 className="w-4 h-4" /> Clear conversation</button>
      </div>
    </aside>
  );

  return (
    <main className="w-full min-h-[100dvh] bg-[#090a0e] text-white pt-[4.75rem] pb-[5.5rem] md:pt-24 md:pb-5">
      {mobileMenu && <><div className="fixed inset-0 z-[65] bg-black/60 md:hidden" onClick={() => setMobileMenu(false)} /><Sidebar mobile /></>}

      <div className="mx-auto w-full max-w-[1560px] h-[calc(100dvh-10.25rem)] min-h-[560px] md:h-[calc(100dvh-7.5rem)] md:min-h-[650px] flex overflow-hidden border-y md:border border-white/8 bg-[#0c0e13] md:rounded-xl">
        {desktopSidebar && <Sidebar />}
        {!desktopSidebar && <button onClick={() => setDesktopSidebar(true)} aria-label="Show sidebar" className="hidden md:flex absolute ml-3 mt-3 z-20 w-9 h-9 rounded-lg bg-[#11141a] border border-white/10 items-center justify-center text-zinc-500 hover:text-white"><PanelLeft className="w-4 h-4" /></button>}

        <section className="min-w-0 flex-1 flex flex-col bg-[#0b0d12]">
          <header className="h-14 md:h-16 shrink-0 flex items-center justify-between gap-3 px-3 sm:px-5 border-b border-white/8">
            <div className="flex items-center gap-2.5 min-w-0">
              <button onClick={() => setMobileMenu(true)} aria-label="Open Agent menu" className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5"><Menu className="w-4 h-4" /></button>
              <div className="min-w-0">
                <div className="flex items-center gap-2"><span className="text-sm font-semibold truncate">{currentSession?.title || 'New conversation'}</span><span className="hidden sm:inline text-[10px] text-emerald-400/80">Ready</span></div>
                <div className="text-[10px] text-zinc-600 truncate">{providerLabels[provider]} · {mode === 'coding' ? 'Coding' : 'General'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen((value) => !value)} aria-label="Search messages" className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5"><Search className="w-4 h-4" /></button>
              <button onClick={() => void openMemory()} aria-label="Open persistent memory" className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5"><Brain className="w-4 h-4" /></button>
              <button onClick={newChat} aria-label="New conversation" className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5"><Plus className="w-4 h-4" /></button>
              <button onClick={() => void clearConversation()} aria-label="Clear conversation" disabled={!messages.length} className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-600 hover:text-rose-300 hover:bg-rose-400/5 disabled:opacity-30"><Trash2 className="w-4 h-4" /></button>
            </div>
          </header>

          {searchOpen && <div className="px-3 sm:px-5 py-2 border-b border-white/8 bg-[#0e1015]"><div className="relative max-w-2xl"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search this conversation..." className="w-full h-9 pl-9 pr-9 rounded-lg bg-[#08090d] border border-white/10 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-300/30" /><button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} aria-label="Close search" className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-white"><X className="w-3.5 h-3.5" /></button></div></div>}

          <div className="shrink-0 px-3 sm:px-5 py-2 border-b border-white/8 flex items-center gap-2 overflow-x-auto">
            <div className="relative shrink-0"><Settings2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-300 pointer-events-none" /><select value={provider} onChange={(event) => setProvider(event.target.value as Provider)} aria-label="Preferred AI provider" className="h-8 pl-7 pr-6 rounded-lg bg-[#11141a] border border-white/10 text-[10px] text-zinc-300 focus:outline-none focus:border-cyan-300/30"><option value="auto">Auto Router</option><option value="gemini">Gemini</option><option value="openrouter">OpenRouter</option><option value="groq">Groq</option></select></div>
            <div className="flex shrink-0 rounded-lg border border-white/8 bg-[#0f1116] p-0.5"><button onClick={() => setMode('general')} aria-pressed={mode === 'general'} className={`h-7 px-2.5 rounded-md text-[10px] ${mode === 'general' ? 'bg-white/[0.08] text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}>General</button><button onClick={() => setMode('coding')} aria-pressed={mode === 'coding'} className={`h-7 px-2.5 rounded-md text-[10px] ${mode === 'coding' ? 'bg-white/[0.08] text-cyan-200' : 'text-zinc-600 hover:text-zinc-400'}`}><Code2 className="inline w-3 h-3 mr-1" />Coding</button></div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-zinc-600"><ShieldCheck className="w-3 h-3 text-emerald-400/70" /> Persistent memory</span>
            {lastRun?.provider && <span className="ml-auto hidden sm:inline text-[10px] text-zinc-700">{lastRun.provider} · {lastRun.latencyMs ?? 0}ms</span>}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-7 py-5 sm:py-7">
            <div className="mx-auto w-full max-w-3xl space-y-6">
              {error && <div role="alert" className="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-rose-400/15 bg-rose-400/5 text-xs text-rose-200"><span className="flex-1">{error}</span><button onClick={() => setError(null)} aria-label="Dismiss error"><X className="w-3.5 h-3.5" /></button></div>}

              {filteredMessages.length === 0 ? (
                <div className="min-h-full flex items-center justify-center py-10 sm:py-16">
                  <div className="w-full max-w-xl">
                    <div className="flex items-start gap-3 mb-7"><div className="w-9 h-9 rounded-lg bg-cyan-400/8 border border-cyan-300/10 flex items-center justify-center text-cyan-300"><Bot className="w-4 h-4" /></div><div><h1 className="text-lg font-semibold">Lynx Agent</h1><p className="mt-1 text-xs leading-5 text-zinc-600">A private developer workspace with persistent memory, conversation history, provider selection, and focused tools.</p></div></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{QUICK_PROMPTS.map(([title, prompt]) => <button key={title} onClick={() => void send(prompt)} className="text-left p-3.5 rounded-lg border border-white/8 bg-[#101219] hover:bg-[#14171e] hover:border-white/12 transition-colors"><span className="block text-xs font-medium text-zinc-300">{title}</span><span className="block mt-1 text-[11px] leading-5 text-zinc-600">{prompt}</span></button>)}</div>
                  </div>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <article key={message.id} className="group">
                    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role !== 'user' && <div className="hidden sm:flex shrink-0 w-7 h-7 mt-1 rounded-lg bg-cyan-400/8 border border-cyan-300/10 items-center justify-center text-cyan-300"><Bot className="w-3.5 h-3.5" /></div>}
                      <div className={`min-w-0 max-w-[96%] sm:max-w-[84%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] text-zinc-700"><span>{message.role === 'user' ? 'You' : 'Lynx Agent'}</span><span>·</span><Clock3 className="w-2.5 h-2.5" /><span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{message.provider && <><span>·</span><span>{message.provider}</span></>}</div>
                        <div className={`${message.role === 'user' ? 'bg-[#171a21] border-white/10' : 'bg-[#101219] border-white/8'} rounded-xl border px-3.5 py-3 text-[13px] leading-6 text-zinc-200 whitespace-pre-wrap break-words w-full`}>{message.content}</div>
                        {message.role === 'assistant' && <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"><button onClick={() => void copyMessage(message)} className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-[10px] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]">{copiedId === message.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copiedId === message.id ? 'Copied' : 'Copy'}</button>{message.toolCalls?.map((tool) => <span key={tool.name} className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[10px] text-zinc-600 bg-white/[0.025]"><Sparkles className="w-3 h-3" />{tool.name}</span>)}</div>}
                      </div>
                    </div>
                  </article>
                ))
              )}
              {loading && <div className="flex items-start gap-3"><div className="w-7 h-7 rounded-lg bg-cyan-400/8 border border-cyan-300/10 flex items-center justify-center text-cyan-300"><Bot className="w-3.5 h-3.5" /></div><div className="px-3.5 py-3 rounded-xl border border-white/8 bg-[#101219] text-xs text-zinc-600">Thinking…</div></div>}
              <div ref={endRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-white/8 bg-[#0b0d12] p-2.5 sm:p-3">
            <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-[#101219] focus-within:border-cyan-300/25 transition-colors">
              <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} rows={2} aria-label="Message Lynx Agent" placeholder={mode === 'coding' ? 'Ask for code, debugging, architecture, or implementation help…' : 'Ask Lynx Agent anything…'} className="w-full resize-none bg-transparent px-3.5 pt-3 pb-2 text-[13px] leading-6 text-white placeholder:text-zinc-700 focus:outline-none min-h-[62px] max-h-40" />
              <div className="flex items-center justify-between gap-2 px-3 pb-2.5"><div className="flex items-center gap-2 text-[10px] text-zinc-700"><span>{input.length} chars</span><span>·</span><span>Enter to send</span><span className="hidden sm:inline">· Shift+Enter newline</span></div><button onClick={() => void send()} disabled={loading || !input.trim()} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-cyan-300 text-[#071014] text-xs font-semibold hover:bg-cyan-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"><Send className="w-3.5 h-3.5" />{loading ? 'Working' : 'Send'}</button></div>
            </div>
          </div>
        </section>
      </div>

      {memoryOpen && <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-5"><div className="absolute inset-0 bg-black/65" onClick={() => setMemoryOpen(false)} /><section className="relative w-full sm:max-w-xl max-h-[82dvh] rounded-t-2xl sm:rounded-xl border border-white/10 bg-[#101219] overflow-hidden"><header className="h-14 px-4 flex items-center justify-between border-b border-white/8"><div><h2 className="text-sm font-semibold">Persistent memory</h2><p className="text-[10px] text-zinc-600">Stored facts are separate from conversations.</p></div><div className="flex items-center gap-1"><button onClick={() => void refreshMemory()} aria-label="Refresh memory" className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"><RefreshCw className={`w-3.5 h-3.5 ${factsLoading ? 'animate-spin' : ''}`} /></button><button onClick={() => setMemoryOpen(false)} aria-label="Close memory" className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"><X className="w-4 h-4" /></button></div></header><div className="overflow-y-auto max-h-[calc(82dvh-3.5rem)] p-3 space-y-2">{factsLoading && !facts.length ? <div className="py-10 text-center text-xs text-zinc-600">Loading memory…</div> : facts.length === 0 ? <div className="py-10 text-center text-xs text-zinc-600">No stored facts.</div> : facts.map((fact) => <div key={fact.id} className="p-3 rounded-lg border border-white/8 bg-[#0c0e13]"><div className="flex items-start gap-3"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0 text-violet-300/70" /><div className="min-w-0 flex-1"><div className="text-xs font-medium text-zinc-300 break-words">{fact.key}</div><div className="mt-1 text-[11px] leading-5 text-zinc-600 break-words">{fact.value}</div><div className="mt-2 text-[9px] text-zinc-700">{fact.category}{fact.tags.length ? ` · ${fact.tags.join(', ')}` : ''}</div></div><button onClick={() => void deleteFact(fact.id)} aria-label={`Delete memory ${fact.key}`} className="w-7 h-7 shrink-0 flex items-center justify-center rounded-md text-zinc-700 hover:text-rose-300 hover:bg-rose-400/5"><Trash2 className="w-3.5 h-3.5" /></button></div></div>)}</div></section></div>}
    </main>
  );
}
