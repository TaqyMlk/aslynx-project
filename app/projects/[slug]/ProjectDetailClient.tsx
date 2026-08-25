'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Project } from '@/src/types';
import ProjectCard from '@/src/components/projects/ProjectCard';
import {
  ChevronLeft,
  Share2,
  Check,
  Flame,
  Github,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Calendar
} from 'lucide-react';

interface Props {
  project: Project;
  relatedProjects: Project[];
}

export default function ProjectDetailClient({ project, relatedProjects }: Props) {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDownloads = project.downloads
    ? project.downloads > 1000
      ? `${(project.downloads / 1000).toFixed(0)}K+`
      : `${project.downloads}`
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-[#020617] border border-white/8 hover:border-white/15 transition-all">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            <button onClick={() => setLang('en')} aria-pressed={lang === 'en'} className={`px-2.5 py-1 rounded-md font-medium transition-all ${lang === 'en' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>EN</button>
            <button onClick={() => setLang('id')} aria-pressed={lang === 'id'} className={`px-2.5 py-1 rounded-md font-medium transition-all ${lang === 'id' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>ID</button>
          </div>

          <button onClick={handleShare} className="p-2 rounded-lg bg-[#020617] border border-white/8 text-neutral-300 hover:text-white transition-colors" title="Share Link">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="bg-[#020617] p-6 sm:p-10 rounded-2xl border border-white/8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/15">{project.category}</span>
            {project.version && <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-neutral-300 border border-white/8">{project.version}</span>}
            {project.status && <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">{project.status.toUpperCase()}</span>}
          </div>

          {formattedDownloads && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#020617] border border-cyan-500/15 text-cyan-400 text-sm font-bold shrink-0">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>{formattedDownloads} Total Downloads</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">{project.name}</h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl mb-8">{lang === 'id' ? project.description.id : project.description.en}</p>

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/8">
          {project.curseForgeUrl && (
            <a href={project.curseForgeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs sm:text-sm transition-all active:scale-95">
              <Flame className="w-4 h-4 text-black" />
              <span>Download on CurseForge</span>
            </a>
          )}

          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#020617] hover:bg-white/[0.03] border border-white/8 hover:border-white/15 text-white font-medium text-xs sm:text-sm transition-all">
              <Github className="w-4 h-4" />
              <span>View Source on GitHub</span>
            </a>
          )}

          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#020617] hover:bg-white/[0.03] border border-white/8 hover:border-white/15 text-white font-medium text-xs sm:text-sm transition-all">
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-[#020617] p-6 sm:p-8 rounded-2xl border border-white/8 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Key Features & Mechanics
          </h2>
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {project.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/8 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-neutral-200 leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#020617] p-6 sm:p-8 rounded-2xl border border-white/8 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Technical Specs
          </h2>

          <div className="space-y-4 text-xs">
            {project.compatibility?.bedrockVersion && (
              <div>
                <span className="text-neutral-500 block mb-1 text-[11px]">Minecraft Compatibility</span>
                <span className="text-neutral-200 font-semibold">{project.compatibility.bedrockVersion}</span>
              </div>
            )}

            {project.compatibility?.scriptApiVersion && (
              <div>
                <span className="text-neutral-500 block mb-1 text-[11px]">Bedrock Script API</span>
                <span className="text-cyan-400 font-mono font-medium">{project.compatibility.scriptApiVersion}</span>
              </div>
            )}

            {project.platform && (
              <div>
                <span className="text-neutral-500 block mb-1 text-[11px]">Supported Platforms</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {project.platform.map((plat, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/8">{plat}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-neutral-500 block mb-1 text-[11px]">Technologies</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {project.technologies.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/8">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {project.changelog && project.changelog.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="bg-[#020617] p-6 sm:p-8 rounded-2xl border border-white/8 mb-12 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Release Changelog
          </h2>
          <div className="space-y-3 pt-2">
            {project.changelog.map((log, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">{log.version}</span>
                  <span className="text-neutral-500">{log.date}</span>
                </div>
                <ul className="space-y-1 text-xs text-neutral-300">
                  {log.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 shrink-0">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {relatedProjects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">Related Creations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => (
              <ProjectCard key={rel.slug} project={rel} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}