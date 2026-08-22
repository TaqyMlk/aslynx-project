import React from 'react';
import Link from 'next/link';
import { SOCIALS } from '@/src/data/socials';
import { Sparkles, Heart, Terminal, Shield, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950/60 backdrop-blur-md pt-12 pb-24 md:pb-12 mt-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-white/10 flex items-center justify-center font-bold text-cyan-400 text-xs">
                AL
              </div>
              <span className="font-bold text-white text-base tracking-tight">AsLynx</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Muhammad Abdulhadi Taqy — AI Prompt Engineer, Web Developer & Minecraft Bedrock Modder with 350K+ downloads.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems & APIs Operational</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home Portfolio
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-400 transition-colors">
                  All Projects & Add-ons
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-cyan-400 transition-colors">
                  My Lab Workspace
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-cyan-400 transition-colors">
                  About & Skills
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-cyan-400 transition-colors">
                  Experience Timeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Lab Tools */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Popular Lab Tools</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/lab/ai-lite" className="hover:text-cyan-400 transition-colors">
                  AI Lite (Stateless)
                </Link>
              </li>
              <li>
                <Link href="/lab/code-studio" className="hover:text-cyan-400 transition-colors">
                  Code Studio Sandbox
                </Link>
              </li>
              <li>
                <Link href="/lab/manifest-generator" className="hover:text-cyan-400 transition-colors">
                  Bedrock Manifest Generator
                </Link>
              </li>
              <li>
                <Link href="/lab/prompt-optimizer" className="hover:text-cyan-400 transition-colors">
                  Prompt Optimizer
                </Link>
              </li>
              <li>
                <Link href="/lab/playground" className="hover:text-cyan-400 transition-colors">
                  3D Quantum Playground
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Connect</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-zinc-500 group-hover:text-cyan-400">
                      {s.username}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AsLynx. All rights reserved. Built with Next.js, React 19 & Tailwind CSS.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fast Vercel Edge Runtime</span>
            <span>•</span>
            <span>Zero-Lag Bedrock Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
