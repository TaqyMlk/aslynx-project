'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Brain, Check, Code2, Copy, Menu, MessageSquare, PanelLeft, Plus, Search, Send, Settings2, Trash2, X } from 'lucide-react';
import type { AgentMessage, AgentSession, MemoryFact } from '@/src/types';

type Provider = 'auto' | 'gemini' | 'openrouter' | 'groq';
type Mode = 'general' | 'coding';

const providers: { id: Provider; label: string }[] = [
  { id: 'auto', label: 'Auto Router' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'groq', label: 'Groq' }
];

const prompts = [
  ['Architecture review', 'Review my current project architecture and give practical improvements.'],
  ['Bedrock scripting', 'Create a production-ready Minecraft Bedrock Script API solution for a performance-sensitive feature.'],
  ['Next.js API', 'Show the best current App Router API pattern with validation, caching and error handling.']
] as const;

const newId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

interface SidebarProps {
  mobile?: boolean;
  sessions: AgentSession[];
  activeId: string;
  searchOpen: boolean;
  canClear: boolean;
  onSelect: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNew: () => void;
  onToggleSearch: () => void;
  onClear: () => void;
  onOpenMemory: () => void;
  onRequestClose: () => void;
}

function AgentSidebar({
  mobile = false,
  sessions,
  activeId,
  searchOpen,
  canClear,
  onSelect,
  onDeleteSession,
  onNew,
  onToggleSearch,
  onClear,
  onOpenMemory,
  onRequestClose
}: SidebarProps) {
  return (
    <aside className={`${mobile ? 'fixed inset-y-0 left-0 z-[80] w-[min(88vw,340px)]' : 'hidden md:flex w-[272px]'} shrink-0 flex-col border-r border-white/8 bg-[#020617]`}>
      <div className="h-14 px-3.5 flex items-center justify-between border-b border-white/8">
        <div className="flex items-center gap-2.5 min-w-0"><div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-cyan-300"><Bot className="w-4 h-4" /></div><div className="min-w-0"><div className="text-sm font-semibold text-white">Lynx Agent</div><div className="text-[10px] text-neutral-500">Private workspace</div></div></div>
        {mobile ? <button className="nav-icon-btn" onClick={onRequestClose} aria-label="Close sidebar"><X className="w-4 h-4" /></button> : <button className="nav-icon-btn" onClick={onRequestClose} aria-label="Hide sidebar"><PanelLeft className="w-4 h-4" /></button>}
      </div>
      <div className="p-3 border-b border-white/8 space-y-1">
        <button className="action-btn primary" onClick={onNew}><Plus className="w-4 h-4" /> New conversation</button>
        <button className={`action-btn${searchOpen ? ' primary' : ''}`} aria-pressed={searchOpen} onClick={onToggleSearch}><Search className="w-4 h-4" /> Search messages</button>
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-between"><span className="label">Conversations</span><span className="text-[10px] text-neutral-500">{sessions.length}</span></div>
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {sessions.map((s) => <div key={s.id} className={`group flex items-center rounded-lg mb-0.5 ${s.id === activeId ? 'bg-white/[.06] text-white' : 'text-neutral-500 hover:bg-white/[.035]'}`}>
          <button onClick={() => onSelect(s.id)} className="flex-1 min-w-0 text-left flex items-center gap-2 px-3 py-2.5"><MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-50" /><span className="truncate text-xs">{s.title || 'New conversation'}</span></button>
          <button onClick={() => onDeleteSession(s.id)} className="nav-icon-btn mr-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:text-rose-300" aria-label={`Delete conversation: ${s.title}`}><Trash2 className="w-3.5 h-3.5" /></button>
        </div>)}
        {!sessions.length && <div className="px-3 py-8 text-xs text-neutral-600">No conversations yet.</div>}
      </div>
      <div className="p-3 border-t border-white/8 space-y-1">
        <button className="action-btn" onClick={onOpenMemory}><Brain className="w-4 h-4" /> Persistent memory</button>
        <button className="action-btn danger" disabled={!canClear} onClick={onClear}><Trash2 className="w-4 h-4" /> Clear conversation</button>
      </div>
    </aside>
  );
}

export default function AgentPage() {
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [sessionId, setSessionId] = useState('default-session');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<Provider>('auto');
  const [mode, setMode] = useState<Mode>('general');
  const [busy, setBusy] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [settings, setSettings] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [facts, setFacts] = useState<MemoryFact[]>([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryText, setRetryText] = useState<string | null>(null);
  const [run, setRun] = useState<{ provider?: string; model?: string; latencyMs?: number; tools?: string[] } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const streamCtrlRef = useRef<AbortController | null>(null);

  const current = sessions.find((s) => s.id === sessionId);
  const visibleMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? messages.filter((m) => m.content.toLowerCase().includes(q)) : messages;
  }, [messages, search]);

  async function loadSessions() {
    const r = await fetch('/api/agent/memory?action=sessions', { cache: 'no-store' });
    if (!r.ok) throw new Error('Failed to load conversations.');
    const d = await r.json();
    return Array.isArray(d.sessions) ? d.sessions as AgentSession[] : [];
  }

  async function openSession(id: string) {
    const r = await fetch(`/api/agent/chat?sessionId=${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('Failed to load this conversation.');
    const d = await r.json();
    setSessionId(id);
    setMessages(Array.isArray(d.history) ? d.history : []);
    setSearch('');
    setSearchOpen(false);
    setRun(null);
    setError(null);
    setRetryText(null);
    setMobileMenu(false);
  }

  useEffect(() => {
    void (async () => {
      try {
        const list = await loadSessions();
        setSessions(list);
        await openSession(list[0]?.id || 'default-session');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to initialize the Agent.');
      }
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);

  async function refreshMemory() {
    setMemoryLoading(true);
    try {
      const r = await fetch('/api/agent/memory', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed to load memory.');
      setFacts(Array.isArray(d.facts) ? d.facts : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load memory.');
    } finally {
      setMemoryLoading(false);
    }
  }

  async function send(text = input) {
    const value = text.trim();
    if (!value || busy) return;

    if (streamCtrlRef.current) {
      try { streamCtrlRef.current.abort(); } catch {}
    }
    const controller = new AbortController();
    streamCtrlRef.current = controller;

    setInput('');
    setError(null);
    setRetryText(null);
    setBusy(true);

    const user: AgentMessage = { id: `msg_${Date.now()}_user`, role: 'user', content: value, timestamp: Date.now() };
    const streamingId = `stream-${Date.now()}`;
    const streamingMsg: AgentMessage = { id: streamingId, role: 'assistant', content: '', timestamp: Date.now() };
    setMessages((m) => [...m, user, streamingMsg]);

    try {
      const r = await fetch('/api/agent/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: value, mode, provider }),
        signal: controller.signal
      });

      if (!r.ok) {
        const d = await r.json().catch(() => ({} as any));
        throw new Error(d?.error || 'The agent request failed.');
      }

      const reader = r.body?.getReader();
      if (!reader) throw new Error('Stream unavailable');
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';
      let finalMeta: { provider?: string; model?: string; latencyMs?: number; toolsUsed?: string[]; toolCalls?: { name: string; args: Record<string, unknown>; result?: unknown }[] } = {};

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.type === 'token') {
              fullText += parsed.text;
              setMessages((m) => m.map((msg) => msg.id === streamingId ? { ...msg, content: fullText } : msg));
            } else if (parsed.type === 'done') {
              finalMeta = parsed;
            } else if (parsed.type === 'error') {
              throw new Error(parsed.message || 'Stream error');
            }
          } catch { /* skip malformed chunk */ }
        }
      }

      if (!fullText) throw new Error('Empty response');

      const assistantMessage: AgentMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: fullText,
        timestamp: Date.now(),
        provider: finalMeta.provider,
        modelUsed: finalMeta.model,
        latencyMs: finalMeta.latencyMs,
        toolCalls: finalMeta.toolCalls?.length ? finalMeta.toolCalls : undefined
      };

      setMessages((m) => m.map((old) => old.id === streamingId ? assistantMessage : old));
      setRun({ provider: assistantMessage.provider, model: assistantMessage.modelUsed, latencyMs: assistantMessage.latencyMs, tools: finalMeta.toolsUsed });
      const title = current?.title && current.title !== 'New Session' && current.title !== 'New conversation' ? current.title : value.slice(0, 48) + (value.length > 48 ? '…' : '');
      setSessions((list) => [{ id: sessionId, title, createdAt: current?.createdAt || Date.now(), updatedAt: Date.now(), messageCount: (current?.messageCount || 0) + 2 }, ...list.filter((s) => s.id !== sessionId)]);
      if (/^(ingat:|remember:)/i.test(value) || /simpan fakta:/i.test(value)) void refreshMemory();
    } catch (e) {
      setMessages((m) => m.filter((msg) => !(msg.id === user.id || msg.id === streamingId)));
      setInput(value);
      setRetryText(value);
      setError(e instanceof Error ? e.message : 'The agent request failed.');
    } finally {
      setBusy(false);
      streamCtrlRef.current = null;
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function newConversation() {
    const id = newId();
    setSessionId(id);
    setSessions((s) => [{ id, title: 'New conversation', createdAt: Date.now(), updatedAt: Date.now(), messageCount: 0 }, ...s]);
    setMessages([]); setInput(''); setSearch(''); setSearchOpen(false); setRun(null); setError(null); setRetryText(null); setMobileMenu(false);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function clearConversation() {
    if (!messages.length || !window.confirm('Delete every message in this conversation? Persistent memory stays intact.')) return;
    try {
      const r = await fetch(`/api/agent/chat?sessionId=${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Failed to clear this conversation.');
      setMessages([]); setRun(null);
      setSessions((s) => s.map((x) => x.id === sessionId ? { ...x, messageCount: 0, updatedAt: Date.now() } : x));
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to clear this conversation.'); }
  }

  async function removeSession(id: string) {
    if (!window.confirm('Delete this conversation permanently?')) return;
    try {
      const r = await fetch(`/api/agent/memory?sessionId=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Failed to delete this conversation.');
      const next = sessions.filter((s) => s.id !== id); setSessions(next);
      if (id === sessionId) await openSession(next[0]?.id || 'default-session');
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to delete this conversation.'); }
  }

  async function removeFact(id: string) {
    if (!window.confirm('Delete this stored fact permanently?')) return;
    try {
      const r = await fetch(`/api/agent/memory?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Failed to delete this memory.');
      setFacts((f) => f.filter((x) => x.id !== id));
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to delete this memory.'); }
  }

  async function copy(text: string, id: string) {
    try { await navigator.clipboard.writeText(text); setCopied(id); window.setTimeout(() => setCopied(null), 1200); }
    catch { setError('Clipboard is not available in this browser.'); }
  }

  function keyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); }
  }

  return <main className="agent-shell">
    {mobileMenu && <><button className="fixed inset-0 z-[75] bg-black/60 md:hidden" aria-label="Close sidebar overlay" onClick={() => setMobileMenu(false)} /><AgentSidebar mobile sessions={sessions} activeId={sessionId} searchOpen={searchOpen} canClear={messages.length > 0} onSelect={(id) => void openSession(id)} onDeleteSession={(id) => void removeSession(id)} onNew={newConversation} onToggleSearch={() => setSearchOpen((v) => !v)} onClear={() => void clearConversation()} onOpenMemory={() => { setMemoryOpen(true); void refreshMemory(); }} onRequestClose={() => setMobileMenu(false)} /></>}
    <div className="agent-app">
      {sidebar && <AgentSidebar sessions={sessions} activeId={sessionId} searchOpen={searchOpen} canClear={messages.length > 0} onSelect={(id) => void openSession(id)} onDeleteSession={(id) => void removeSession(id)} onNew={newConversation} onToggleSearch={() => setSearchOpen((v) => !v)} onClear={() => void clearConversation()} onOpenMemory={() => { setMemoryOpen(true); void refreshMemory(); }} onRequestClose={() => setSidebar(false)} />}
      {!sidebar && <button className="hidden md:flex absolute left-3 top-3 z-20 nav-icon-btn panel-button" onClick={() => setSidebar(true)} aria-label="Show sidebar"><PanelLeft className="w-4 h-4" /></button>}
      <section className="min-w-0 flex-1 flex flex-col bg-[#020617]">
        <header className="h-14 shrink-0 px-3 sm:px-5 flex items-center justify-between border-b border-white/8">
          <div className="flex items-center gap-2 min-w-0"><button className="nav-icon-btn md:hidden" onClick={() => setMobileMenu(true)} aria-label="Open sidebar"><Menu className="w-4 h-4" /></button><div className="min-w-0"><div className="text-sm font-medium text-white truncate">{current?.title || 'New conversation'}</div><div className="text-[10px] text-neutral-500">{messages.length ? `${messages.length} messages` : 'Ready'}</div></div></div>
          <div className="flex items-center gap-1.5"><button className="nav-icon-btn" onClick={() => setSettings((v) => !v)} aria-label="Agent settings"><Settings2 className="w-4 h-4" /></button></div>
        </header>

        {searchOpen && <div className="px-3 sm:px-5 py-2 border-b border-white/8"><div className="relative max-w-xl"><Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search this conversation" aria-label="Search this conversation" className="field pl-9 pr-8" /><button className="absolute right-1 top-1 nav-icon-btn" onClick={() => { setSearchOpen(false); setSearch(''); }} aria-label="Close search"><X className="w-4 h-4" /></button></div></div>}

        {settings && <div className="border-b border-white/8 px-3 sm:px-5 py-3"><div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3"><div><div className="label mb-1.5">Mode</div><div className="segmented"><button className={mode === 'general' ? 'selected' : ''} onClick={() => setMode('general')}>General</button><button className={mode === 'coding' ? 'selected' : ''} onClick={() => setMode('coding')}><Code2 className="w-3.5 h-3.5" /> Coding</button></div></div><div><label className="label mb-1.5 block" htmlFor="provider-select">Provider</label><select id="provider-select" value={provider} onChange={(e) => setProvider(e.target.value as Provider)} className="field"><option value="auto">Auto Router</option><option value="gemini">Gemini</option><option value="openrouter">OpenRouter</option><option value="groq">Groq</option></select></div></div></div>}

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 py-6 sm:py-10">
            {!visibleMessages.length && !searchOpen && <div className="min-h-[55vh] flex flex-col justify-center"><div className="max-w-2xl"><div className="text-xs text-cyan-400/80 mb-3 font-medium">PRIVATE AGENT</div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">What are you working on?</h1><p className="mt-2 text-sm leading-6 text-neutral-400 max-w-xl">Use the Agent for project work, code, architecture decisions, Minecraft systems, and tasks that benefit from persistent context.</p><div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-2">{prompts.map(([label, text]) => <button key={label} onClick={() => { setInput(text); inputRef.current?.focus(); }} className="text-left p-3 rounded-lg border border-white/8 bg-white/[.02] hover:bg-white/[.04] hover:border-white/12 transition-colors"><div className="text-xs font-medium text-neutral-200">{label}</div><div className="mt-1 text-[11px] leading-4 text-neutral-500">{text}</div></button>)}</div></div></div>}
            {searchOpen && !visibleMessages.length && <div className="py-16 text-center text-sm text-neutral-500">No messages match &ldquo;{search.trim()}&rdquo;.</div>}
            <div className="space-y-7">{visibleMessages.map((m) => <article key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex gap-3'}><div className={m.role === 'user' ? 'max-w-[88%] sm:max-w-[75%]' : 'max-w-[94%] sm:max-w-[82%]'}><div className="flex items-center gap-2 mb-1.5">{m.role !== 'user' && <div className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center text-cyan-300 bg-[#020617]"><Bot className="w-3.5 h-3.5" /></div>}<span className="text-[10px] text-neutral-500">{m.role === 'user' ? 'You' : 'Lynx Agent'}</span></div><div className={m.role === 'user' ? 'message user-message' : 'message agent-message'}><div className="whitespace-pre-wrap break-words text-sm leading-6">{m.content}</div></div>{m.role !== 'user' && <div className="mt-1 flex items-center gap-1"><button className="mini-btn" onClick={() => void copy(m.content, m.id)}>{copied === m.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>{m.provider && <span className="text-[10px] text-neutral-500">{m.provider}{m.modelUsed ? ` · ${m.modelUsed}` : ''}</span>}</div>}</div></article>)}
              {busy && <div className="flex gap-3"><div className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center text-cyan-300 bg-[#020617]"><Bot className="w-3.5 h-3.5" /></div><div className="text-xs text-neutral-500 py-1">Thinking…</div></div>}
              <div ref={endRef} />
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-white/8 bg-[#020617] px-3 sm:px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          {error && <div className="mx-auto max-w-4xl mb-2 flex items-start justify-between gap-3 px-3 py-2 rounded-md border border-rose-300/15 bg-rose-300/[.04] text-xs text-rose-200/80"><span className="min-w-0">{error}</span>{retryText && !busy && <button onClick={() => void send(retryText)} className="shrink-0 rounded-md border border-rose-300/25 px-2 py-1 font-medium text-rose-200 hover:bg-rose-300/10 transition-colors">Retry</button>}</div>}
          {run && <div className="mx-auto max-w-4xl mb-2 text-[10px] text-neutral-500">{run.provider || provider}{run.model ? ` · ${run.model}` : ''}{run.latencyMs ? ` · ${(run.latencyMs / 1000).toFixed(1)}s` : ''}{run.tools?.length ? ` · ${run.tools.join(', ')}` : ''}</div>}
          <div className="mx-auto max-w-4xl"><div className="composer"><textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={keyDown} disabled={busy} rows={1} aria-label="Message Lynx Agent" placeholder={mode === 'coding' ? 'Ask about code or your project…' : 'Message Lynx Agent…'} className="composer-input" /><button disabled={!input.trim() || busy} onClick={() => void send()} className="send-btn" aria-label="Send message"><Send className="w-4 h-4" /></button></div><div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-500"><span>Enter to send · Shift+Enter for newline</span><span>{provider === 'auto' ? 'Auto' : provider} · {mode === 'coding' ? 'Coding' : 'General'}</span></div></div>
        </div>
      </section>
    </div>

    {memoryOpen && <div className="fixed inset-0 z-[90] bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-5"><div className="w-full sm:max-w-2xl max-h-[85vh] rounded-t-xl sm:rounded-xl border border-white/10 bg-[#020617] overflow-hidden"><div className="h-14 px-4 flex items-center justify-between border-b border-white/8"><div><div className="text-sm font-semibold text-white">Persistent memory</div><div className="text-[10px] text-neutral-500">Stored facts used as Agent context</div></div><button className="nav-icon-btn" onClick={() => setMemoryOpen(false)} aria-label="Close memory"><X className="w-4 h-4" /></button></div><div className="p-4 overflow-y-auto max-h-[calc(85vh-56px)]">{memoryLoading ? <div className="py-10 text-center text-xs text-neutral-500">Loading memory…</div> : facts.length ? <div className="space-y-2">{facts.map((f) => <div key={f.id} className="p-3 rounded-lg border border-white/8 bg-white/[.02]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-medium text-neutral-200">{f.key}</div><div className="mt-1 text-xs leading-5 text-neutral-400">{f.value}</div><div className="mt-2 text-[10px] text-neutral-500">{f.category}{f.tags.length ? ` · ${f.tags.join(', ')}` : ''}</div></div><button className="nav-icon-btn shrink-0" onClick={() => void removeFact(f.id)} aria-label={`Delete ${f.key}`}><Trash2 className="w-3.5 h-3.5" /></button></div></div>)}</div> : <div className="py-10 text-center text-xs text-neutral-600">No stored facts.</div>}</div></div></div>}

    <style jsx global>{`
      .agent-shell{min-height:100dvh;background:#020617;color:#fff;padding-top:4.75rem;padding-bottom:5.5rem}
      .agent-app{position:relative;display:flex;width:100%;max-width:1560px;margin:auto;height:calc(100dvh - 7.5rem);min-height:620px;overflow:hidden;border:1px solid rgba(255,255,255,.07);background:#0c0e12}
      .nav-icon-btn{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:7px;color:#71717a;background:transparent;transition:background .15s,color .15s}
      .nav-icon-btn:hover{background:rgba(255,255,255,.05);color:#fff}
      .panel-button{background:#0f1219;border:1px solid rgba(255,255,255,.08)}
      .action-btn{width:100%;height:38px;display:flex;align-items:center;gap:9px;padding:0 11px;border-radius:7px;color:#a1a1aa;font-size:12px;text-align:left;transition:background .15s,color .15s}
      .action-btn:hover{background:rgba(255,255,255,.04);color:#e4e4e7}.action-btn.primary{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#e4e4e7}.action-btn.danger:hover{color:#fda4af;background:rgba(244,63,94,.05)}.action-btn:disabled{opacity:.35;pointer-events:none}
      .label{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#52525b}
      .field{width:100%;height:38px;border:1px solid rgba(255,255,255,.09);border-radius:7px;background:#101218;color:#e4e4e7;padding:0 11px;font-size:12px;outline:none}.field:focus{border-color:rgba(34,211,238,.35);box-shadow:0 0 0 2px rgba(34,211,238,.05)}
      .segmented{display:flex;height:38px;border:1px solid rgba(255,255,255,.09);border-radius:7px;background:#101218;padding:2px}.segmented button{flex:1;border-radius:5px;color:#71717a;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px}.segmented button.selected{background:#1a1d23;color:#f4f4f5}
      .message{border-radius:10px;padding:11px 13px}.user-message{background:#14171f;border:1px solid rgba(255,255,255,.07)}.agent-message{padding-left:0}
      .mini-btn{display:inline-flex;align-items:center;gap:5px;padding:3px 6px;border-radius:5px;color:#52525b;font-size:10px}.mini-btn:hover{background:rgba(255,255,255,.04);color:#a1a1aa}
      .composer{display:flex;align-items:flex-end;gap:8px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:#0f1219;padding:7px}.composer:focus-within{border-color:rgba(34,211,238,.25)}.composer-input{min-height:38px;max-height:180px;flex:1;resize:none;background:transparent;outline:none;color:#e4e4e7;font-size:13px;line-height:20px;padding:9px 7px}.composer-input::placeholder{color:#52525b}.send-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:7px;background:#22d3ee;color:#020617}.send-btn:disabled{opacity:.25;cursor:not-allowed}
      @media(max-width:767px){.agent-shell{padding-top:4.25rem;padding-bottom:4.75rem}.agent-app{height:calc(100dvh - 9rem);min-height:0;border-left:0;border-right:0;border-radius:0}.message{border-radius:9px}.agent-message{padding-left:0}.composer-input{font-size:16px}}
      @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
    `}</style>
  </main>;
}