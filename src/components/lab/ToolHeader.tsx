'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, RefreshCw, Copy, Check, ExternalLink } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  category: string;
  badge?: string;
  description: string;
  onReset?: () => void;
  onCopy?: () => void;
  copied?: boolean;
}

export default function ToolHeader({
  title,
  category,
  badge,
  description,
  onReset,
  onCopy,
  copied = false
}: ToolHeaderProps) {
  return (
    <div className="w-full mb-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white px-3 py-1.5 rounded-xl bg-[#0f1219] border border-white/5 hover:border-white/15 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Lab</span>
        </Link>

        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl bg-[#0f1219] border border-white/10 hover:border-white/20 text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Reset inputs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {onCopy && (
            <button
              onClick={onCopy}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-medium text-cyan-400 transition-all flex items-center gap-1.5"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-[#0f1219] p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {category}
          </span>
          {badge && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-white/5 text-neutral-300 border border-white/10">
              {badge}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
