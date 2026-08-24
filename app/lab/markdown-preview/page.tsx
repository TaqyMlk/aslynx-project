'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { FileText, Copy, Check, Download } from 'lucide-react';
import { marked } from 'marked';

const STARTER_MD = `# Lynx Quality Tools — Documentation

**Lynx Quality Tools** is an official Minecraft Bedrock add-on engineered for zero-lag survival enhancements.

---

### Key Capabilities
* **Vein Mining**: Mines connected ore clusters in a single stroke
* **Treecapitator**: Chops entire trees with auto-replanting
* **QoL Utility**: Inventory sorting & quick crafting

### Installation
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

  const rawHtml = useMemo(() => marked.parse(markdown, { async: false, gfm: true }) as string, [markdown]);

  useEffect(() => {
    let active = true;
    import('dompurify').then(({ default: DOMPurify }) => {
      if (active && typeof DOMPurify?.sanitize === 'function') {
        setSanitizedHtml(DOMPurify.sanitize(rawHtml));
      }
    });
    return () => { active = false; };
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
        description="Dual-pane Markdown writer with GitHub-flavored typography rendering, code block formatting, and quick export."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-[#0f1219] p-5 rounded-2xl border border-white/8 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3 text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5"><FileText className="w-4 h-4 text-cyan-400" />Markdown Source</span>
            <span className="text-[11px] text-neutral-500 font-mono">{markdown.length} chars</span>
          </div>

          <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="flex-1 w-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-xl resize-none focus:outline-none focus:border-cyan-400 transition-colors" spellCheck={false} />
        </div>

        <div className="bg-[#0f1219] p-6 rounded-2xl border border-white/8 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3 text-xs">
            <span className="font-semibold text-neutral-300">Rendered Typography</span>
            <button onClick={handleDownload} className="text-xs text-cyan-400 hover:underline flex items-center gap-1 transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>

          <div className="prose prose-invert flex-1 w-full bg-black/40 p-5 rounded-xl border border-white/8 overflow-y-auto text-xs sm:text-sm text-neutral-200 max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </div>
      </div>
    </div>
  );
}