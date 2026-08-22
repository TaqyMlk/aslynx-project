import { SkillCategory } from '@/src/types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai',
    name: 'AI & Prompt Engineering',
    iconName: 'Sparkles',
    description: 'System prompt architecture, multi-agent pipelines, context optimization, and automated LLM coding workflows.',
    skills: [
      {
        name: 'Prompt Engineering',
        level: 'Expert',
        tags: ['System Prompts', 'Few-Shot', 'Chain-of-Thought', 'Constraint Enforcing'],
        description: 'Crafting robust, high-precision prompts for complex reasoning, code generation, and structured JSON outputs.',
        highlight: true
      },
      {
        name: 'LLM Orchestration & Workflows',
        level: 'Advanced',
        tags: ['Multi-Agent', 'Tool Calling', 'Retrieval Augmented', 'Context Window'],
        description: 'Designing autonomous agent loops, memory recall architectures, and multi-model fallback pipelines.',
        highlight: true
      },
      {
        name: 'AI-Assisted Development',
        level: 'Expert',
        tags: ['Code Generation', 'Automated Refactoring', 'Architecture Planning'],
        description: 'Accelerating production-ready engineering cycles with advanced AI pairing and rapid prototyping.'
      },
      {
        name: 'Model Routing & Provider Pools',
        level: 'Advanced',
        tags: ['Gemini 2.5/3.5', 'OpenRouter', 'Groq', 'Fallback Handlers'],
        description: 'Optimizing token costs, latency, and throughput by intelligent request routing across provider tiers.'
      }
    ]
  },
  {
    id: 'minecraft',
    name: 'Minecraft Bedrock Modding',
    iconName: 'Box',
    description: 'Official Bedrock Script API, behavior packs, custom mechanics, Molang expressions, and multiplayer performance optimization.',
    skills: [
      {
        name: 'Bedrock Script API (@minecraft/server)',
        level: 'Expert',
        tags: ['Events', 'World Mutations', 'Dynamic Properties', 'Tick Loops'],
        description: 'Building intricate server-side gameplay systems, custom entities, and low-latency tick handlers.',
        highlight: true
      },
      {
        name: 'Bedrock UI (@minecraft/server-ui)',
        level: 'Expert',
        tags: ['ActionForm', 'ModalForm', 'MessageForm', 'Interactive Menus'],
        description: 'Designing native, user-friendly in-game UI menus and multi-page configuration panels.'
      },
      {
        name: 'Behavior & Resource Pack Architecture',
        level: 'Expert',
        tags: ['Entity Components', 'Custom Items', 'Loot Tables', 'Molang'],
        description: 'Architecting modular, vanilla-compatible packs that seamlessly install across PC, Mobile, and Consoles.',
        highlight: true
      },
      {
        name: 'Bedrock Performance Optimization',
        level: 'Advanced',
        tags: ['Zero-Lag Loops', 'Memory Management', 'Chunk Telemetry'],
        description: 'Eliminating frame drops and tick stutter on high-capacity Realms and BDS Dedicated servers.'
      }
    ]
  },
  {
    id: 'web',
    name: 'Modern Web Engineering',
    iconName: 'Layout',
    description: 'Modern front-end & full-stack development with Next.js, React, TypeScript, Tailwind CSS, and fluid animations.',
    skills: [
      {
        name: 'Next.js (App Router)',
        level: 'Expert',
        tags: ['Server Components', 'Route Handlers', 'Optimization', 'Edge Middleware'],
        description: 'Building scalable, SEO-optimized web applications with modern Next.js 15+ architecture.',
        highlight: true
      },
      {
        name: 'React 19 & TypeScript',
        level: 'Expert',
        tags: ['Hooks', 'Type Safety', 'State Machines', 'Component Primitives'],
        description: 'Writing maintainable, strongly typed component hierarchies and deterministic state managers.',
        highlight: true
      },
      {
        name: 'Tailwind CSS & Design Systems',
        level: 'Expert',
        tags: ['Glassmorphism', 'Responsive UI', 'iOS Design', 'Dark Mode'],
        description: 'Crafting bespoke dark matte glossy glass interfaces with precision typography and micro-interactions.'
      },
      {
        name: 'Motion (Framer Motion)',
        level: 'Advanced',
        tags: ['Gestures', 'Layout Transitions', 'Spring Physics', 'Reduced Motion'],
        description: 'Delivering fluid 60fps interactive animations, modal transitions, and scroll reveals.'
      }
    ]
  },
  {
    id: 'tools',
    name: 'Tools, Cloud & Infrastructure',
    iconName: 'Cpu',
    description: 'Version control, cloud platforms, key-value databases, and API integrations.',
    skills: [
      {
        name: 'Git & GitHub Collaboration',
        level: 'Advanced',
        tags: ['Branching', 'Releases', 'CI/CD Actions'],
        description: 'Maintaining clean repositories, semantic versioning, and open-source packages.'
      },
      {
        name: 'Redis & Memory Stores (Upstash)',
        level: 'Advanced',
        tags: ['Key-Value', 'Session Cache', 'TTL Expiry', 'JSON Storage'],
        description: 'Implementing high-speed persistent memory caching for AI agent contexts and rate limiters.'
      },
      {
        name: 'Vercel & Cloud Run Deployment',
        level: 'Advanced',
        tags: ['Edge Network', 'Serverless Functions', 'Zero-Downtime Builds'],
        description: 'Deploying high-availability web applications with optimized build pipelines.'
      },
      {
        name: 'CurseForge Developer API',
        level: 'Expert',
        tags: ['Metadata Sync', 'Download Analytics', 'Add-on Registry'],
        description: 'Integrating live telemetry feeds and distribution statistics for Minecraft Bedrock creators.'
      }
    ]
  }
];
