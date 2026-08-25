'use client';

import Link from 'next/link';
import { ChevronLeft, Copy, Check, RotateCw } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  category: string;
  description: string;
  onReset?: () => void;
  onCopy?: () => void;
  copied?: boolean;
  badge?: string;
}

export default function ToolHeader({
  title,
  category,
  description,
  onReset,
  onCopy,
  copied = false
}: ToolHeaderProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link href="/lab" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-[#020617] border border-white/8 hover:border-white/15 transition-all">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Lab</span>
        </Link>

        <div className="flex items-center gap-2">
          {onReset && (
            <button onClick={onReset} title="Reset inputs" className="px-3 py-1.5 rounded-lg bg-[#020617] border border-white/8 hover:border-white/15 text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {onCopy && (
            <button onClick={onCopy} title="Copy output" className="px-3 py-1.5 rounded-lg bg-[#020617] border border-cyan-500/20 text-cyan-400 text-xs font-medium transition-all flex items-center gap-1.5 hover:bg-cyan-500/10">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#020617] p-6 sm:p-8 rounded-2xl border border-white/8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/15 mb-3 block w-fit">{category}</span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{title}</h1>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
}