'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { getFeaturedProjects } from '@/src/data/projects';
import { ArrowRight, ExternalLink, Github, Layers } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-cyan-400 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Featured works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Engineered add-ons & systems
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <span>view full archive</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {featured.map((project, index) => {
          const projectNum = String(index + 1).padStart(2, '0');
          const downloads = project.downloads
            ? new Intl.NumberFormat('en-US').format(project.downloads)
            : null;

          return (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.1 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="group relative bg-[#0b1224]/60 hover:bg-[#0b1224]/90 border border-white/[0.07] hover:border-cyan-500/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="font-mono text-sm font-bold text-slate-600 group-hover:text-cyan-400/80 transition-colors">
                    {projectNum}
                  </span>
                  {downloads && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-slate-400 group-hover:text-slate-300 transition-colors">
                      {downloads} installs
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-medium mb-1.5 block">
                  {project.category}
                </span>

                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 tracking-tight group-hover:text-cyan-200 transition-colors">
                  {project.name}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-400 line-clamp-3 leading-relaxed mb-5">
                  {project.description.en || project.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-5">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors"
                >
                  <span>Case study</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="flex items-center gap-2">
                  {project.curseForgeUrl && (
                    <a
                      href={project.curseForgeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
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
                      className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
