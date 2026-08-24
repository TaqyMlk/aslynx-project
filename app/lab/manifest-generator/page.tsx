'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { RefreshCw, Copy, Check, Download, FileJson } from 'lucide-react';

function generateUUID(): string {
  return crypto.randomUUID();
}

export default function ManifestGeneratorPage() {
  const [packName, setPackName] = useState('My Lynx Add-on');
  const [description, setDescription] = useState('Custom Minecraft Bedrock Add-on by AsLynx');
  const [packType, setPackType] = useState<'behavior' | 'resource'>('behavior');
  const [enableScriptAPI, setEnableScriptAPI] = useState(true);
  const [scriptEntry, setScriptEntry] = useState('scripts/main.js');
  const [minEngineVersion, setMinEngineVersion] = useState('1.21.0');
  const [headerUUID, setHeaderUUID] = useState(generateUUID());
  const [moduleUUID, setModuleUUID] = useState(generateUUID());
  const [scriptModuleUUID, setScriptModuleUUID] = useState(generateUUID());
  const [copied, setCopied] = useState(false);

  const regenerateUUIDs = () => {
    setHeaderUUID(generateUUID());
    setModuleUUID(generateUUID());
    setScriptModuleUUID(generateUUID());
  };

  const parsedVersion = minEngineVersion.split('.').map((n) => parseInt(n, 10) || 0);

  const manifestObject = {
    format_version: 2,
    header: {
      name: packName,
      description: description,
      uuid: headerUUID,
      version: [1, 0, 0],
      min_engine_version: parsedVersion.length === 3 ? parsedVersion : [1, 21, 0]
    },
    modules: [
      {
        type: packType === 'behavior' ? 'data' : 'resources',
        uuid: moduleUUID,
        version: [1, 0, 0]
      },
      ...(packType === 'behavior' && enableScriptAPI
        ? [
            {
              type: 'script',
              language: 'javascript',
              uuid: scriptModuleUUID,
              entry: scriptEntry,
              version: [1, 0, 0]
            }
          ]
        : [])
    ],
    ...(packType === 'behavior' && enableScriptAPI
      ? {
          dependencies: [
            {
              module_name: '@minecraft/server',
              version: '1.14.0'
            },
            {
              module_name: '@minecraft/server-ui',
              version: '1.4.0'
            }
          ]
        }
      : {})
  };

  const jsonString = JSON.stringify(manifestObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setPackName('My Lynx Add-on');
    setDescription('Custom Minecraft Bedrock Add-on by AsLynx');
    setPackType('behavior');
    setEnableScriptAPI(true);
    setMinEngineVersion('1.21.0');
    regenerateUUIDs();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Bedrock Manifest Generator"
        category="Minecraft Tools"
        description="Generate standards-compliant manifest.json files for Minecraft Bedrock Behavior & Resource packs with automated UUID v4 generation and Script API module bindings."
        onReset={handleReset}
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form (Left 5 cols) */}
        <div className="lg:col-span-5 bg-[#0f1219] p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Pack Configuration</h3>

          <div>
            <label htmlFor="pack-name" className="block text-xs font-medium text-neutral-300 mb-1">Pack Name</label>
            <input
              id="pack-name"
              type="text"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="pack-desc" className="block text-xs font-medium text-neutral-300 mb-1">Description</label>
            <input
              id="pack-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pack-type" className="block text-xs font-medium text-neutral-300 mb-1">Pack Type</label>
              <select
                id="pack-type"
                value={packType}
                onChange={(e) => setPackType(e.target.value as 'behavior' | 'resource')}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="behavior">Behavior Pack (BP)</option>
                <option value="resource">Resource Pack (RP)</option>
              </select>
            </div>

            <div>
              <label htmlFor="min-engine" className="block text-xs font-medium text-neutral-300 mb-1">Min Engine</label>
              <input
                id="min-engine"
                type="text"
                value={minEngineVersion}
                onChange={(e) => setMinEngineVersion(e.target.value)}
                placeholder="1.21.0"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {packType === 'behavior' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-neutral-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableScriptAPI}
                  onChange={(e) => setEnableScriptAPI(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                />
                <span>Include Bedrock Script API Module</span>
              </label>

              {enableScriptAPI && (
                <div>
                  <label htmlFor="script-entry" className="block text-[11px] text-neutral-400 mb-1">Script Entry Point</label>
                  <input
                    id="script-entry"
                    type="text"
                    value={scriptEntry}
                    onChange={(e) => setScriptEntry(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={regenerateUUIDs}
              className="w-full py-2.5 rounded-xl bg-[#0f1219] hover:bg-white/[0.03] border border-white/10 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate UUIDs (v4)</span>
            </button>
          </div>
        </div>

        {/* JSON Preview Panel (Right 7 cols) */}
        <div className="lg:col-span-7 bg-[#0f1219] p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-cyan-400" />
              <span>manifest.json Output</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-200 overflow-x-auto max-h-[460px] overflow-y-auto leading-relaxed">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}
