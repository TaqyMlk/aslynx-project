'use client';

import Link from 'next/link';
import { Project } from '@/src/types';
import { Flame, ArrowRight, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const categoryBadgeColor: Record<string, string> = {
    minecraft: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    web: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ai: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    tools: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    experiments: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    other: 'bg-zinc-500/10 text-neutral-400 border-zinc-500/20'
  };

  const formattedDownloads = project.downloads
    ? project.downloads > 1000
      ? `${(project.downloads / 1000).toFixed(0)}K+`
      : `${project.downloads}`
    : null;

  return (
    <div className="bg-[#020617] hover:bg-[#020617] p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between transition-colors group h-full">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
<span className={`px-2 py-0.5 rounded-lg border ${
                categoryBadgeColor[project.category] || categoryBadgeColor.other
              }`}>
              {project.category}
            </span>

          {formattedDownloads && (
            <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formattedDownloads}</span>
            </div>
          )}
        </div>

        {/* Project Name & Tagline */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.name}</Link>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5">
          {project.tagline || project.description.en}
        </p>

        {/* Features preview */}
        {project.features && project.features.length > 0 && (
          <ul className="space-y-1.5 mb-6">
            {project.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-500 border border-white/5">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Link */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-2">
            {project.curseForgeUrl && (
              <a
                href={project.curseForgeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="CurseForge Page"
              >
                <Flame className="w-4 h-4 text-cyan-400" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
