import React, { useState } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  RefreshCw, 
  X, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  Radio 
} from 'lucide-react';
import { 
  SUPABASE_SQL_SETUP, 
  SupabaseStatus, 
  checkSupabaseConnection, 
  seedAllNovelsToSupabase 
} from '../services/supabase';
import { Novel } from '../types/novel';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SupabaseStatus;
  statusMessage: string;
  novels: Novel[];
  onRefreshConnection: () => Promise<void>;
  onSeedSuccess?: (seededCount: number) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  status,
  statusMessage,
  novels,
  onRefreshConnection,
  onSeedSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCheckAgain = async () => {
    setIsChecking(true);
    setSyncFeedback(null);
    try {
      await onRefreshConnection();
    } finally {
      setIsChecking(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await seedAllNovelsToSupabase(novels);
      if (res.success) {
        setSyncFeedback(`Berhasil menyinkronkan ${res.count} novel ke tabel Supabase!`);
        if (onSeedSuccess) {
          onSeedSuccess(res.count);
        }
      } else {
        setSyncFeedback(`Gagal: ${res.error || 'Terjadi kesalahan saat menyinkronkan'}`);
      }
    } catch (err: any) {
      setSyncFeedback(`Gagal: ${err?.message || 'Koneksi terputus'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#FAF6F0] rounded-3xl border border-[#E8DEC8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-[#F2EAE0] to-[#FAF6F0] border-b border-[#EADFCF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E5D7C6] text-[#553824] flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#322015] leading-tight">
                Database Supabase
              </h3>
              <p className="text-[11px] text-[#786455]">
                Penyimpanan Cloud & Sinkronisasi Real-Time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#6F5B4E] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#4A3B31]">
          {/* Status Badge Box */}
          <div className="p-4 rounded-2xl bg-white border border-[#E9DFD2] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[11px] text-[#7A6759] uppercase tracking-wider">
                Status Koneksi
              </span>
              {status === 'connected' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E4EED7] text-[#3D6925] border border-[#CCDDBB]">
                  <span className="w-2 h-2 rounded-full bg-[#4E8C2F] animate-pulse" />
                  Terhubung & Sinkron
                </span>
              )}
              {status === 'table_missing' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFF2DE] text-[#8C5D19] border border-[#F2DEBF]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Menunggu Tabel SQL
                </span>
              )}
              {status === 'error' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FDE8E8] text-[#9A2D2D] border border-[#F5CACA]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Koneksi Bermasalah
                </span>
              )}
              {status === 'checking' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0EBE3] text-[#715F52]">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Memeriksa...
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#5C4A3E] leading-relaxed">
              {statusMessage}
            </p>

            <div className="pt-2 border-t border-[#F3ECE2] flex items-center justify-between text-[11px] text-[#827164]">
              <span>Project Host:</span>
              <span className="font-mono text-[10px] text-[#473427] bg-[#F7F2EC] px-2 py-0.5 rounded-md">
                vwrymizddjhjvhujxner.supabase.co
              </span>
            </div>
          </div>

          {/* If table is missing, show SQL instructions */}
          {status === 'table_missing' && (
            <div className="p-4 rounded-2xl bg-[#FFFBF4] border border-[#F0E2CD] space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[#9E6421] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#4B3421] text-xs">
                    Langkah Terakhir: Buat Tabel di Supabase
                  </h4>
                  <p className="text-[11px] text-[#7A634E] mt-0.5 leading-relaxed">
                    Koneksi ke API Supabase Anda sudah aktif! Anda hanya perlu menjalankan 1 skrip SQL di dashboard Supabase agar tabel <strong>novels</strong> siap menerima data.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#5E4839] pl-1">
                <p>1. Buka dashboard proyek Supabase Anda.</p>
                <p>2. Masuk ke menu <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>.</p>
                <p>3. Salin (Copy) skrip di bawah ini, tempel (Paste), lalu klik <strong>Run</strong>.</p>
              </div>

              {/* Copy SQL Button */}
              <button
                onClick={handleCopySql}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5C3F2B] hover:bg-[#4C3322] active:scale-98 text-white font-medium flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#C4E8A8]" />
                    <span>Skrip SQL Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Skrip SQL Tabel Supabase</span>
                  </>
                )}
              </button>

              <pre className="p-2.5 bg-[#2B1D14] text-[#EFE7DE] rounded-xl text-[10px] font-mono max-h-28 overflow-y-auto whitespace-pre leading-relaxed select-all">
                {SUPABASE_SQL_SETUP}
              </pre>

              {/* Re-check button */}
              <button
                onClick={handleCheckAgain}
                disabled={isChecking}
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#D8C9B6] hover:bg-[#F5EFE7] text-[#553F2F] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Sedang Memeriksa...' : 'Saya Sudah Run Skrip SQL, Cek Ulang Sekarang'}</span>
              </button>
            </div>
          )}

          {/* When Connected */}
          {status === 'connected' && (
            <div className="p-4 rounded-2xl bg-[#F4F9ED] border border-[#D3E5BF] space-y-3">
              <div className="flex items-center gap-2 text-[#3D6925]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs">
                  Semua Perubahan Disimpan Langsung ke Supabase
                </span>
              </div>
              <p className="text-[11px] text-[#4F683A] leading-relaxed">
                Setiap kali Anda menambah novel baru, mengedit bab, atau memperbarui status bacaan, data langsung tersimpan ke database cloud PostgreSQL Anda secara permanen.
              </p>

              {/* Sync / Seed Button */}
              <button
                onClick={handleSyncToSupabase}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 rounded-xl bg-[#496B32] hover:bg-[#3D5B2A] active:scale-98 text-white font-medium flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs disabled:opacity-50"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>
                  {isSyncing ? 'Menyinkronkan...' : `Sinkronkan Ulang ${novels.length} Novel ke Supabase`}
                </span>
              </button>

              {syncFeedback && (
                <div className="p-2.5 rounded-xl bg-white/90 border border-[#CCDDBB] text-[11px] text-[#33561F] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#4E8C2F] shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}
            </div>
          )}

          {/* Live Realtime Feature note */}
          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E9DFD2] flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#EFE4D6] text-[#69513F] flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-[#8C6B52]" />
            </div>
            <p className="text-[11px] text-[#6B5A4E] leading-snug">
              Mendukung sinkronisasi multi-tab & multi-device. Anda dapat mengakses koleksi ini dari HP maupun laptop secara bersamaan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F2EAE0] border-t border-[#E8DEC8] flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard/project/vwrymizddjhjvhujxner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-[#7C5A40] hover:text-[#523824] flex items-center gap-1 underline underline-offset-2"
          >
            <span>Buka Dashboard Supabase</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#6B4E38] hover:bg-[#5A3F2B] text-white text-xs font-medium cursor-pointer shadow-2xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
