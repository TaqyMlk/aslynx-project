'use client';

import React, { useState, useEffect, useRef } from 'react';
import ToolHeader from '@/src/components/lab/ToolHeader';
import { Play, Terminal, Eye } from 'lucide-react';

const STARTER_TEMPLATES: Record<string, { html: string; css: string; js: string }> = {
  vanilla: {
    html: `<div class="card">\n  <h2>Quantum Nexus</h2>\n  <p>Live sandbox execution with high-speed reactive compilation.</p>\n  <button id="counterBtn">Clicks: 0</button>\n</div>`,
    css: `body {\n  margin: 0;\n  padding: 24px;\n  background: #090a0f;\n  color: #f8fafc;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 80vh;\n}\n\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  padding: 28px;\n  border-radius: 20px;\n  backdrop-filter: blur(16px);\n  box-shadow: 0 20px 40px rgba(0,0,0,0.5);\n  max-width: 360px;\n  text-align: center;\n}\n\nh2 {\n  margin-top: 0;\n  color: #22d3ee;\n}\n\nbutton {\n  background: #22d3ee;\n  border: none;\n  color: #0a0a0a;\n  font-weight: bold;\n  padding: 10px 20px;\n  border-radius: 12px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background: #67e8f9;\n}`,
    js: `let count = 0;\nconst btn = document.getElementById('counterBtn');\nbtn.addEventListener('click', () => {\n  count++;\n  btn.textContent = 'Clicks: ' + count;\n  console.log('Button clicked! New count:', count);\n});\nconsole.log('Sandbox initialized successfully.');`
  },
  particles: {
    html: `<canvas id="canvas"></canvas>`,
    css: `body {\n  margin: 0;\n  background: #050608;\n  overflow: hidden;\n}\ncanvas {\n  display: block;\n  width: 100vw;\n  height: 100vh;\n}`,
    js: `const canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\ncanvas.width = window.innerWidth;\ncanvas.height = window.innerHeight;\n\nconst particles = [];\nfor(let i = 0; i < 60; i++) {\n  particles.push({\n    x: Math.random() * canvas.width,\n    y: Math.random() * canvas.height,\n    vx: (Math.random() - 0.5) * 2,\n    vy: (Math.random() - 0.5) * 2,\n    size: Math.random() * 3 + 1\n  });\n}\n\nfunction animate() {\n  ctx.fillStyle = 'rgba(5, 6, 8, 0.2)';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  ctx.fillStyle = '#22d3ee';\n  \n  particles.forEach(p => {\n    p.x += p.vx;\n    p.y += p.vy;\n    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;\n    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;\n    ctx.beginPath();\n    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);\n    ctx.fill();\n  });\n  requestAnimationFrame(animate);\n}\nanimate();`
  }
};

export default function CodeStudioPage() {
  const [html, setHtml] = useState(STARTER_TEMPLATES.vanilla.html);
  const [css, setCss] = useState(STARTER_TEMPLATES.vanilla.css);
  const [js, setJs] = useState(STARTER_TEMPLATES.vanilla.js);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const renderIframe = (customHtml = html, customCss = css, customJs = js) => {
    const combinedCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${customCss}</style>
        </head>
        <body>
          ${customHtml}
          <script>
            const originalLog = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', message: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', message: '[Error on line ' + line + ']: ' + msg }, '*');
            };
            try {
              ${customJs}
            } catch(e) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', message: '[Runtime Error]: ' + e.message }, '*');
            }
          </script>
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = combinedCode;
    }
  };

  const runCode = () => {
    setLogs([]);
    renderIframe(html, css, js);
  };

  useEffect(() => {
    renderIframe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CONSOLE_LOG') {
        setLogs((prev) => [...prev.slice(-20), event.data.message]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCopy = () => {
    const fullSource = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
    navigator.clipboard.writeText(fullSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setHtml(STARTER_TEMPLATES.vanilla.html);
    setCss(STARTER_TEMPLATES.vanilla.css);
    setJs(STARTER_TEMPLATES.vanilla.js);
    setLogs([]);
    setTimeout(runCode, 50);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
      <ToolHeader
        title="Code Studio Sandbox"
        category="Development"
        description="Write and test HTML, CSS, and JavaScript with instant live rendering, integrated iframe sandbox, and console logging."
        onReset={handleReset}
        onCopy={handleCopy}
        copied={copied}
      />

      <div className="bg-[#020617] p-4 rounded-2xl border border-white/8 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium">Presets:</span>
          <button onClick={() => { setHtml(STARTER_TEMPLATES.vanilla.html); setCss(STARTER_TEMPLATES.vanilla.css); setJs(STARTER_TEMPLATES.vanilla.js); setTimeout(runCode, 50); }} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/8 transition-all">Glassmorphic Card</button>
          <button onClick={() => { setHtml(STARTER_TEMPLATES.particles.html); setCss(STARTER_TEMPLATES.particles.css); setJs(STARTER_TEMPLATES.particles.js); setTimeout(runCode, 50); }} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/8 transition-all">Particle Canvas</button>
        </div>

        <button onClick={runCode} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-900 font-bold text-xs transition-all active:scale-95">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Sandbox</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
        <div className="bg-[#020617] p-4 rounded-2xl border border-white/8 flex flex-col h-[520px]">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/8 mb-3">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/8 text-xs">
              {(['html', 'css', 'js'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded-md font-semibold transition-all ${activeTab === tab ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}>{tab.toUpperCase()}</button>
              ))}
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">
              {activeTab === 'html' ? `${html.length} chars` : activeTab === 'css' ? `${css.length} chars` : `${js.length} chars`}
            </span>
          </div>

          <div className="flex-1 w-full relative">
            {activeTab === 'html' && <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="w-full h-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-xl resize-none focus:outline-none focus:border-cyan-400 transition-colors" spellCheck={false} />}
            {activeTab === 'css' && <textarea value={css} onChange={(e) => setCss(e.target.value)} className="w-full h-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-xl resize-none focus:outline-none focus:border-cyan-400 transition-colors" spellCheck={false} />}
            {activeTab === 'js' && <textarea value={js} onChange={(e) => setJs(e.target.value)} className="w-full h-full p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-white/8 rounded-xl resize-none focus:outline-none focus:border-cyan-400 transition-colors" spellCheck={false} />}
          </div>
        </div>

        <div className="bg-[#020617] p-4 rounded-2xl border border-white/8 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3 text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5"><Eye className="w-4 h-4 text-cyan-400" />Interactive Live Preview</span>
            <span className="text-[11px] text-neutral-500 font-mono">sandbox ready</span>
          </div>

          <div className="flex-1 w-full bg-black/70 rounded-xl border border-white/8 overflow-hidden relative">
            <iframe ref={iframeRef} title="Code Studio Sandbox" sandbox="allow-scripts allow-modals" className="w-full h-full border-none" />
          </div>
        </div>
      </div>

      <div className="bg-[#020617] p-4 rounded-2xl border border-white/8 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/8">
          <span className="font-semibold text-neutral-300 flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-cyan-400" />Console Output</span>
          <button onClick={() => setLogs([])} className="text-neutral-500 hover:text-neutral-200 text-[11px] transition-colors">Clear Logs</button>
        </div>

        <div className="font-mono text-xs text-neutral-300 bg-black/40 p-3 rounded-xl max-h-32 overflow-y-auto space-y-1">
          {logs.length > 0 ? logs.map((log, idx) => <div key={idx} className="flex items-start gap-2"><span className="text-cyan-400 select-none">{'>'}</span><span>{log}</span></div>) : <span className="text-neutral-600">No console output recorded yet.</span>}
        </div>
      </div>
    </div>
  );
}