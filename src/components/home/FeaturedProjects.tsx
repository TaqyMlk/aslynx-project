'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getFeaturedProjects } from '@/src/data/projects';
import { ArrowRight, ExternalLink, Github, Sparkles, Layers, Terminal } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  const targetRef = useRef<HTMLDivElement | null>(null);

  // Framer motion scroll container tracking
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Transform vertical progress (0 to 1) to horizontal translation percentage
  // Total cards = featured.length, card width calculation
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${Math.max(0, (featured.length - 1) * 35)}%`]);

  return (
    <section id="projects" ref={targetRef} className="relative h-[300vh] bg-[#020617]">
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>SELECTED WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Engineered Add-ons & Tools<span className="text-cyan-400">.</span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>SCROLL HORIZONTALLY</span>
            <span className="animate-pulse text-cyan-400">→</span>
          </div>
        </div>

        {/* Horizontal Track Container */}
        <div className="relative w-full overflow-visible">
          <motion.div style={{ x }} className="flex gap-6 sm:gap-8 w-max">
            {featured.map((project, index) => {
              const projectNum = String(index + 1).padStart(2, '0');
              const downloads = project.downloads
                ? new Intl.NumberFormat('en-US').format(project.downloads)
                : null;

              return (
                <div
                  key={project.slug}
                  className="w-[85vw] sm:w-[500px] md:w-[560px] h-[460px] sm:h-[480px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl relative group hover:border-cyan-500/40 transition-all duration-300 shrink-0"
                >
                  {/* Top bar with index and stats */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="font-mono text-2xl font-bold text-slate-700 group-hover:text-cyan-400/60 transition-colors">
                      {projectNum}
                    </span>
                    {downloads && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/40 text-cyan-300">
                        {downloads} DLs
                      </span>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="my-auto py-4">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6 font-normal">
                      {project.description.en || project.tagline}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.curseForgeUrl && (
                        <a
                          href={project.curseForgeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                          title="CurseForge Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Swipe Notice */}
        <div className="flex sm:hidden items-center justify-center gap-2 mt-4 text-xs font-mono text-slate-500">
          <span>Scroll down to cycle projects</span>
        </div>
      </div>
    </section>
  );
}
