import { LabTool } from '@/src/types';

export const LAB_TOOLS: LabTool[] = [
  {
    id: 'ai-lite',
    slug: 'ai-lite',
    name: 'AI Lite',
    category: 'ai',
    icon: 'Bot',
    badge: 'Stateless AI',
    shortDesc: 'Fresh, zero-retention stateless AI chat with multi-provider routing (Gemini, OpenRouter, Groq).',
    description: {
      id: 'Asisten AI publik yang cepat dan bebas retensi memori (stateless). Mendukung pemilihan model coding vs general dan fallback multi-provider otomatis.',
      en: 'Fast, zero-retention stateless public AI assistant. Supports coding vs general model selection with automatic multi-provider fallback routing.'
    },
    tags: ['Stateless', 'Multi-Provider', 'Coding Mode', 'Telemetry'],
    featured: true
  },
  {
    id: 'code-studio',
    slug: 'code-studio',
    name: 'Code Studio',
    category: 'dev',
    icon: 'Code2',
    badge: 'Live Sandbox',
    shortDesc: 'Interactive HTML, CSS, and JavaScript real-time editor with instant browser preview and presets.',
    description: {
      id: 'Editor kode interaktif langsung di browser untuk menguji HTML, CSS, dan JavaScript dengan live preview instan, console log terintegrasi, dan preset template.',
      en: 'Interactive in-browser code editor for rapid prototyping of HTML, CSS, and JavaScript with instant live preview, integrated console, and starter presets.'
    },
    tags: ['HTML/CSS/JS', 'Live Preview', 'Templates', 'Export'],
    featured: true
  },
  {
    id: 'manifest-generator',
    slug: 'manifest-generator',
    name: 'Manifest Generator',
    category: 'minecraft',
    icon: 'FileJson',
    badge: 'Bedrock Tool',
    shortDesc: 'Generate valid Minecraft Bedrock manifest.json files with auto-generated UUIDs v4 and Script API modules.',
    description: {
      id: 'Pembuat file manifest.json standar untuk Behavior Pack dan Resource Pack Minecraft Bedrock lengkap dengan generator UUID v4 otomatis dan modul Script API.',
      en: 'Standard manifest.json generator for Minecraft Bedrock Behavior and Resource Packs complete with automatic UUID v4 generation and Script API module setup.'
    },
    tags: ['Minecraft Bedrock', 'UUID v4', 'Behavior Pack', 'Resource Pack', 'Script API'],
    featured: true
  },
  {
    id: 'json-validator',
    slug: 'json-validator',
    name: 'JSON Schema Validator',
    category: 'dev',
    icon: 'CheckSquare',
    badge: 'Formatting & Lint',
    shortDesc: 'Format, validate, minify, and inspect JSON structures with instant syntax error highlighting.',
    description: {
      id: 'Validasi dan format JSON secara instan dengan pendeteksi error sintaksis presisi, opsi minify/beautify, dan inspeksi tipe data.',
      en: 'Instantly validate and format JSON with precise syntax error detection, minify/beautify formatting, and structure type inspection.'
    },
    tags: ['JSON', 'Validator', 'Formatter', 'Minifier', 'Linter'],
    featured: false
  },
  {
    id: 'asset-optimizer',
    slug: 'asset-optimizer',
    name: 'Pack Asset Optimizer',
    category: 'minecraft',
    icon: 'Layers',
    badge: 'Performance',
    shortDesc: 'Analyze Minecraft texture sizes, audio weights, and calculate pack memory footprint budgets.',
    description: {
      id: 'Analisis ukuran tekstur Minecraft, rasio kompresi gambar, dan estimasi beban memori paket add-on sebelum dipublikasikan ke pemain.',
      en: 'Analyze Minecraft texture dimensions, asset compression ratios, and estimate memory footprint budgets before deploying add-on packs.'
    },
    tags: ['Minecraft', 'Texture Budget', 'Optimization', 'Asset Calculator'],
    featured: false
  },
  {
    id: 'entity-flowchart',
    slug: 'entity-flowchart',
    name: 'Entity Event Flowchart',
    category: 'minecraft',
    icon: 'Workflow',
    badge: 'Visual Builder',
    shortDesc: 'Visual event flow and component group trigger mapper for Bedrock entity behavior schemas.',
    description: {
      id: 'Pembuat diagram alur interaktif untuk memetakan event entitas Minecraft Bedrock, grup komponen (component_groups), dan trigger kondisi.',
      en: 'Interactive flowchart builder to visually map Minecraft Bedrock entity events, component groups, and conditional triggers.'
    },
    tags: ['Entity Events', 'Flowchart', 'Component Groups', 'Molang Triggers'],
    featured: false
  },
  {
    id: 'prompt-optimizer',
    slug: 'prompt-optimizer',
    name: 'Prompt Optimizer',
    category: 'ai',
    icon: 'Wand2',
    badge: 'Prompt Engineering',
    shortDesc: 'Refine system prompts, eliminate token bloat, inject strict constraints, and score clarity.',
    description: {
      id: 'Optimalkan prompt sistem untuk LLM: hilangkan ambiguitas, kompresi token yang mubazir, tambahkan aturan pembatas ketat, dan hitung skor kejelasan.',
      en: 'Optimize system prompts for LLMs: eliminate ambiguities, compress redundant tokens, inject rigid constraint boundaries, and calculate clarity scores.'
    },
    tags: ['System Prompt', 'Token Saver', 'Clarity Score', 'LLM Tuning'],
    featured: true
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester & Inspector',
    category: 'utility',
    icon: 'Binary',
    badge: 'Utility',
    shortDesc: 'Test regular expressions in real time with group capture breakdown and cheat sheet.',
    description: {
      id: 'Uji pola Regular Expression secara real-time dengan highlight kecocokan instan, inspeksi capture groups, dan panduan sintaks praktis.',
      en: 'Test Regular Expression patterns in real time with instant match highlights, capture group breakdown, and quick syntax cheat sheets.'
    },
    tags: ['Regex', 'Pattern Matching', 'Capture Groups', 'Testing'],
    featured: false
  },
  {
    id: 'codec-toolkit',
    slug: 'codec-toolkit',
    name: 'Codec Toolkit',
    category: 'utility',
    icon: 'KeyRound',
    badge: 'Multi-Encoder',
    shortDesc: 'Base64, URL encoding, Hex, Binary, UUID generator, and JWT header/payload inspector.',
    description: {
      id: 'Perkakas konversi kode serbaguna: Base64, URL encode/decode, Hex, Binary, UUID generator, dan decoder payload token JWT.',
      en: 'Universal encoding toolkit: Base64, URL encode/decode, Hex, Binary, UUID generator, and JWT token payload inspector.'
    },
    tags: ['Base64', 'Hex', 'Binary', 'JWT Decoder', 'UUID'],
    featured: false
  },
  {
    id: 'markdown-preview',
    slug: 'markdown-preview',
    name: 'Markdown Previewer',
    category: 'utility',
    icon: 'FileText',
    badge: 'Documentation',
    shortDesc: 'Split-pane Markdown editor with GitHub-flavored rendering, table formatters, and HTML export.',
    description: {
      id: 'Editor Markdown dua panel dengan render GitHub-flavored instan, formatting tabel otomatis, dan ekspor ke file Markdown atau HTML.',
      en: 'Dual-pane Markdown editor with instant GitHub-flavored rendering, automatic table formatting, and export to Markdown or HTML.'
    },
    tags: ['Markdown', 'GFM', 'Live Preview', 'Export'],
    featured: false
  },
  {
    id: 'color-palette',
    slug: 'color-palette',
    name: 'Color Harmony & Contrast',
    category: 'utility',
    icon: 'Palette',
    badge: 'Design',
    shortDesc: 'Harmonious color palette generator, HEX/RGB/HSL converter, and WCAG AA/AAA contrast checker.',
    description: {
      id: 'Generator palet warna harmonis (Complementary, Analogous, Triadic), konversi HEX/RGB/HSL, dan kalkulator kontras aksesibilitas WCAG AA/AAA.',
      en: 'Harmonious color palette generator (Complementary, Analogous, Triadic), HEX/RGB/HSL converter, and WCAG AA/AAA contrast accessibility checker.'
    },
    tags: ['Color Palette', 'WCAG Contrast', 'HEX / RGB', 'CSS Variables'],
    featured: false
  },
  {
    id: 'animation-preview',
    slug: 'animation-preview',
    name: 'Animation & Cubic-Bezier',
    category: 'utility',
    icon: 'Sparkle',
    badge: 'CSS & Motion',
    shortDesc: 'Visual CSS keyframe and cubic-bezier curve tuner with copyable Tailwind & CSS snippets.',
    description: {
      id: 'Uji coba animasi visual CSS dan kurva kecepatan cubic-bezier dengan visualisasi interaktif dan kode Tailwind siap pakai.',
      en: 'Visual CSS keyframe and cubic-bezier curve tester with interactive preview and ready-to-copy Tailwind/CSS code snippets.'
    },
    tags: ['CSS Animation', 'Cubic-Bezier', 'Tailwind Keyframes', 'Easing'],
    featured: false
  },
  {
    id: 'playground',
    slug: 'playground',
    name: 'Quantum Starlight Playground',
    category: 'experiment',
    icon: 'Orbit',
    badge: '3D Canvas',
    shortDesc: 'Interactive particle nexus simulation with interactive physical forcefields and camera orbit controls.',
    description: {
      id: 'Simulasi kanvas interaktif Quantum Starlight Nexus dengan dinamika partikel 3D, medan gaya responsif pointer, dan kontrol orbit kamera.',
      en: 'Interactive Quantum Starlight Nexus canvas simulation featuring 3D particle dynamics, pointer-reactive forcefields, and camera orbit controls.'
    },
    tags: ['3D Canvas', 'Particle Physics', 'WebGL', 'Interactive'],
    featured: true
  }
];

export function getLabToolBySlug(slug: string): LabTool | undefined {
  return LAB_TOOLS.find((t) => t.slug === slug);
}
