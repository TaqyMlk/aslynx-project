'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Box, Home, FolderGit2, FlaskConical, Search, X, ArrowUpRight } from 'lucide-react';

type SearchResult = {
  title: string;
  href: string;
  description?: string;
};

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
    { name: 'About', href: '/about', icon: Box }
  ];

  const navigationResults = useMemo<SearchResult[]>(() => [
    { title: 'Home', href: '/', description: 'AsLynx profile, skills, fields and featured work' },
    { title: 'Projects', href: '/projects', description: 'Minecraft Bedrock add-ons and development projects' },
    { title: 'My Lab', href: '/lab', description: 'Public developer tools and experiments' },
    { title: 'About', href: '/#about', description: 'About AsLynx and professional focus' },
    { title: 'Contact', href: '/#contact', description: 'Get in touch and collaboration inquiries' }
  ], []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleOpenSearch = () => {
      setSearchOpen(true);
      setQuery('');
    };

    window.addEventListener('scroll', handleScroll);
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

      document.querySelectorAll('h1, h2, h3, a[href]').forEach((element) => {
        const text = element.textContent?.replace(/\s+/g, ' ').trim();
        if (!text || text.length < 2) return;

        const anchor = element.closest('a') as HTMLAnchorElement | null;
        const href = anchor?.getAttribute('href') || (element.id ? `#${element.id}` : null);
        if (!href || href.startsWith('javascript:') || href === '#') return;

        const key = `${text}|${href}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push({ title: text, href });
      });

      setPageResults(results.slice(0, 80));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchOpen, pathname]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    const all = [...navigationResults, ...pageResults];
    const unique = all.filter((item, index, array) => array.findIndex((other) => other.title === item.title && other.href === item.href) === index);

    if (!normalizedQuery) return navigationResults;

    return unique
      .filter((item) => `${item.title} ${item.description || ''} ${item.href}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 12);
  }, [navigationResults, pageResults, normalizedQuery]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
  };

  const handleResultClick = (href: string) => {
    closeSearch();
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 sm:py-4 transition-all duration-300">
        <nav
          className={`w-full max-w-5xl flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${
            scrolled ? 'glass-panel-elevated shadow-2xl border-white/10' : 'glass-panel border-white/5 shadow-lg'
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-white/15 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <span className="font-bold text-xs bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AL</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">AsLynx</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:inline-block">AI & Bedrock Modder</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href) && link.href !== '/#about';
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                >
                  {isActive && <motion.div layoutId="activeNavBackground" className="absolute inset-0 rounded-lg bg-white/10 border border-white/15 shadow-sm" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setQuery('');
              }}
              aria-label="Search"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </nav>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
          <button type="button" aria-label="Close search" onClick={closeSearch} className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-default" />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-xl glass-panel-elevated border-white/15 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, tools, sections..."
                aria-label="Search"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-zinc-500"
              />
              <button type="button" onClick={closeSearch} aria-label="Close" className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                results.map((result, index) => {
                  const isExternalRoute = result.href.startsWith('/') || result.href.startsWith('#');
                  const targetHref = result.href.startsWith('#') ? `${pathname}${result.href}` : result.href;

                  return isExternalRoute ? (
                    <Link
                      key={`${result.href}-${result.title}-${index}`}
                      href={targetHref}
                      onClick={() => handleResultClick(result.href)}
                      className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl hover:bg-white/10 active:bg-white/15 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{result.title}</div>
                        {result.description && <div className="text-xs text-zinc-500 mt-0.5 truncate">{result.description}</div>}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 shrink-0" />
                    </Link>
                  ) : (
                    <a
                      key={`${result.href}-${result.title}-${index}`}
                      href={result.href}
                      onClick={closeSearch}
                      className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl hover:bg-white/10 transition-colors group"
                    >
                      <div className="text-sm font-medium text-white truncate">{result.title}</div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 shrink-0" />
                    </a>
                  );
                })
              ) : (
                <div className="py-10 text-center text-sm text-zinc-500">No results found.</div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-white/10 text-[10px] text-zinc-600 flex items-center justify-between">
              <span>Search current page content + site navigation</span>
              <span className="hidden sm:inline">ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
