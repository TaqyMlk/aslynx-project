'use client';

import { BackgroundPaths } from '@/src/components/ui/background-paths';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  const formattedDownloads = totalDownloads > 0 ? `${(totalDownloads / 1000).toFixed(0)}K+` : '350K+';

  return (
    <BackgroundPaths title="AsLynx Portfolio">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          AI Prompt Engineer & Bedrock Modder — {formattedDownloads} CurseForge Downloads
        </p>
      </div>
    </BackgroundPaths>
  );
}