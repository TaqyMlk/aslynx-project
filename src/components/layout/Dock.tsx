'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, FolderGit2, FlaskConical, UserRound, Search } from 'lucide-react';

export default function Dock() {
  const pathname = usePathname();

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('aslynx:open-search'));
  };

  const dockItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Lab', href: '/lab', icon: FlaskConical },
    { name: 'About', href: '/about', icon: UserRound }
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex md:hidden justify-center px-3 pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <nav aria-label="Primary mobile navigation" className="pointer-events-auto flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl bg-[#0f1219] border border-white/8 max-w-full">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link key={item.name} href={item.href} aria-current={isActive ? 'page' : undefined} className={`relative flex flex-col items-center justify-center min-w-[54px] w-[54px] h-11 rounded-lg transition-colors duration-150 ${isActive ? 'text-cyan-300 bg-white/[0.07]' : 'text-neutral-500 active:text-neutral-200 active:bg-white/[0.04]'}`}>
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
              <span className="text-[10px] leading-none font-medium mt-1">{item.name}</span>
              {isActive && <motion.div layoutId="activeDockIndicator" className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cyan-400" />}
            </Link>
          );
        })}
        <button type="button" onClick={openSearch} aria-label="Open site search" className="relative flex flex-col items-center justify-center min-w-[54px] w-[54px] h-11 rounded-lg text-neutral-500 active:text-neutral-200 active:bg-white/[0.04] transition-colors duration-150">
          <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <span className="text-[10px] leading-none font-medium mt-1">Search</span>
        </button>
      </nav>
    </div>
  );
}