'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SOCIALS } from '@/src/data/socials';
import { Mail, Send, Check, Copy, MessageSquare, Flame, Github } from 'lucide-react';

export default function ContactSection() {
  const [copied, setCopied] = useState(false), [sent, setSent] = useState(false), [sending, setSending] = useState(false), [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const email = 'admin@aslynx.store';
  const handleCopy = () => { navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!formState.name || !formState.email || !formState.message || sending) return; setSending(true); setError(null); try { const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formState) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Failed to send your message.'); setSent(true); } catch (err) { setError(err instanceof Error ? err.message : 'Failed to send your message. Please retry.'); } finally { setSending(false); } };
  const getSocialIcon = (name: string) => name === 'GitHub' ? <Github className="w-5 h-5" /> : name === 'CurseForge' ? <Flame className="w-5 h-5" /> : name === 'Discord' ? <MessageSquare className="w-5 h-5" /> : <Mail className="w-5 h-5" />;
  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400 mb-3 flex items-center justify-center gap-1.5"><Mail className="w-3.5 h-3.5" />Get in Touch</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Let's Build Something Exceptional</h2>
        <p className="text-sm text-neutral-400">Discuss an AI project, custom Minecraft add-on, or modern web platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="space-y-6">
          <div className="bg-[#020617] p-6 sm:p-8 rounded-2xl border border-white/8 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Direct Communication</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">Send a direct message or connect across the platforms below.</p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 text-neutral-200 flex items-center justify-center shrink-0"><Mail className="w-4 h-4" /></div>
                <span className="text-xs sm:text-sm text-neutral-200 font-medium truncate">{email}</span>
              </div>
              <button onClick={handleCopy} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 shrink-0">{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">{SOCIALS.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 bg-[#020617] hover:bg-white/[0.03] p-4 rounded-2xl border border-white/8 hover:border-white/12 transition-all"><div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center text-neutral-200 shrink-0">{getSocialIcon(s.name)}</div><div className="min-w-0"><div className="text-xs font-medium text-white truncate">{s.name}</div><div className="text-[11px] text-neutral-500 truncate">@{s.username}</div></div></a>)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}>
          {sent ? <div className="bg-[#020617] p-8 sm:p-10 rounded-2xl border border-white/8 text-center space-y-3"><div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto"><Check className="w-6 h-6 text-emerald-400" /></div><h3 className="text-lg font-bold text-white">Message Sent</h3><p className="text-xs text-neutral-400">I'll respond within 24–48 hours.</p></div> : <form onSubmit={handleSubmit} className="bg-[#020617] p-6 sm:p-8 rounded-2xl border border-white/8 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Send a Message</h3>
            <div><label htmlFor="name" className="block text-xs font-medium text-neutral-300 mb-1.5">Name</label><input id="name" type="text" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors" placeholder="Your name" /></div>
            <div><label htmlFor="email" className="block text-xs font-medium text-neutral-300 mb-1.5">Email</label><input id="email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors" placeholder="your@email.com" /></div>
            <div><label htmlFor="message" className="block text-xs font-medium text-neutral-300 mb-1.5">Message</label><textarea id="message" rows={5} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none" placeholder="Tell me about your project or idea…" /></div>
            {error && <p role="alert" className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{error}</p>}
            <button type="submit" disabled={sending || !formState.name || !formState.email || !formState.message} className="w-full py-3 rounded-xl bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-neutral-900 font-bold text-sm transition-all hover:bg-cyan-300 active:scale-[0.98] inline-flex items-center justify-center gap-2">{sending ? <span className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}{sending ? 'Sending…' : 'Send Message'}</button>
          </form>}
        </motion.div>
      </div>
    </section>
  );
}