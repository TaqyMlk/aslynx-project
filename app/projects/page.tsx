import { Metadata } from 'next';
import { PROJECTS } from '@/src/data/projects';
import { fetchCurseForgeStats } from '@/src/server/curseforge/client';
import ProjectsClient from '@/src/components/projects/ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects & Minecraft Add-ons — AsLynx',
  description: 'Explore all Minecraft Bedrock add-ons with 350K+ CurseForge downloads, open source web apps, and developer tools by AsLynx.'
};

export const revalidate = 900;

export default async function ProjectsPage() {
  const stats = await fetchCurseForgeStats().catch(() => ({ totalDownloads: 350000, projects: [] }));

  // Merge live downloads into initial projects
  const updatedProjects = PROJECTS.map((p) => {
    const liveMatch = stats.projects?.find((item) => item.slug === p.slug || item.id === p.curseForgeId);
    if (liveMatch && liveMatch.downloads > (p.downloads || 0)) {
      return { ...p, downloads: liveMatch.downloads };
    }
    return p;
  });

  return <ProjectsClient initialProjects={updatedProjects} totalDownloads={stats.totalDownloads} />;
}
