'use client';

import Link from 'next/link';
import { getFeaturedProjects } from '@/src/data/projects';
import { ArrowRight, ExternalLink, Github, Layers } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Selected works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Engineered add-ons & tools
          </h2>
        </div>
        <Link href="/projects" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {featured.map((project, index) => {
          const projectNum = String(index + 1).padStart(2, '0');
          const downloads = project.downloads ? new Intl.NumberFormat('en-US').format(project.downloads) : null;
          return (
            <article
              key={project.slug}
              className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/10 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="font-mono text-sm font-bold text-slate-600">{projectNum}</span>
                  {downloads && (
                    <span className="text-[11px] font-mono px-2 py-1 rounded bg-white/[0.04] border border-white/5 text-slate-400">
                      {downloads} downloads
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-1.5 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{project.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {project.description.en || project.tagline}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/5">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
                >
                  View project <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center gap-2">
                  {project.curseForgeUrl && (
                    <a
                      href={project.curseForgeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 transition-colors"
                      title="CurseForge"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
