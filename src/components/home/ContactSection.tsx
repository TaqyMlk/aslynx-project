'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SOCIALS } from '@/src/data/socials';
import { Mail, Send, Check, Copy, MessageSquare, Sparkles, Flame, Github } from 'lucide-react';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const email = 'admin@aslynx.store';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
    } catch (error) {
      console.error('Contact form error:', error);
    }
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'GitHub':
        return <Github className="w-5 h-5" />;
      case 'CurseForge':
        return <Flame className="w-5 h-5 text-cyan-400" />;
      case 'Discord':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      default:
        return <Mail className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Let’s Build Something Exceptional
        </h2>
        <p className="text-sm text-zinc-400">
          Whether you want to discuss an AI prompt engineering project, request a custom Minecraft add-on, or collaborate on a modern web platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Contact Info & Copy Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white">Direct Communication</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Feel free to send a direct message or connect across the official platforms below.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm text-zinc-200 font-medium truncate">
                  {email}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="glass-panel hover:glass-panel-elevated p-4 rounded-2xl border-white/5 hover:border-white/15 transition-all group"
              >
                <div className="mb-2 group-hover:scale-110 transition-transform">{getSocialIcon(s.name)}</div>
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{s.name}</h4>
                <p className="text-[11px] text-zinc-400 truncate">{s.username}</p>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: Message Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-2">Send a Message</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Leave a note and your contact details, and I will get back to you promptly.
          </p>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Message Received!</h4>
              <p className="text-xs text-zinc-400">
                Thank you for reaching out. I will respond to {formState.email} soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivers"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Message / Inquiry</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your project, idea, or questions..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
