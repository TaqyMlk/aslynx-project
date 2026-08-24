'use client';

import React, { useState, useMemo } from 'react';
import { LAB_TOOLS } from '@/src/data/tools';
import ToolCard from '@/src/components/lab/ToolCard';
import { Sparkles, Search, FlaskConical, Bot, Code2, Box, Wrench, Orbit } from 'lucide-react';

export default function LabHubPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Tools', icon: FlaskConical },
    { id: 'ai', name: 'AI & Prompts', icon: Bot },
    { id: 'dev', name: 'Development', icon: Code2 },
    { id: 'minecraft', name: 'Minecraft', icon: Box },
    { id: 'utility', name: 'Utilities', icon: Wrench },
    { id: 'experiment', name: 'Experiments', icon: Orbit }
  ];

  const filteredTools = useMemo(() => {
    return LAB_TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch =
        search === '' ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1219] border border-white/10 text-xs font-medium text-neutral-300 mb-4">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>My Lab Workspace</span>
          <span className="text-neutral-500">•</span>
          <span className="text-cyan-400 font-semibold">12+ Browser Utilities</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Experimental Lab & Developer Tools
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          A suite of high-productivity developer utilities, Minecraft Bedrock schema generators, AI prompt tuners, and interactive code playgrounds.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f1219] p-4 rounded-2xl border-white/10 mb-8 space-y-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tools by name, utility, or keyword (e.g., manifest, regex, prompt, json)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-[#0f1219] hover:bg-white/[0.03] text-neutral-400 hover:text-neutral-200 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="bg-[#0f1219] p-12 rounded-3xl text-center space-y-3 max-w-md mx-auto my-12">
          <FlaskConical className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No tools matched your search</h3>
          <p className="text-xs text-neutral-400">Try changing keywords or clearing the search query.</p>
          <button
            onClick={() => {
              setSearch('');
              setActiveCategory('all');
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
