import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS, getProjectBySlug } from '@/src/data/projects';
import { fetchCurseForgeStats } from '@/src/server/curseforge/client';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found — AsLynx'
    };
  }

  return {
    title: `${project.name} — AsLynx Project`,
    description: project.tagline || project.description.en,
    openGraph: {
      title: `${project.name} — AsLynx Bedrock & Web Project`,
      description: project.description.en
    }
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Fetch live stats for updated download count
  const stats = await fetchCurseForgeStats().catch(() => null);
  const liveMatch = stats?.projects?.find((p) => p.slug === project.slug || p.id === project.curseForgeId);
  const liveProject = liveMatch ? { ...project, downloads: liveMatch.downloads } : project;

  // Related projects
  const related = PROJECTS.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 3);

  return <ProjectDetailClient project={liveProject} relatedProjects={related} />;
}
