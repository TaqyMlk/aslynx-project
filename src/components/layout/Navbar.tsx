'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Home, FolderGit2, FlaskConical, UserRound, Search, X, ArrowUpRight, Wrench, Terminal, Menu } from 'lucide-react';

type SearchResult = { title: string; href: string; description: string };

const SITE_INDEX: SearchResult[] = [
  { title: 'Home', href: '/', description: 'Profile, capabilities, selected work and contact' },
  { title: 'Projects', href: '/projects', description: 'Minecraft Bedrock add-ons and development projects' },
  { title: 'About', href: '/about', description: 'Background, engineering focus and experience' },
  { title: 'My Lab', href: '/lab', description: 'Public developer tools and experiments' },
  { title: 'AI Lite', href: '/lab/ai-lite', description: 'Stateless AI for coding and technical prompts' },
  { title: 'Code Studio', href: '/lab/code-studio', description: 'Browser-based coding workspace' },
  { title: 'Prompt Optimizer', href: '/lab/prompt-optimizer', description: 'Improve prompts for clearer model output' },
  { title: 'Markdown Preview', href: '/lab/markdown-preview', description: 'Write and preview Markdown' },
  { title: 'JSON Validator', href: '/lab/json-validator', description: 'Validate and inspect JSON' },
  { title: 'Regex Tester', href: '/lab/regex-tester', description: 'Test regular expressions' },
  { title: 'Manifest Generator', href: '/lab/manifest-generator', description: 'Generate Minecraft manifests' },
  { title: 'Asset Optimizer', href: '/lab/asset-optimizer', description: 'Optimize project assets' },
  { title: 'Animation Preview', href: '/lab/animation-preview', description: 'Preview animation data' },
  { title: 'Codec Toolkit', href: '/lab/codec-toolkit', description: 'Developer codec utilities' },
  { title: 'Color Palette', href: '/lab/color-palette', description: 'Build and inspect color palettes' },
  { title: 'Entity Flowchart', href: '/lab/entity-flowchart', description: 'Visualize entity logic and relationships' },
  { title: 'Playground', href: '/lab/playground', description: 'Experiment with frontend code' },
  { title: 'Contact', href: '/#contact', description: 'Collaboration and contact information' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pageResults, setPageResults] = useState<SearchResult[]>([]);

  // Smooth scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Lab', href: '/lab', icon: FlaskConical },
    { name: 'About', href: '/about', icon: UserRound }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleOpenSearch = () => { setSearchOpen(true); setQuery(''); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('aslynx:open-search', handleOpenSearch);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('aslynx:open-search', handleOpenSearch);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => {
      const results: SearchResult[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('h1, h2, h3').forEach((element) => {
        const title = element.textContent?.replace(/\s+/g, ' ').trim();
        if (!title || title.length < 2) return;
        const href = element.id ? `${pathname}#${element.id}` : pathname;
        const key = `${title}|${href}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push({ title, href, description: `Section on ${pathname === '/' ? 'the home page' : pathname}` });
      });
      setPageResults(results.slice(0, 40));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchOpen, pathname]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    const all = [...SITE_INDEX, ...pageResults];
    const unique = all.filter((item, index, array) => array.findIndex((other) => other.title === item.title && other.href === item.href) === index);
    if (!normalizedQuery) return SITE_INDEX.slice(0, 8);
    return unique.filter((item) => `${item.title} ${item.description} ${item.href}`.toLowerCase().includes(normalizedQuery)).slice(0, 12);
  }, [normalizedQuery, pageResults]);

  const closeSearch = () => { setSearchOpen(false); setQuery(''); };
  const handleResultClick = (href: string) => {
    closeSearch();
    if (href.startsWith(`${pathname}#`)) {
      const hash = href.slice(pathname.length);
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    }
  };

  useEffect(() => {
    if (!searchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSearch();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        closeSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [searchOpen]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 origin-left z-50 pointer-events-none"
      />

      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 py-3 sm:px-4 sm:py-4">
        <nav aria-label="Primary navigation" className={`w-full max-w-5xl flex items-center justify-between px-3.5 sm:px-5 py-2.5 rounded-2xl border transition-all duration-300 ${scrolled ? 'bg-[#020617]/90 border-slate-800 shadow-xl shadow-black/40 backdrop-blur-xl' : 'bg-[#020617]/40 border-slate-800/50 backdrop-blur-md'}`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 transition-colors group-hover:border-cyan-400/40">
              <span className="font-bold text-[11px] text-cyan-400">AL</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">ASLYNX</span>
                <span aria-label="Online" className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:block">AI & Bedrock systems</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions & Search */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setSearchOpen(true); setQuery(''); }}
              aria-label="Open site search"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-xl transition-all"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <Link
              href="/lab"
              className="hidden md:inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/10"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Lab</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-2xl md:hidden pt-28 px-6 flex flex-col justify-between pb-12"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold text-slate-200 hover:text-cyan-400 transition-colors py-2 border-b border-slate-900"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            href="/lab"
            onClick={() => setMenuOpen(false)}
            className="w-full py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-center text-base flex items-center justify-center gap-2"
          >
            <Terminal className="w-5 h-5" />
            <span>Launch Developer Lab</span>
          </Link>
        </motion.div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 sm:px-4 pt-[10vh] sm:pt-[14vh]">
          <button type="button" aria-label="Close search" onClick={closeSearch} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default" />
          <motion.div role="dialog" aria-modal="true" aria-label="Site search" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-xl bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, tools, pages..." aria-label="Search site" className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600" />
              <button type="button" onClick={closeSearch} aria-label="Close search" className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-[58vh] overflow-y-auto p-2">
              {results.length > 0 ? results.map((result, index) => (
                <Link key={`${result.href}-${result.title}-${index}`} href={result.href} onClick={() => handleResultClick(result.href)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-900 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-200 truncate group-hover:text-cyan-400 transition-colors">{result.title}</div>
                    <div className="text-xs text-slate-500 truncate">{result.description}</div>
                  </div>
                </Link>
              )) : (
                <div className="py-12 text-center text-slate-500 text-sm">No matching pages or tools.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
