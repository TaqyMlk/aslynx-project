import { Project } from '@/src/types';

export const PROJECTS: Project[] = [
  {
    slug: 'lynx-quality-tools',
    name: 'Lynx Quality Tools',
    category: 'minecraft',
    tagline: 'Comprehensive utility suite empowering players with advanced quality-of-life tools in Bedrock Edition.',
    description: {
      id: 'Add-on Minecraft Bedrock yang menghadirkan perkakas utilitas canggih, optimasi QoL (Quality of Life), dan sistem inventaris cerdas untuk pengalaman bermain yang jauh lebih mulus.',
      en: 'A Minecraft Bedrock add-on featuring advanced utility tools, QoL optimizations, and intelligent inventory mechanics for a streamlined gameplay experience.'
    },
    features: [
      'Modular utility tools with custom durabilities and enchants',
      'Intelligent block detection & vein clearing algorithms',
      'Zero-lag Bedrock Script API runtime integration',
      'Configurable server & multiplayer support'
    ],
    version: 'v2.4.1',
    curseForgeId: 894120,
    curseForgeSlug: 'lynx-quality-tools',
    downloads: 148500,
    platform: ['Minecraft Bedrock', 'Windows 10/11', 'Android', 'iOS', 'Dedicated Server'],
    technologies: ['Minecraft Bedrock Script API', 'JavaScript', 'JSON Schemas', 'Molang'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/lynx-quality-tools',
    github: 'https://github.com/muhammadtaqy4424/lynx-quality-tools',
    featured: true,
    status: 'active',
    compatibility: {
      bedrockVersion: '1.20.0+',
      scriptApiVersion: '@minecraft/server 1.13.0'
    },
    changelog: [
      {
        version: 'v2.4.1',
        date: '2026-06-15',
        changes: ['Optimized script execution performance by 40%', 'Added support for Minecraft 1.21 Tricky Trials items', 'Fixed rare block breaking glitch on realm servers']
      }
    ]
  },
  {
    slug: 'lynx-simple-treecapitator',
    name: 'Lynx Simple Treecapitator',
    category: 'minecraft',
    tagline: 'Lightweight, ultra-fast tree chopper add-on with automatic replanting and leaf decay.',
    description: {
      id: 'Add-on pemotong pohon instan paling ringan dan responsif untuk Minecraft Bedrock dengan sistem auto-replant dan degradasi daun cepat tanpa lag.',
      en: 'The most lightweight and responsive instant tree harvesting add-on for Minecraft Bedrock featuring auto-replanting and rapid leaf decay with zero lag.'
    },
    features: [
      'Instant trunk felling with realistic leaf decay physics',
      'Automatic sapling replanting on the exact dirt block',
      'Sneak-to-disable toggle for precision builds',
      'Native support for custom modded trees and Nether fungi'
    ],
    version: 'v3.1.0',
    curseForgeId: 875210,
    curseForgeSlug: 'lynx-simple-treecapitator',
    downloads: 112000,
    platform: ['Minecraft Bedrock', 'Mobile', 'PC', 'Consoles'],
    technologies: ['Bedrock Script API', 'Behavior Pack', 'Custom Molang'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/lynx-simple-treecapitator',
    github: 'https://github.com/muhammadtaqy4424/lynx-simple-treecapitator',
    featured: true,
    status: 'active',
    compatibility: {
      bedrockVersion: '1.19.80+',
      scriptApiVersion: '@minecraft/server 1.10.0'
    }
  },
  {
    slug: 'lynx-simple-vein-miner',
    name: 'Lynx Simple Vein Miner',
    category: 'minecraft',
    tagline: 'Seamless ore vein mining system designed for multiplayer and survival efficiency.',
    description: {
      id: 'Sistem penambangan urat bijih otomatis untuk Minecraft Bedrock. Menghancurkan seluruh rantai ore dalam satu ayunan beliung dengan perhitungan durabilitas yang akurat.',
      en: 'Automated ore vein mining system for Minecraft Bedrock. Harvests interconnected ore veins in a single swing with precise pickaxe durability computation.'
    },
    features: [
      'Chain mining for Coal, Iron, Gold, Diamond, Netherite, Redstone, Lapis, Quartz',
      'Configurable maximum vein cluster limit to prevent frame drops',
      'Correct tool durability and enchantment application (Fortune & Silk Touch)',
      'Compatible with custom ore registry'
    ],
    version: 'v2.2.0',
    curseForgeId: 882341,
    curseForgeSlug: 'lynx-simple-vein-miner',
    downloads: 74200,
    platform: ['Minecraft Bedrock', 'Realms', 'BDS Servers'],
    technologies: ['Bedrock Script API v1.12', 'Behavior Pack Architecture'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/lynx-simple-vein-miner',
    featured: true,
    status: 'active',
    compatibility: {
      bedrockVersion: '1.20.0+',
      scriptApiVersion: '@minecraft/server 1.12.0'
    }
  },
  {
    slug: 'lynx-ultimate-essential-plus',
    name: 'Lynx Ultimate Essential+',
    category: 'minecraft',
    tagline: 'All-in-one survival RPG enhancement system with homes, spawns, RTP, and player statistics.',
    description: {
      id: 'Paket utilitas survival lengkap untuk Realm & Server Bedrock: manajemen homes, teleports, random teleport, statistik pemain, dan dashboard UI interaktif.',
      en: 'Complete survival enhancement suite for Bedrock Realms & Servers: home waypoints, warp spawns, RTP, player leaderboards, and interactive UI forms.'
    },
    features: [
      'Interactive modal UI forms built with @minecraft/server-ui',
      'Custom player homes and death checkpoint recovery',
      'Safe random wilderness teleportation algorithm',
      'Comprehensive permission system for server admins'
    ],
    version: 'v1.8.5',
    curseForgeId: 901552,
    curseForgeSlug: 'lynx-ultimate-essential-plus',
    downloads: 41800,
    platform: ['Minecraft Bedrock', 'Dedicated Servers', 'Realms'],
    technologies: ['@minecraft/server', '@minecraft/server-ui', 'Dynamic Property Database'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/lynx-ultimate-essential-plus',
    featured: false,
    status: 'active',
    compatibility: {
      bedrockVersion: '1.20.50+'
    }
  },
  {
    slug: 'lynx-auto-oresmelter-veinminer',
    name: 'Lynx Auto OreSmelter & VeinMiner',
    category: 'minecraft',
    tagline: 'Dual-action mining utility that mines veins and automatically smelts ores into ingots.',
    description: {
      id: 'Kombinasi vein miner dan auto smelter yang langsung melebur bijih menjadi ingot atau material matang saat ditambang dengan efek suara dan partikel khusus.',
      en: 'Combined vein miner and auto smelter that directly converts mined raw ores into refined ingots or drops with custom sound cues and particle VFX.'
    },
    features: [
      'Instant ore smelting into ingots and refined drops',
      'Integrated vein mining chain calculation',
      'Balanced XP drop calculation matching vanilla blast furnaces',
      'Sneak toggle to preserve raw blocks for building'
    ],
    version: 'v1.5.0',
    curseForgeId: 914022,
    curseForgeSlug: 'lynx-auto-oresmelter-veinminer',
    downloads: 29400,
    platform: ['Minecraft Bedrock'],
    technologies: ['Minecraft Scripting', 'Particle Systems', 'JSON Molang'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/lynx-auto-oresmelter-veinminer',
    status: 'active'
  },
  {
    slug: 'lynx-simple-autoreplant',
    name: 'Lynx Simple AutoReplant',
    category: 'minecraft',
    tagline: 'Smart farming companion that auto-replants fully grown crops upon harvest.',
    description: {
      id: 'Otomatisasi panen pertanian yang langsung menanam kembali bibit gandum, wortel, kentang, dan bit ketika dipanen tanpa merusak tanah gembur.',
      en: 'Smart agricultural automation that automatically replants wheat, carrots, potatoes, and beetroot upon harvest without disturbing fertile farmland.'
    },
    features: [
      'Right-click or break-to-replant for mature crops',
      'Preserves seeds and dispenses bonus yield to player inventory',
      'Nether wart and cocoa beans compatibility',
      'Prevents accidental trampling of farmland'
    ],
    version: 'v1.4.2',
    curseForgeId: 890112,
    curseForgeSlug: 'lynx-simple-autoreplant',
    downloads: 21500,
    platform: ['Minecraft Bedrock'],
    technologies: ['Bedrock Script API', 'Behavior Pack'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/lynx-simple-autoreplant',
    status: 'active'
  },
  {
    slug: 'chunky-pregenerator',
    name: 'Chunky World Pregenerator Bedrock',
    category: 'tools',
    tagline: 'World pre-generation script for Minecraft Bedrock servers to eliminate exploration lag.',
    description: {
      id: 'Utilitas pre-generasi chunk dunia untuk server dan realm Bedrock. Menghasilkan chunk peta sebelum pemain menjelajah untuk menghilangkan stutter dan lag.',
      en: 'World pregeneration utility for Minecraft Bedrock servers and realms. Generates terrain chunks ahead of time to eliminate exploration lag spikes.'
    },
    features: [
      'Radius-based and square chunk pre-generation loops',
      'Automatic memory throttler to prevent server crashes',
      'Real-time progress telemetry and chunk coordinate visualizer',
      'Background async tick scheduler'
    ],
    version: 'v1.1.0',
    curseForgeId: 923101,
    curseForgeSlug: 'chunky-pregenerator',
    downloads: 18900,
    platform: ['Minecraft Bedrock Server', 'Node.js Tooling'],
    technologies: ['Bedrock Script API', 'Async Generation Loops'],
    curseForgeUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/chunky-pregenerator',
    status: 'active'
  },
  {
    slug: 'aslynx-unified-web',
    name: 'AsLynx Unified Web Platform',
    category: 'web',
    tagline: 'Next.js & Tailwind CSS high-performance personal technology platform and experimental workspace.',
    description: {
      id: 'Platform web terpadu AsLynx yang menggabungkan portofolio profesional, katalog add-on dengan sinkronisasi CurseForge live, 12+ alat kerja laboratorium publik, dan arsitektur AI privat.',
      en: 'The AsLynx unified web platform consolidating professional portfolio, live CurseForge add-on catalog, 12+ public lab utilities, and private AI infrastructure.'
    },
    features: [
      'Modern Next.js App Router & TypeScript architecture',
      'Dark Matte Glossy Glass iOS-inspired visual design system',
      'CurseForge live server-side statistics integration with memory cache',
      '12+ interactive browser development & Minecraft tools',
      'Private AI Agent with long-term memory & multi-provider routing'
    ],
    version: 'v3.0.0',
    downloads: 5000,
    platform: ['Web', 'PWA', 'Desktop', 'Mobile'],
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Gemini API'],
    github: 'https://github.com/muhammadtaqy4424/aslynx-unified-web',
    featured: true,
    status: 'active'
  },
  {
    slug: 'prompt-matrix-engine',
    name: 'PromptMatrix AI Engine',
    category: 'ai',
    tagline: 'Multi-layer prompt engineering and LLM orchestration framework for automated coding and agent workflows.',
    description: {
      id: 'Framework rekayasa prompt tingkat lanjut untuk orkestrasi LLM multi-step, evaluasi konteks, penyusunan few-shot dynamic, dan eksekusi tugas kode otomatis.',
      en: 'Advanced prompt engineering framework for multi-step LLM orchestration, dynamic few-shot assembly, context evaluation, and automated coding workflows.'
    },
    features: [
      'Dynamic persona injection and system constraint compiler',
      'Token-efficient schema compression algorithms',
      'Multi-provider router (Gemini, OpenRouter, Groq)',
      'Deterministic function calling validation pipeline'
    ],
    version: 'v2.0.0',
    downloads: 3200,
    platform: ['Node.js', 'Web API', 'Cloud Functions'],
    technologies: ['TypeScript', 'Gemini API', 'LLM Prompt Engineering', 'OpenAI SDK'],
    github: 'https://github.com/muhammadtaqy4424/prompt-matrix-engine',
    featured: true,
    status: 'active'
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'all') return PROJECTS;
  return PROJECTS.filter((p) => p.category === category);
}

export function getTotalCurseForgeDownloads(): number {
  return PROJECTS.reduce((acc, p) => acc + (p.downloads || 0), 0);
}
