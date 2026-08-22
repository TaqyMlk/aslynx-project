export type ProjectCategory = 'minecraft' | 'web' | 'ai' | 'tools' | 'experiments' | 'other';

export type ProjectStatus = 'active' | 'archived' | 'experimental' | 'featured';

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  description: {
    id: string;
    en: string;
  };
  features: string[];
  version?: string;
  curseForgeId?: number;
  curseForgeSlug?: string;
  downloads?: number;
  platform?: string[];
  technologies: string[];
  url?: string;
  github?: string;
  curseForgeUrl?: string;
  image?: string;
  screenshots?: string[];
  featured?: boolean;
  status?: ProjectStatus;
  changelog?: { version: string; date: string; changes: string[] }[];
  compatibility?: {
    bedrockVersion?: string;
    scriptApiVersion?: string;
    browserSupport?: string[];
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: string;
    tags: string[];
    description: string;
    highlight?: boolean;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  badge: string;
  description: {
    id: string;
    en: string;
  };
  highlights: string[];
  technologies: string[];
}

export interface LabTool {
  id: string;
  slug: string;
  name: string;
  category: 'ai' | 'dev' | 'minecraft' | 'utility' | 'experiment';
  icon: string;
  badge?: string;
  shortDesc: string;
  description: {
    id: string;
    en: string;
  };
  tags: string[];
  featured?: boolean;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  toolCalls?: {
    name: string;
    args: Record<string, unknown>;
    result?: unknown;
  }[];
  modelUsed?: string;
  provider?: string;
  latencyMs?: number;
}

export interface AgentSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  summary?: string;
}

export interface MemoryFact {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'project' | 'knowledge' | 'system' | 'custom';
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CurseForgeStatsResponse {
  totalDownloads: number;
  lastUpdated: string;
  projects: {
    id: number;
    slug: string;
    name: string;
    downloads: number;
    updatedAt: string;
  }[];
}
