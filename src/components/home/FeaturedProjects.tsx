'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getFeaturedProjects } from '@/src/data/projects';
import ProjectCard from '@/src/components/projects/ProjectCard';
import { FolderGit2, ArrowRight } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();
  return <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"><div><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-3"><FolderGit2 className="w-3.5 h-3.5" />Curated Portfolio</div><h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Featured Projects & Add-ons</h2><p className="text-sm text-neutral-400 mt-2">Selected creations with verified downloads, active production usage, and open source repositories.</p></div><Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white transition-colors whitespace-nowrap"><span>View All Projects</span><ArrowRight className="w-4 h-4" /></Link></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{featured.slice(0, 6).map((project, idx) => <motion.div key={project.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}><ProjectCard project={project} /></motion.div>)}</div></section>;
}
