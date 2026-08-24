import Link from 'next/link';
import { Box, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-[#020617]">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Box className="w-8 h-8 text-zinc-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-white tracking-tighter">
            404
          </h1>
          <h2 className="text-lg font-semibold text-zinc-300">
            Page not found
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            The page you are looking for does not exist or has been moved. Let&apos;s get you back on track.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}