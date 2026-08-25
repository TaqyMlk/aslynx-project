'use client';

import Link from 'next/link';
import { LabTool } from '@/src/types';
import {
  Bot,
  Code2,
  FileJson,
  CheckSquare,
  Layers,
  Workflow,
  Wand2,
  Binary,
  KeyRound,
  FileText,
  Palette,
  Sparkle,
  Orbit,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ToolCardProps {
  tool: LabTool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-5 h-5 text-cyan-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'FileJson':
        return <FileJson className="w-5 h-5 text-cyan-400" />;
      case 'CheckSquare':
        return <CheckSquare className="w-5 h-5 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'Workflow':
        return <Workflow className="w-5 h-5 text-cyan-400" />;
      case 'Wand2':
        return <Wand2 className="w-5 h-5 text-cyan-400" />;
      case 'Binary':
        return <Binary className="w-5 h-5 text-cyan-400" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-cyan-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-cyan-400" />;
      case 'Sparkle':
        return <Sparkle className="w-5 h-5 text-cyan-400" />;
      case 'Orbit':
        return <Orbit className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <Link
      href={`/lab/${tool.slug}`}
      className="group bg-[#020617] hover:bg-[#020617] p-6 rounded-2xl border border-white/8 flex flex-col justify-between transition-colors h-full"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            {getToolIcon(tool.icon)}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/15">
            {tool.category}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors duration-200">
          {tool.name}
        </h3>

        <p className="text-xs text-neutral-400 leading-relaxed mb-5">{tool.shortDesc}</p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/8">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-white/8 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">
          <span>Launch Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}