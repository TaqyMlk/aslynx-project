'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Download, 
  CheckCircle2, 
  FileArchive, 
  Terminal, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  Info,
  CloudUpload,
  LogOut,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  uploadZipToDrive, 
  DriveUploadResult 
} from '@/src/lib/googleAuth';
import { User } from 'firebase/auth';

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Google Drive state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadResult, setDriveUploadResult] = useState<DriveUploadResult | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setDriveError(null);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: any) {
      setDriveError(err?.message || 'Gagal login dengan Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setDriveUploadResult(null);
  };

  const handleUploadToGoogleDrive = async () => {
    if (!accessToken) {
      handleGoogleSignIn();
      return;
    }

    const confirmUpload = window.confirm(
      'Simpan file aslynx-unified-platform-ready-to-deploy.zip langsung ke root direktori Google Drive Anda?'
    );
    if (!confirmUpload) return;

    try {
      setIsUploadingToDrive(true);
      setDriveError(null);

      // Fetch the zip blob
      const zipRes = await fetch('/api/download');
      if (!zipRes.ok) {
        throw new Error('Gagal mengambil file ZIP untuk diupload');
      }
      const zipBlob = await zipRes.blob();

      // Upload to Google Drive
      const result = await uploadZipToDrive(
        accessToken,
        zipBlob,
        'aslynx-unified-platform-ready-to-deploy.zip'
      );

      setDriveUploadResult(result);
    } catch (err: any) {
      setDriveError(err?.message || 'Gagal mengunggah file ke Google Drive');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadProgress(15);
      
      const response = await fetch('/api/download');
      if (!response.ok) {
        throw new Error('Gagal mengambil file dari server');
      }

      setDownloadProgress(60);
      const blob = await response.blob();
      
      setDownloadProgress(90);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'aslynx-unified-platform-ready-to-deploy.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadProgress(100);
      setDownloadComplete(true);
    } catch {
      // Fallback direct static link
      window.location.href = '/aslynx-unified-platform-ready-to-deploy.zip';
      setDownloadComplete(true);
    } finally {
      setTimeout(() => {
        setDownloading(false);
      }, 800);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg glass-panel hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Drive Direct Import & Production Ready Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Export & Download Source Code AsLynx
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Simpan arsip ZIP lengkap langsung ke <strong>Google Drive</strong> akun Anda atau unduh ke perangkat lokal.
          </p>
        </div>

        {/* Google Drive Direct Integration Card */}
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden bg-gradient-to-b from-cyan-950/20 via-black/40 to-transparent shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                  <CloudUpload className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Import Langsung ke Google Drive</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      OAuth v3
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Otomatis menyimpan file arsip ZIP ke penyimpanan Google Drive Anda dengan 1 klik.
                  </p>
                </div>
              </div>

              {/* User Account / Auth State */}
              {user ? (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-zinc-300 max-w-[140px] truncate">{user.email || user.displayName}</span>
                  <button
                    onClick={handleGoogleLogout}
                    title="Sign Out"
                    className="text-zinc-500 hover:text-red-400 ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Action Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-2">
                <div className="text-xs text-zinc-300 leading-relaxed">
                  File yang diunggah: <strong className="text-white font-mono">aslynx-unified-platform-ready-to-deploy.zip</strong> (~202 KB) berisi seluruh file Next.js 15, konfigurasi, 12+ Lab Tools, dan AI Agent.
                </div>
                <div className="text-[11px] text-zinc-500">
                  *Aplikasi memerlukan izin untuk menyimpan file ke Google Drive Anda atas persetujuan Anda.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {!user ? (
                  <button
                    id="btn-google-drive-login"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="w-full py-3 px-4 rounded-xl font-medium text-xs bg-white text-zinc-900 hover:bg-zinc-100 transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>{isSigningIn ? 'Menghubungkan...' : 'Sign in with Google'}</span>
                  </button>
                ) : (
                  <button
                    id="btn-upload-to-drive"
                    onClick={handleUploadToGoogleDrive}
                    disabled={isUploadingToDrive}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98 disabled:opacity-50"
                  >
                    {isUploadingToDrive ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengunggah ke Drive...</span>
                      </>
                    ) : (
                      <>
                        <CloudUpload className="w-4 h-4" />
                        <span>Simpan ZIP ke Drive</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {driveError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{driveError}</span>
              </div>
            )}

            {/* Upload Success Alert */}
            {driveUploadResult && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>File Berhasil Diimpor ke Google Drive Anda!</span>
                </div>
                <div className="text-zinc-300 font-mono text-[11px]">
                  Nama Berkas: {driveUploadResult.name}
                </div>
                <div className="pt-1 flex gap-2">
                  <a
                    href={driveUploadResult.webViewLink || `https://drive.google.com/file/d/${driveUploadResult.id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-medium transition-colors"
                  >
                    <span>Buka Berkas di Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Local Download Card */}
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <FileArchive className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>aslynx-unified-platform-ready-to-deploy.zip</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Format: Standalone ZIP Archive (No garbage `node_modules` / Clean state)
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-zinc-300">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      ~202 KB (Compressed)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Lint & Build Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar if Downloading */}
              {downloading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Memproses pengunduhan arsip...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {downloadComplete && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>File berhasil diunduh! Silakan cek folder Downloads di komputer/perangkat Anda.</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex flex-col gap-2.5">
              <button
                id="btn-trigger-zip-download"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Mengunduh...' : 'Unduh ZIP ke Komputer'}</span>
              </button>

              <a
                href="/aslynx-unified-platform-ready-to-deploy.zip"
                download="aslynx-unified-platform-ready-to-deploy.zip"
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs text-zinc-300 hover:text-white glass-panel hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Alternatif: Direct Public Link</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>
        </div>

        {/* AI Studio Export Guide (Alternative Official Way) */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-cyan-950/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
            <Info className="w-4 h-4" />
            <span>Cara Ekspor Bawaan Google AI Studio:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Selain integrasi Google Drive di atas, Anda juga dapat mengklik tombol <strong>Menu / Settings (ikon titik tiga atau roda gigi di pojok kanan atas layar AI Studio)</strong>, lalu pilih opsi <strong>&quot;Export to ZIP&quot;</strong> atau <strong>&quot;Export to GitHub&quot;</strong> untuk mengunduh seluruh proyek secara langsung.
          </p>
        </div>

        {/* Quick Deployment Guide */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Panduan Menjalankan & Deploy</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Setup */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">1. Setup Lokal (Development)</span>
                <button
                  onClick={() => copyToClipboard('npm install && npm run dev', 'cmd-local')}
                  className="text-[11px] text-zinc-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedCmd === 'cmd-local' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'cmd-local' ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                <div className="text-zinc-500"># Ekstrak lalu masuk ke folder:</div>
                <div>npm install</div>
                <div className="text-zinc-500 mt-2"># Jalankan dev server:</div>
                <div className="text-cyan-400">npm run dev</div>
              </div>
            </div>

            {/* Production Build */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">2. Deploy Produksi (Vercel / VPS)</span>
                <button
                  onClick={() => copyToClipboard('npm run build && npm start', 'cmd-prod')}
                  className="text-[11px] text-zinc-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedCmd === 'cmd-prod' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'cmd-prod' ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                <div className="text-zinc-500"># Build static & server bundle:</div>
                <div>npm run build</div>
                <div className="text-zinc-500 mt-2"># Start server port 3000:</div>
                <div className="text-cyan-400">npm start</div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Manifest */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Struktur Berkas di Dalam ZIP</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono text-zinc-400">
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">📂 /app (App Router & 12 Lab Pages)</div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">📂 /src/components (Glass UI System)</div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">📂 /src/server/agent (Autonomous Agent)</div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">📂 /public (Static Assets & Icons)</div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">📄 tailwind.config & globals.css</div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">📄 package.json & tsconfig.json</div>
          </div>
        </div>
      </div>
    </div>
  );
}

