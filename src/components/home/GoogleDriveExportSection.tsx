'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  CloudUpload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  FileArchive, 
  HardDrive, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  Download
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  uploadZipToDrive, 
  DriveUploadResult 
} from '@/src/lib/googleAuth';
import { User } from 'firebase/auth';

export default function GoogleDriveExportSection() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadResult, setDriveUploadResult] = useState<DriveUploadResult | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

    try {
      setIsUploadingToDrive(true);
      setDriveError(null);

      // Fetch the zip blob
      const zipRes = await fetch('/api/download');
      if (!zipRes.ok) {
        throw new Error('Gagal mengambil berkas ZIP');
      }
      const zipBlob = await zipRes.blob();

      // Upload directly to Google Drive
      const result = await uploadZipToDrive(
        accessToken,
        zipBlob,
        'aslynx-unified-platform-ready-to-deploy.zip'
      );

      setDriveUploadResult(result);
    } catch (err: any) {
      setDriveError(err?.message || 'Gagal mengunggah ke Google Drive');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const handleDirectDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch('/api/download');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aslynx-unified-platform-ready-to-deploy.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadSuccess(true);
    } catch {
      window.location.href = '/aslynx-unified-platform-ready-to-deploy.zip';
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="google-drive-export" className="px-4 sm:px-6 max-w-5xl mx-auto w-full my-6">
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-cyan-500/40 relative overflow-hidden bg-gradient-to-b from-cyan-950/30 via-black/50 to-transparent shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 shadow-md">
                <CloudUpload className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Direct Cloud Sync • Google Workspace Integration</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Import Source Code ke Google Drive
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Simpan langsung arsip ZIP proyek lengkap ke root Google Drive akun Anda tanpa perlu mengunduh manual.
                </p>
              </div>
            </div>

            {/* Auth status chip */}
            {user ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs shrink-0">
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
                <span className="text-zinc-200 max-w-[150px] truncate">{user.email || user.displayName}</span>
                <button
                  onClick={handleGoogleLogout}
                  title="Keluar"
                  className="text-zinc-500 hover:text-red-400 ml-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Details & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                <FileArchive className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white font-mono">aslynx-unified-platform-ready-to-deploy.zip</span>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      ~211 KB (Clean Archive)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Full Next.js 15 + Lab Tools
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Klik tombol di samping untuk mengimpor berkas zip proyek ke akun Google Drive Anda. Anda akan diminta persetujuan izin OAuth untuk menyimpan berkas ini ke Drive Anda.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              {!user ? (
                <button
                  id="btn-home-google-signin"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full py-3.5 px-4 rounded-2xl font-medium text-xs sm:text-sm bg-white text-zinc-900 hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'Menghubungkan...' : 'Login Google & Import'}</span>
                </button>
              ) : (
                <button
                  id="btn-home-upload-drive"
                  onClick={handleUploadToGoogleDrive}
                  disabled={isUploadingToDrive}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98 disabled:opacity-50"
                >
                  {isUploadingToDrive ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah ke Drive...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-5 h-5" />
                      <span>Import ZIP ke Google Drive</span>
                    </>
                  )}
                </button>
              )}

              {/* Direct local download option */}
              <button
                onClick={handleDirectDownload}
                disabled={downloading}
                className="w-full py-2.5 px-3 rounded-xl text-center text-xs text-zinc-300 hover:text-white glass-panel hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>{downloading ? 'Mengunduh...' : 'Unduh Langsung ke HP / Komputer'}</span>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {driveError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{driveError}</span>
            </div>
          )}

          {driveUploadResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm space-y-3"
            >
              <div className="flex items-center gap-2.5 font-bold text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>File Berhasil Diimpor Langsung ke Google Drive Anda!</span>
              </div>
              <p className="text-zinc-300 text-xs">
                File <strong className="text-white font-mono">{driveUploadResult.name}</strong> sekarang sudah tersimpan aman di Google Drive Anda.
              </p>
              <div className="pt-1">
                <a
                  href={driveUploadResult.webViewLink || `https://drive.google.com/file/d/${driveUploadResult.id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold text-xs transition-colors border border-emerald-500/40 shadow-sm"
                >
                  <span>Buka Berkas di Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>File ZIP berhasil diunduh ke folder Downloads perangkat Anda!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
