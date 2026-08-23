'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Wand2, Sparkles, Gauge, CheckCircle2, Copy, Check, Zap } from 'lucide-react';

export default function PromptOptimizerPage() {
  const [rawPrompt, setRawPrompt] = useState(
    'I want you to please act as a senior web developer and write a React component for a todo list. Make sure it is nice and clean and has good styling with Tailwind. Also please do not make any bugs and make it work with TypeScript.'
  );
  const [targetModel, setTargetModel] = useState<'claude' | 'gpt' | 'gemini'>('gemini');
  const [enforceStrictJSON, setEnforceStrictJSON] = useState(false);
  const [addChainOfThought, setAddChainOfThought] = useState(true);
  const [copied, setCopied] = useState(false);

  // Optimization simulation
  const estRawTokens = Math.round(rawPrompt.length / 3.8);

  const optimizedText = `[ROLE]: Senior Web Developer & React/TypeScript Specialist

[TASK]: Implement a production-grade Todo List component using React 19, TypeScript, and Tailwind CSS.

[CONSTRAINTS]:
- Strict TypeScript typing (no \`any\` types)
- Pure functional component with React hooks
- Responsive, dark-mode compatible Tailwind CSS utility classes
- Full event handler implementation with local state persistence
${enforceStrictJSON ? '- Output format must strictly conform to valid JSON format with zero conversational markup' : ''}
${addChainOfThought ? '[REASONING PROCESS]: First verify state schemas, validate input sanitization, and output clean code.' : ''}

[EXECUTION DIRECTIVE]: Deliver concise, drop-in replacement code without conversational fluff or placeholders.`;

  const estOptimizedTokens = Math.round(optimizedText.length / 3.8);
  const clarityScore = Math.min(98, 70 + (enforceStrictJSON ? 12 : 0) + (addChainOfThought ? 15 : 5));

  const handleCopy = () => {
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
        description="Refine fuzzy prompt concepts into structured, deterministic system directives with role boundaries and constraint compilers."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (Left 6 cols) */}
        <div className="lg:col-span-6 glass-panel-elevated p-6 rounded-3xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Draft Prompt Concept</h3>
            <span className="text-xs text-zinc-500 font-mono">~{estRawTokens} tokens</span>
          </div>

          <textarea
            rows={6}
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            className="w-full p-4 font-mono text-xs text-zinc-200 bg-black/40 border border-white/10 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 leading-relaxed"
          />

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-3 gap-2">
              {(['gemini', 'claude', 'gpt'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTargetModel(m)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    targetModel === m
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addChainOfThought}
                  onChange={(e) => setAddChainOfThought(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                />
                <span>Inject Structured Chain-of-Thought Anchor</span>
              </label>

              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceStrictJSON}
                  onChange={(e) => setEnforceStrictJSON(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                />
                <span>Enforce Strict Deterministic Output Boundary</span>
              </label>
            </div>
          </div>
        </div>

        {/* Optimized Output (Right 6 cols) */}
        <div className="lg:col-span-6 glass-panel-elevated p-6 rounded-3xl border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                <span>Optimized Directive</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                Score: {clarityScore}/100
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs text-zinc-200 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {optimizedText}
          </pre>

          <div className="p-3 rounded-xl bg-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Estimated Token Weight: <strong className="text-cyan-400 font-mono">{estOptimizedTokens} tokens</strong></span>
            <span>Deterministic Rating: <strong className="text-emerald-400">High</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
