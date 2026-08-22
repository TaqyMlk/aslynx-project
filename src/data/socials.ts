export interface SocialLink {
  name: string;
  url: string;
  iconName: string;
  username: string;
  description: string;
  highlight?: boolean;
}

export const SOCIALS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/muhammadtaqy4424',
    iconName: 'Github',
    username: '@muhammadtaqy4424',
    description: 'Open source repositories, Bedrock toolkits, and web prototypes.',
    highlight: true
  },
  {
    name: 'CurseForge',
    url: 'https://www.curseforge.com/members/muhammadtaqy4424/projects',
    iconName: 'Flame',
    username: 'AsLynx',
    description: '350K+ downloads across official Minecraft Bedrock add-ons.',
    highlight: true
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/aslynx',
    iconName: 'MessageSquare',
    username: 'aslynx#0001',
    description: 'Community server for add-on updates, feedback, and tech discussions.',
    highlight: true
  },
  {
    name: 'Email',
    url: 'mailto:admin@aslynx.store',
    iconName: 'Mail',
    username: 'admin@aslynx.store',
    description: 'Direct inquiries, collaboration, and professional opportunities.',
    highlight: true
  }
];
