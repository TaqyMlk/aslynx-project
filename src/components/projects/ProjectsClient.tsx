'use client';

import React, { useMemo, useState } from 'react';
import { Project } from '@/src/types';
import ProjectCard from './ProjectCard';
import { Search, Box, SlidersHorizontal } from 'lucide-react';

interface ProjectsClientProps {
  initialProjects: Project[];
  totalDownloads: number;
}

export default function ProjectsClient({ initialProjects, totalDownloads }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'featured'>('downloads');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'minecraft', name: 'Minecraft' },
    { id: 'web', name: 'Web' },
    { id: 'ai', name: 'AI & Automation' },
    { id: 'tools', name: 'Tools' },
  ];

  const filteredProjects = useMemo(() => initialProjects
    .filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      return (selectedCategory === 'all' || p.category === selectedCategory) &&
        (!q || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.technologies.some((t) => t.toLowerCase().includes(q)));
    })
    .sort((a, b) => sortBy === 'downloads'
      ? (b.downloads || 0) - (a.downloads || 0)
      : sortBy === 'name' ? a.name.localeCompare(b.name) : (b.featured ? 1 : 0) - (a.featured ? 1 : 0)),
  [initialProjects, searchQuery, selectedCategory, sortBy]);

  const formattedTotal = totalDownloads > 0 ? `${(totalDownloads / 1000).toFixed(0)}K+` : '350K+';

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20">
      <header className="max-w-3xl mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-400 mb-3">Project archive · {formattedTotal} downloads</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">Projects & Add-ons</h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">Minecraft Bedrock projects, developer tools, and web applications built and maintained by AsLynx.</p>
      </header>

      <section aria-label="Project filters" className="border-y border-white/[0.08] py-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Search projects</span>
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects, technologies, or keywords" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-transparent border border-white/[0.1] text-sm text-white placeholder:text-neutral-600 focus:border-cyan-400/60 focus:outline-none" />
          </label>
          <label className="flex items-center gap-2 sm:w-64">
            <SlidersHorizontal className="w-4 h-4 text-neutral-500 shrink-0" />
            <span className="sr-only">Sort projects</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'downloads' | 'name' | 'featured')} aria-label="Sort projects" className="w-full px-3 py-2.5 rounded-lg bg-transparent border border-white/[0.1] text-sm text-neutral-300 focus:border-cyan-400/60 focus:outline-none">
              <option value="downloads">Most downloaded</option>
              <option value="featured">Featured first</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-5 overflow-x-auto pt-4 pb-1">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} aria-pressed={selectedCategory === cat.id} className={`shrink-0 text-sm transition-colors ${selectedCategory === cat.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between text-xs text-neutral-500 mb-5">
        <span>{filteredProjects.length} projects</span>
        {searchQuery && <button onClick={() => setSearchQuery('')} className="text-cyan-400 hover:text-cyan-300">Clear search</button>}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      ) : (
        <div className="border-y border-white/[0.08] py-16 text-center max-w-lg mx-auto">
          <Box className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-base font-semibold text-white mb-2">No matching projects</h2>
          <p className="text-sm text-neutral-500 mb-5">Try another search or category.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="text-sm text-cyan-400 hover:text-cyan-300">Reset filters</button>
        </div>
      )}
    </main>
  );
}
