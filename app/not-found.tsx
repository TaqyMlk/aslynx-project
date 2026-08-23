import Link from 'next/link';
import { Box, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#090a0f]">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center space-y-6 max-w-md">
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}