'use client';

import React, { useRef, useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Wand2, Copy, Check, Zap, AlertTriangle, RotateCcw } from 'lucide-react';

const TARGET_HINTS: Record<'claude' | 'gpt' | 'gemini', string> = {
  claude: 'Optimize for Anthropic Claude: use XML-style tags for structure (<role>, <task>, <constraints>), explicit thinking guidance, and clear output format rules.',
  gpt: 'Optimize for OpenAI GPT models: use markdown section headers, numbered constraints, and an explicit output contract.',
  gemini: 'Optimize for Google Gemini: keep instructions front-loaded, use concise labeled sections, and state the response format explicitly.'
};

export default function PromptOptimizerPage() {
  const [rawPrompt, setRawPrompt] = useState(
    'I want you to please act as a senior web developer and write a React component for a todo list. Make sure it is nice and clean and has good styling with Tailwind. Also please do not make any bugs and make it work with TypeScript.'
  );
  const [targetModel, setTargetModel] = useState<'claude' | 'gpt' | 'gemini'>('gemini');
  const [enforceStrictJSON, setEnforceStrictJSON] = useState(false);
  const [addChainOfThought, setAddChainOfThought] = useState(true);
  const [optimizedText, setOptimizedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const streamCtrlRef = useRef<AbortController | null>(null);

  const estRawTokens = Math.round(rawPrompt.length / 3.8);
  const estOptimizedTokens = optimizedText ? Math.round(optimizedText.length / 3.8) : 0;

  async function optimize() {
    const draft = rawPrompt.trim();
    if (!draft || loading) return;
    setLoading(true);
    setError(null);
    try {
      const systemPrompt =
        'You are a world-class prompt engineer. Transform rough prompts into precise, structured system directives. Output ONLY the rewritten prompt — no explanations, no code fences.';
      const requirements = [
        `Target model family: ${TARGET_HINTS[targetModel]}`,
        addChainOfThought
          ? 'Include a short structured reasoning anchor (how the model should approach the task internally).'
          : 'Do NOT include chain-of-thought or reasoning instructions.',
        enforceStrictJSON
          ? 'Require the final output to be strictly valid JSON with a documented schema.'
          : 'Specify a clear plain-text response format.',
        'Preserve the original intent fully; add missing constraints a senior engineer would expect (edge cases, quality bars, what to avoid).',
        'Keep it under 250 words.'
      ].join('\n- ');

      const res = await fetch('/api/ai-lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Rewrite this rough prompt into a production-grade directive.\n\nRequirements:\n- ${requirements}\n\nRough prompt:\n"""\n${draft}\n"""`
            }
          ],
          mode: 'general'
        })
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({} as any));
        throw new Error(d?.error || 'Optimization failed. Please retry.');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Stream unavailable');
      const decoder = new TextDecoder();
      let fullText = '';
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
            if (parsed.type === 'token') fullText += parsed.text;
            else if (parsed.type === 'error') throw new Error(parsed.message || 'Stream error');
            else if (parsed.type === 'done' && !fullText) fullText = parsed.text || '';
          } catch {}
        }
      }

      if (!fullText) throw new Error('The optimizer returned an empty result. Please retry.');
      setOptimizedText(fullText.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (!optimizedText) return;
    navigator.clipboard.writeText(optimizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="System Prompt Optimizer"
        category="AI & Prompts"
        badge="Clarity & Compression"
        description="Refine fuzzy prompt concepts into structured, deterministic system directives — powered by live AI, tuned to your target model."
        onCopy={handleCopy}
        copied={copied && Boolean(optimizedText)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (Left 6 cols) */}
        <div className="lg:col-span-6 bg-[#14171f] p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Draft Prompt Concept</h3>
            <span className="text-xs text-neutral-500 font-mono">~{estRawTokens} tokens</span>
          </div>

          <textarea
            rows={6}
            aria-label="Draft prompt to optimize"
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            maxLength={8000}
            className="w-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/10 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 leading-relaxed"
          />

          <div className="space-y-3 pt-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 mb-1.5">Target model family</div>
              <div className="grid grid-cols-3 gap-2">
                {(['gemini', 'claude', 'gpt'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={targetModel === m}
                    onClick={() => setTargetModel(m)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      targetModel === m
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addChainOfThought}
                  onChange={(e) => setAddChainOfThought(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                />
                <span>Inject Structured Chain-of-Thought Anchor</span>
              </label>

              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceStrictJSON}
                  onChange={(e) => setEnforceStrictJSON(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                />
                <span>Enforce Strict Deterministic JSON Output</span>
              </label>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 px-3 py-2 rounded-xl border border-rose-400/20 bg-rose-400/5 text-xs text-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="min-w-0 flex-1">{error}</span>
                <button type="button" onClick={() => void optimize()} className="shrink-0 font-semibold underline underline-offset-2 hover:text-rose-100">
                  Retry
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => void optimize()}
              disabled={loading || !rawPrompt.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:pointer-events-none text-neutral-900 text-sm font-bold transition-all inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>Optimizing…</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{optimizedText ? 'Re-optimize' : 'Optimize Prompt'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optimized Output (Right 6 cols) */}
        <div className="lg:col-span-6 bg-[#14171f] p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                <span>Optimized Directive</span>
              </span>
              {loading && <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-[10px] animate-pulse">Generating…</span>}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!optimizedText || loading}
              aria-label="Copy optimized prompt"
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {optimizedText ? (
            <pre className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-200 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {optimizedText}
            </pre>
          ) : (
            <div className="min-h-[220px] rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center gap-2">
              {loading ? (
                <>
                  <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                  <p className="text-xs text-neutral-500">Rewriting your prompt into a structured directive…</p>
                </>
              ) : (
                <>
                  <RotateCcw className="w-6 h-6 text-neutral-600" />
                  <p className="text-xs text-neutral-500 max-w-[240px]">
                    Your optimized prompt will appear here. Pick options on the left, then press "Optimize Prompt".
                  </p>
                </>
              )}
            </div>
          )}

          <div className="p-3 rounded-xl bg-white/5 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Estimated Token Weight: <strong className="text-cyan-400 font-mono">{estOptimizedTokens ? `${estOptimizedTokens} tokens` : '—'}</strong></span>
            <span>Target: <strong className="text-emerald-400 uppercase">{targetModel}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}