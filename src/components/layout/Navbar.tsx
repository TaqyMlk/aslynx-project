'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, FolderGit2, FlaskConical, UserRound, Search, X, ArrowUpRight, Wrench } from 'lucide-react';

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
  const [query, setQuery] = useState('');
  const [pageResults, setPageResults] = useState<SearchResult[]>([]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'My Lab', href: '/lab', icon: FlaskConical },
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
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 py-3 sm:px-4 sm:py-4">
        <nav
          aria-label="Primary navigation"
          className={`w-full max-w-5xl flex items-center justify-between px-3.5 sm:px-5 py-2.5 rounded-2xl border backdrop-blur-xl transition-colors duration-200 ${
            scrolled ? 'bg-white/[0.055] border-white/[0.13] shadow-[0_16px_40px_-28px_rgba(0,0,0,.95)]' : 'bg-black/[0.2] border-white/[0.08]'
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:border-white/20">
              <span className="font-semibold text-[11px] text-white">AL</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm sm:text-base tracking-tight text-white group-hover:text-neutral-200 transition-colors">AsLynx</span>
                <span aria-label="Online" className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
              <span className="text-[11px] text-neutral-500 hidden sm:block">AI & Bedrock systems</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 bg-[#0f1219] p-1 rounded-xl border border-white/10">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link key={link.name} href={link.href} aria-current={isActive ? 'page' : undefined} className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04]'}`}>
                  {isActive && <motion.span layoutId="activeNavBackground" className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.08]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <button type="button" onClick={() => { setSearchOpen(true); setQuery(''); }} aria-label="Open site search" className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] px-3 py-1.5 rounded-lg transition-colors active:bg-white/[0.1]">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </nav>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 sm:px-4 pt-[10vh] sm:pt-[14vh]">
          <button type="button" aria-label="Close search" onClick={closeSearch} className="absolute inset-0 bg-black/80 cursor-default" />
          <motion.div role="dialog" aria-modal="true" aria-label="Site search" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-xl bg-[#0f1219] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
              <Search className="w-4.5 h-4.5 text-neutral-300 shrink-0" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, tools, pages..." aria-label="Search site" className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-neutral-600" />
              <button type="button" onClick={closeSearch} aria-label="Close search" className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-[58vh] overflow-y-auto p-2">
              {results.length > 0 ? results.map((result, index) => {
                const internal = result.href.startsWith('/');
                const isHash = result.href.includes('#');
                return internal ? (
                  <Link key={`${result.href}-${result.title}-${index}`} href={result.href} onClick={() => handleResultClick(result.href)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.035] border border-white/[0.06] flex items-center justify-center shrink-0">
                      {result.href.startsWith('/lab') ? <Wrench className="w-3.5 h-3.5 text-neutral-500" /> : <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />}
                    </div>
                    <div className="min-w-0 flex-1"><div className="text-sm font-medium text-neutral-100 truncate">{result.title}</div><div className="text-xs text-neutral-600 mt-0.5 truncate">{result.description}</div></div>
                    {isHash && <span className="text-[10px] text-neutral-700">section</span>}
                  </Link>
                ) : null;
              }) : (
                <div className="py-12 text-center"><Search className="w-5 h-5 mx-auto text-neutral-700" /><p className="mt-2 text-sm text-neutral-500">No matching pages or tools.</p></div>
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-white/[0.07] text-[11px] text-neutral-600 flex items-center justify-between"><span>Pages, tools and current-page sections</span><span className="hidden sm:inline">Esc to close · Ctrl K</span></div>
          </motion.div>
        </div>
      )}
    </>
  );
}
