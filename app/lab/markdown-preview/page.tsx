'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { FileText, Copy, Check, Download } from 'lucide-react';

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
        {/* Markdown Source Pane */}
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

        {/* Live Formatted Preview Pane */}
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

          <div className="flex-1 w-full bg-black/40 p-5 rounded-2xl border border-white/5 overflow-y-auto text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-3 prose prose-invert max-w-none">
            {/* Simple Markdown HTML parser */}
            <div
              dangerouslySetInnerHTML={{
                __html: markdown
                  .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mb-2 pb-1 border-b border-white/10">$1</h1>')
                  .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-cyan-300 mt-4 mb-2">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>')
                  .replace(/\*(.*?)\*/gim, '<em class="text-zinc-300">$1</em>')
                  .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-cyan-400 pl-3 py-1 text-zinc-400 italic my-2 bg-white/5 rounded-r-lg">$1</blockquote>')
                  .replace(/```([\s\S]*?)```/gim, '<pre class="bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-xs text-cyan-300 my-2 overflow-x-auto"><code>$1</code></pre>')
                  .replace(/`([^`]+)`/gim, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[11px]">$1</code>')
                  .replace(/\n/gim, '<br/>')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
