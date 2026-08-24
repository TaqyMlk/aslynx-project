'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getFeaturedProjects } from '@/src/data/projects';
import ProjectCard from '@/src/components/projects/ProjectCard';
import { FolderGit2, ArrowRight } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 flex items-center gap-1.5"><FolderGit2 className="w-3.5 h-3.5" />Curated Portfolio</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Featured Projects & Add-ons</h2>
          <p className="text-sm text-neutral-400 mt-3 max-w-lg">Selected creations with verified downloads, active production usage, and open source repositories.</p>
        </div>
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.slice(0, 6).map((project, idx) => (
          <motion.div key={project.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}