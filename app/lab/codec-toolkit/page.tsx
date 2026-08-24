'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { KeyRound, Copy, Check, ArrowRightLeft } from 'lucide-react';

export default function CodecToolkitPage() {
  const [input, setInput] = useState('AsLynx Unified Platform v3.0');
  const [activeCodec, setActiveCodec] = useState<'base64' | 'url' | 'hex' | 'binary' | 'jwt'>('base64');
  const [copied, setCopied] = useState(false);

  let output = '';
  let error = '';

  try {
    if (activeCodec === 'base64') {
      output = btoa(unescape(encodeURIComponent(input)));
    } else if (activeCodec === 'url') {
      output = encodeURIComponent(input);
    } else if (activeCodec === 'hex') {
      output = Array.from(new TextEncoder().encode(input)).map((b) => b.toString(16).padStart(2, '0')).join(' ');
    } else if (activeCodec === 'binary') {
      output = Array.from(new TextEncoder().encode(input)).map((b) => b.toString(2).padStart(8, '0')).join(' ');
    } else if (activeCodec === 'jwt') {
      const parts = input.split('.');
      if (parts.length >= 2) {
        const header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
        const payload = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
        output = `// Header:\n${header}\n\n// Payload:\n${payload}`;
      } else {
        output = 'Invalid JWT format (requires at least 2 dot-separated base64 parts).';
      }
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : String(err);
  }

  const handleDecode = () => {
    try {
      if (activeCodec === 'base64') {
        setInput(decodeURIComponent(escape(atob(input))));
      } else if (activeCodec === 'url') {
        setInput(decodeURIComponent(input));
      } else if (activeCodec === 'hex') {
        const cleanHex = input.replace(/\s+/g, '');
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
        setInput(new TextDecoder().decode(bytes));
      }
    } catch { /* ignore */ }
  };

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Universal Codec Toolkit"
        category="Utilities"
        description="Encode and decode text into Base64, URL-escaped strings, Hexadecimal, Binary bytes, and inspect JWT token payloads."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {(['base64', 'url', 'hex', 'binary', 'jwt'] as const).map((codec) => (
          <button key={codec} onClick={() => setActiveCodec(codec)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCodec === codec ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#0f1219] text-neutral-400 hover:text-white border border-white/8'}`}>{codec}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">Input Data</label>
            <button onClick={handleDecode} className="text-xs text-cyan-400 hover:underline flex items-center gap-1 transition-colors"><ArrowRightLeft className="w-3 h-3" /><span>Decode to Input</span></button>
          </div>

          <textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 transition-colors" />
        </div>

        <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">Encoded Result ({activeCodec.toUpperCase()})</label>
            <button onClick={handleCopy} className="text-xs text-cyan-400 hover:underline flex items-center gap-1 transition-colors">
              {copied ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
            </button>
          </div>

          <textarea rows={8} readOnly value={error ? `Error: ${error}` : output} className={`w-full p-4 font-mono text-xs rounded-2xl resize-none focus:outline-none border transition-colors ${error ? 'border-rose-500/15 text-rose-400 bg-rose-500/5' : 'border-white/8 text-cyan-400 bg-black/60'}`} />
        </div>
      </div>
    </div>
  );
}