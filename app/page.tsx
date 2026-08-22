import React from 'react';
import Hero from '@/src/components/home/Hero';
import GoogleDriveExportSection from '@/src/components/home/GoogleDriveExportSection';
import AboutSection from '@/src/components/home/AboutSection';
import FieldsSection from '@/src/components/home/FieldsSection';
import SkillsSection from '@/src/components/home/SkillsSection';
import ExperienceSection from '@/src/components/home/ExperienceSection';
import FeaturedProjects from '@/src/components/home/FeaturedProjects';
import ContactSection from '@/src/components/home/ContactSection';
import { fetchCurseForgeStats } from '@/src/server/curseforge/client';

export const revalidate = 900; // 15 minutes ISR

export default async function HomePage() {
  const stats = await fetchCurseForgeStats().catch(() => ({ totalDownloads: 350000 }));

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-8">
      <Hero totalDownloads={stats.totalDownloads} />
      <GoogleDriveExportSection />
      <AboutSection />
      <FieldsSection />
      <SkillsSection />
      <ExperienceSection />
      <FeaturedProjects />
      <ContactSection />
    </div>
  );
}
