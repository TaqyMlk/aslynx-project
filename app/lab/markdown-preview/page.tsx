'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { FileText, Copy, Check, Download } from 'lucide-react';
import { marked } from 'marked';

const STARTER_MD = `# Lynx Quality Tools — Documentation

**Lynx Quality Tools** is an official Minecraft Bedrock add-on engineered for zero-lag survival enhancements.

---

### 🚀 Key Capabilities
* **Vein Mining**: Mines connected ore clusters in a single stroke
* **Treecapitator**: Chops entire trees with auto-replanting
* **QoL Utility**: Inventory sorting & quick crafting

### 📦 Installation
\`\`\`bash
# Install to Minecraft Bedrock com.mojang directory
cp -r lynx_behavior_pack/ com.mojang/behavior_packs/
\`\`\`

> *Engineered by AsLynx with @minecraft/server Script API.*
`;

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(STARTER_MD);
  const [copied, setCopied] = useState(false);
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  const rawHtml = useMemo(
    () => marked.parse(markdown, { async: false, gfm: true }) as string,
    [markdown]
  );

  useEffect(() => {
    let active = true;

    // DOMPurify is browser-only. Load it after hydration so Next.js never
    // executes DOMPurify.sanitize during server-side prerendering.
    import('dompurify').then(({ default: DOMPurify }) => {
      if (active && typeof DOMPurify?.sanitize === 'function') {
        setSanitizedHtml(DOMPurify.sanitize(rawHtml));
      }
    });

    return () => {
      active = false;
    };
  }, [rawHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Markdown Split-Pane Previewer"
        category="Utilities"
        badge="GFM Markdown"
        description="Dual-pane Markdown writer with GitHub-flavored typography rendering, code block formatting, and quick export."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
        <div className="glass-panel-elevated p-5 rounded-3xl border-white/10 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Markdown Source</span>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">{markdown.length} chars</span>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-xs text-zinc-200 bg-black/50 border border-white/5 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="glass-panel-elevated p-6 rounded-3xl border-white/10 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
            <span className="font-semibold text-zinc-300">Rendered Typography</span>
            <button
              onClick={handleDownload}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>

          <div
            className="prose prose-invert flex-1 w-full bg-black/40 p-5 rounded-2xl border border-white/5 overflow-y-auto text-xs sm:text-sm text-zinc-200 max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </div>
    </div>
  );
}
