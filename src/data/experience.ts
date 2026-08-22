import { ExperienceItem } from '@/src/types';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'ai-prompt-engineer',
    role: 'AI Prompt Engineer & Agent Architect',
    organization: 'Independent / AsLynx Ecosystem',
    period: '2023 — Present',
    location: 'Remote, Indonesia',
    badge: 'Core Specialization',
    description: {
      id: 'Merancang arsitektur sistem prompt tingkat tinggi, orkestrasi agent multi-step dengan memori jangka panjang, optimasi token LLM, dan integrasi workflow otomatisasi kode berbasis AI.',
      en: 'Architecting high-precision system prompts, multi-step agent orchestration with persistent long-term memory, token cost optimization, and automated AI-powered development workflows.'
    },
    highlights: [
      'Developed autonomous AI Agent architectures with tool-calling loops (web search, datetime, code executor, memory storage)',
      'Constructed deterministic prompt matrices yielding >95% accuracy in complex structured code generation',
      'Engineered multi-provider fallback layers across Gemini, OpenRouter, and Groq with sub-second latency routing',
      'Built developer tools for prompt clarity scoring and token budget compression'
    ],
    technologies: ['Gemini API', 'OpenRouter', 'Groq', 'Prompt Engineering', 'LangChain Patterns', 'TypeScript']
  },
  {
    id: 'minecraft-bedrock-creator',
    role: 'Minecraft Bedrock Modder & Script Engineer',
    organization: 'CurseForge & Community Publisher',
    period: '2021 — Present',
    location: 'Global Community',
    badge: '350K+ Downloads',
    description: {
      id: 'Mengembangkan add-on Minecraft Bedrock populer dengan total lebih dari 350.000 unduhan di CurseForge. Berfokus pada peningkatan Quality of Life, sistem script API zero-lag, dan utilitas survival.',
      en: 'Created top-tier Minecraft Bedrock add-ons garnering over 350,000+ total downloads on CurseForge. Focused on Quality of Life enhancements, zero-lag Script API systems, and survival mechanics.'
    },
    highlights: [
      'Created Lynx Quality Tools, Lynx Simple Treecapitator, and Lynx Simple Vein Miner with stellar community ratings',
      'Engineered zero-lag tick loops using @minecraft/server Script API with native Molang event hooks',
      'Authored in-game interactive modal interfaces utilizing @minecraft/server-ui',
      'Maintained consistent version compatibility across major Minecraft Bedrock updates (1.19 through 1.21+)'
    ],
    technologies: ['Bedrock Script API', 'JavaScript', 'JSON Schemas', 'Molang', 'CurseForge API']
  },
  {
    id: 'web-developer',
    role: 'Full-Stack Web Developer',
    organization: 'Modern Web Solutions',
    period: '2022 — Present',
    location: 'Remote',
    badge: 'Next.js & React',
    description: {
      id: 'Membangun aplikasi web interaktif, dashboard utilitas modern, dan platform teknologi terpadu dengan Next.js App Router, TypeScript, dan Tailwind CSS.',
      en: 'Building high-performance interactive web applications, modern utility workspaces, and unified technology platforms with Next.js App Router, TypeScript, and Tailwind CSS.'
    },
    highlights: [
      'Created modern responsive web platforms with iOS-inspired Dark Matte Glossy Glass design systems',
      'Integrated live CurseForge API statistics with server-side caching and resilient fallback layers',
      'Engineered 12+ client-side sandbox tools including live code editors, JSON validators, and Bedrock manifest generators',
      'Achieved 95+ Lighthouse performance scores with optimized server-side rendering and asset delivery'
    ],
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vercel']
  }
];
