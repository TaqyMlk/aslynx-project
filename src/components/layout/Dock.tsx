'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, FolderGit2, FlaskConical, Download, MessageSquare } from 'lucide-react';

export default function Dock() {
  const pathname = usePathname();

  const dockItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Lab', href: '/lab', icon: FlaskConical },
    { name: 'Drive', href: '/#google-drive-export', icon: Download },
    { name: 'Contact', href: '/#contact', icon: MessageSquare }
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex md:hidden justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-panel-elevated shadow-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-xl">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href) && !item.href.includes('#');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 bg-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-0.5">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
