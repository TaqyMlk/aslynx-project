'use client';

import React from 'react';

export default function BackgroundGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Top subtle cyan glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-[120px] rounded-full opacity-60" />

      {/* Middle purple accent */}
      <div className="absolute top-[35%] -left-40 w-[500px] h-[500px] bg-purple-600/8 blur-[140px] rounded-full opacity-40 animate-pulse-subtle" />

      {/* Right ambient indigo accent */}
      <div className="absolute top-[60%] -right-40 w-[600px] h-[600px] bg-blue-700/8 blur-[150px] rounded-full opacity-40" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
}
