'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Database,
  Search,
  Code2,
  Calendar,
  Layers,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { AgentMessage } from '@/src/types';

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('auto');
  const [toolsActive, setToolsActive] = useState(true);
  const [memoryStats, setMemoryStats] = useState<{ totalMessages: number; engine: string }>({
    totalMessages: 0,
    engine: 'In-Memory / Upstash Ready'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing memory history
  useEffect(() => {
    fetch('/api/agent/chat')
      .then((res) => res.json())
      .then((data) => {
        if (data.history) {
          setMessages(data.history);
          setMemoryStats({
            totalMessages: data.history.length,
            engine: 'In-Memory / Redis Ready'
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setLoading(true);

    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, provider, enableTools: toolsActive })
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setMemoryStats((prev) => ({
          ...prev,
          totalMessages: prev.totalMessages + 2
        }));
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `Execution error: ${data.error || 'Unknown response failure'}`,
            timestamp: Date.now()
          }
        ]);
      }
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Network error: ${err instanceof Error ? err.message : String(err)}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearMemory = async () => {
    try {
      await fetch('/api/agent/chat', { method: 'DELETE' });
      setMessages([]);
      setMemoryStats((prev) => ({ ...prev, totalMessages: 0 }));
    } catch {}
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24 flex flex-col h-[calc(100vh-60px)] min-h-[700px]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-white/10 text-xs font-semibold text-cyan-400 mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Private AI Agent Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Autonomous Lynx Agent
          </h1>
        </div>

        {/* Controls & Memory Clear */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border-white/10 text-xs text-zinc-300">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>{memoryStats.totalMessages} Stored States</span>
          </div>

          <button
            onClick={handleClearMemory}
            className="px-3 py-1.5 rounded-xl glass-panel hover:glass-panel-elevated border-white/10 text-xs font-medium text-rose-400 hover:text-rose-300 transition-all flex items-center gap-1.5"
            title="Wipe conversation memory"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Memory</span>
          </button>
        </div>
      </div>

      {/* Capabilities & Providers Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border-white/10 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium">Provider:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="auto">Auto Router (Smart Fallback)</option>
            <option value="gemini">Google Gemini 2.5 Flash</option>
            <option value="openrouter">OpenRouter (Claude/Llama)</option>
            <option value="groq">Groq LPU (Ultra Low Latency)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <span className="flex items-center gap-1">
            <Search className="w-3 h-3 text-cyan-400" /> Web Search
          </span>
          <span className="flex items-center gap-1">
            <Code2 className="w-3 h-3 text-blue-400" /> Code Evaluator
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-purple-400" /> Time Telemetry
          </span>
        </div>
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 glass-panel-elevated p-6 rounded-3xl border-white/10 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3 py-12">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Lynx Agent Active</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Equipped with persistent memory, Bedrock Script API heuristics, tool orchestration, and automatic multi-provider resilience.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {[
                'Search latest Minecraft Bedrock Script API changes',
                'Calculate 2^16 / 1024 with code evaluator',
                'What is the current UTC timestamp?'
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs border border-white/5 transition-all text-left"
                >
                  &quot;{query}&quot;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 px-1">
                <span>{msg.role === 'user' ? 'Operator' : 'AsLynx Agent'}</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.provider && (
                  <span className="px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 font-mono text-[10px]">
                    {msg.provider}
                  </span>
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[75%] whitespace-pre-wrap font-sans ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium rounded-tr-sm'
                    : 'bg-black/50 border border-white/10 text-zinc-200 rounded-tl-sm font-mono'
                }`}
              >
                {msg.content}

                {/* Tool calls visualizer if available */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Tool Invocations
                    </span>
                    {msg.toolCalls.map((tc, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                        <span className="text-purple-300 font-mono">{tc.name}</span>
                        <pre className="text-[10px] text-zinc-400 overflow-x-auto mt-1">
                          {JSON.stringify(tc.result, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Input Box */}
      <div className="glass-panel-elevated p-3 rounded-2xl border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Command the Lynx Agent or query system memory..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? <Sparkles className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
