'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '@/src/types';
import ProjectCard from './ProjectCard';
import { Search, Filter, Box, Flame, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProjectsClientProps {
  initialProjects: Project[];
  totalDownloads: number;
}

export default function ProjectsClient({ initialProjects, totalDownloads }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'featured'>('downloads');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'minecraft', name: 'Minecraft Bedrock' },
    { id: 'web', name: 'Web Applications' },
    { id: 'ai', name: 'AI & Automation' },
    { id: 'tools', name: 'Tools & Utilities' }
  ];

  const filteredProjects = useMemo(() => {
    return initialProjects
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          searchQuery === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') {
          return (b.downloads || 0) - (a.downloads || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'featured') {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        return 0;
      });
  }, [initialProjects, searchQuery, selectedCategory, sortBy]);

  const formattedTotal = totalDownloads > 0 ? `${(totalDownloads / 1000).toFixed(0)}K+` : '350K+';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-medium text-zinc-300 mb-4">
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span>Complete Catalog</span>
          <span className="text-zinc-500">•</span>
          <span className="text-cyan-400 font-semibold">{formattedTotal} Downloads</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          All Projects & Add-ons
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Explore official Minecraft Bedrock add-ons, open source developer tools, and modern web applications built by AsLynx.
        </p>
      </div>

      {/* Controls: Search, Categories & Sort */}
      <div className="glass-panel p-4 rounded-2xl border-white/10 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Search projects"
              placeholder="Search by project name, keywords, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'downloads' | 'name' | 'featured')}
              aria-label="Sort projects"
              className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors w-full sm:w-auto cursor-pointer"
            >
              <option value="downloads">Most Popular / Downloads</option>
              <option value="featured">Featured First</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 px-1">
        <span>Showing {filteredProjects.length} projects</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-cyan-400 hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 max-w-md mx-auto my-12">
          <Box className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching projects found</h3>
          <p className="text-xs text-zinc-400">
            Try adjusting your search query or switching to another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
