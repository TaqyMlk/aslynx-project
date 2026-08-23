'use client';

import React from 'react';

export default function BackgroundGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute top-[-5%] left-[20%] w-[500px] h-[400px] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[15%] w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] rounded-full" />
    </div>
  );
}