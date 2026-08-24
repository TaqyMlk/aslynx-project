'use client';

import React, { useState } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Workflow, Plus, Trash2, ArrowDown, Copy, Check } from 'lucide-react';

interface EventNode {
  id: string;
  eventName: string;
  trigger: string;
  addComponentGroups: string[];
  removeComponentGroups: string[];
}

export default function EntityFlowchartPage() {
  const [nodes, setNodes] = useState<EventNode[]>([
    { id: 'node-1', eventName: 'minecraft:entity_spawned', trigger: 'On Spawn / Initial Load', addComponentGroups: ['lynx:default_state', 'lynx:navigation'], removeComponentGroups: [] },
    { id: 'node-2', eventName: 'lynx:on_interact', trigger: 'Player Right-Click with Custom Item', addComponentGroups: ['lynx:activated_mode', 'lynx:particle_fx'], removeComponentGroups: ['lynx:default_state'] },
    { id: 'node-3', eventName: 'lynx:on_timer_end', trigger: 'minecraft:timer expires (200 ticks)', addComponentGroups: ['lynx:default_state'], removeComponentGroups: ['lynx:activated_mode', 'lynx:particle_fx'] }
  ]);

  const [copied, setCopied] = useState(false);

  const addNode = () => {
    const newNode: EventNode = {
      id: `node-${Date.now()}`, eventName: `lynx:custom_event_${nodes.length + 1}`, trigger: 'Custom Condition / Molang',
      addComponentGroups: ['lynx:new_state'], removeComponentGroups: []
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  const generatedEventsJSON = JSON.stringify(
    { 'minecraft:entity': { events: nodes.reduce((acc, curr) => { acc[curr.eventName] = { ...(curr.addComponentGroups.length > 0 ? { add: { component_groups: curr.addComponentGroups } } : {}), ...(curr.removeComponentGroups.length > 0 ? { remove: { component_groups: curr.removeComponentGroups } } : {}) }; return acc; }, {} as Record<string, unknown>) } },
    null, 2
  );

  const handleCopy = () => { navigator.clipboard.writeText(generatedEventsJSON); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Entity Event Flowchart Builder"
        category="Minecraft Tools"
        description="Visually map Minecraft Bedrock entity events, transitions, component group mutations, and export valid behavior JSON schemas."
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Event Sequence Nodes</span>
            <button onClick={addNode} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 transition-all active:scale-95">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event Node</span>
            </button>
          </div>

          <div className="space-y-4">
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div className="bg-[#0f1219] p-5 rounded-2xl border border-white/8 space-y-3 relative group">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center font-mono shrink-0">{index + 1}</span>

                    <input type="text" value={node.eventName} onChange={(e) => {
                      const updated = [...nodes]; updated[index].eventName = e.target.value; setNodes(updated);
                    }} className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/8 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-colors" />

                    {nodes.length > 1 && (
                      <button onClick={() => removeNode(node.id)} className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete node"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Trigger Condition</label>
                    <input type="text" value={node.trigger} onChange={(e) => {
                      const updated = [...nodes]; updated[index].trigger = e.target.value; setNodes(updated);
                    }} className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/8 text-neutral-300 text-xs focus:outline-none focus:border-cyan-400 transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[11px] text-cyan-400 font-medium block mb-1">+ Add Component Groups</span>
                      <input type="text" value={node.addComponentGroups.join(', ')} onChange={(e) => {
                        const updated = [...nodes]; updated[index].addComponentGroups = e.target.value.split(',').map((s) => s.trim()).filter(Boolean); setNodes(updated);
                      }} placeholder="e.g. lynx:active" className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-cyan-500/15 text-neutral-200 font-mono text-[11px] focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <span className="text-[11px] text-rose-400 font-medium block mb-1">- Remove Component Groups</span>
                      <input type="text" value={node.removeComponentGroups.join(', ')} onChange={(e) => {
                        const updated = [...nodes]; updated[index].removeComponentGroups = e.target.value.split(',').map((s) => s.trim()).filter(Boolean); setNodes(updated);
                      }} placeholder="e.g. lynx:idle" className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-rose-500/15 text-neutral-200 font-mono text-[11px] focus:outline-none focus:border-rose-400/50 transition-colors" />
                    </div>
                  </div>
                </div>

                {index < nodes.length - 1 && <div className="flex justify-center text-neutral-600"><ArrowDown className="w-5 h-5" /></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0f1219] p-6 rounded-2xl border border-white/8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5"><Workflow className="w-4 h-4 text-cyan-400" />Behavior JSON Events</span>

            <button onClick={handleCopy} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">{generatedEventsJSON}</pre>
        </div>
      </div>
    </div>
  );
}