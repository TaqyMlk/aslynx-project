'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, FolderGit2, FlaskConical, Box, Search } from 'lucide-react';

export default function Dock() {
  const pathname = usePathname();

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('aslynx:open-search'));
  };

  const dockItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'My Lab', href: '/lab', icon: FlaskConical },
    { name: 'About', href: '/#about', icon: Box }
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex md:hidden justify-center px-3 pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <nav className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-2xl glass-panel-elevated shadow-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-xl max-w-full">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href) && !item.href.includes('#');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-w-[52px] w-[52px] h-12 rounded-xl transition-all duration-200 ${
                isActive ? 'text-cyan-400 bg-white/10' : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-0.5">{item.name}</span>
              {isActive && <motion.div layoutId="activeDockIndicator" className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400" />}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search"
          className="relative flex flex-col items-center justify-center min-w-[52px] w-[52px] h-12 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 active:scale-95 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-0.5">Search</span>
        </button>
      </nav>
    </div>
  );
}
