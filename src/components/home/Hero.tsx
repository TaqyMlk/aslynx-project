'use client';

import { BackgroundPaths } from '@/src/components/ui/background-paths';

interface HeroProps {
  totalDownloads: number;
}

export default function Hero({ totalDownloads }: HeroProps) {
  return (
    <BackgroundPaths title="AsLynx — AI, Bedrock & Web Engineering" />
  );
}
