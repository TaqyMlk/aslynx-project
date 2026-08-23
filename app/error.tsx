'use client';

import { useEffect } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#090a0f]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-rose-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            An unexpected error occurred while loading this page. This could be a temporary issue — please try again.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}