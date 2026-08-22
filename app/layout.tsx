import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/src/components/layout/Navbar';
import Dock from '@/src/components/layout/Dock';
import Footer from '@/src/components/layout/Footer';
import BackgroundGradient from '@/src/components/layout/BackgroundGradient';

export const metadata: Metadata = {
  title: 'AsLynx — AI Prompt Engineer, Web Developer & Minecraft Bedrock Modder',
  description: 'Official unified platform of Muhammad Abdulhadi Taqy (AsLynx): add-ons with 350K+ CurseForge downloads, AI workflows, and public developer tools.',
  keywords: ['AsLynx', 'Muhammad Abdulhadi Taqy', 'Minecraft Bedrock Addon', 'Prompt Engineer', 'Bedrock Script API', 'Lynx Quality Tools', 'Next.js Developer'],
  authors: [{ name: 'Muhammad Abdulhadi Taqy (AsLynx)' }],
  creator: 'AsLynx',
  openGraph: {
    title: 'AsLynx — AI Prompt Engineer & Minecraft Bedrock Modder',
    description: 'Explore high-performance Minecraft Bedrock add-ons, AI prompt engineering frameworks, and 12+ public developer utilities.',
    type: 'website',
    url: 'https://aslynx.dev'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AsLynx — AI Prompt Engineer & Minecraft Bedrock Modder',
    description: '350K+ CurseForge downloads across official Bedrock add-ons and public developer tools.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <BackgroundGradient />
        <Navbar />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <Dock />
        <Footer />
      </body>
    </html>
  );
}
