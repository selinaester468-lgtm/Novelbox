import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, X, Check, AlertCircle } from 'lucide-react';
import { Novel } from '../types/novel';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
  onImport: (importedNovels: Novel[]) => void;
  onReset: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  novels,
  onImport,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(novels, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `novelbox-koleksi-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setMessage({ type: 'success', text: 'Koleksi berhasil diekspor sebagai berkas JSON!' });
    } catch {
      setMessage({ type: 'error', text: 'Gagal mengekspor data koleksi.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
            onImport(parsed as Novel[]);
            setMessage({ type: 'success', text: `Berhasil mengimpor ${parsed.length} novel ke dalam perpustakaan!` });
          } else {
            setMessage({ type: 'error', text: 'Format berkas JSON tidak sesuai struktur NovelBox.' });
          }
        } catch {
          setMessage({ type: 'error', text: 'Berkas JSON rusak atau tidak valid.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmReset = () => {
    if (window.confirm('Kembalikan ke data contoh perpustakaan awal? Perubahan novel kustom Anda akan digantikan.')) {
      onReset();
      setMessage({ type: 'success', text: 'Perpustakaan berhasil diatur ulang ke data contoh.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-[#FAF8F5] border border-[#E6DDD1] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EBE3D7] pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2E2016]">
              Cadangan & Kelola Data
            </h3>
            <p className="text-xs text-[#7A6A5E]">
              Amankan koleksi novel Anda atau pulihkan data kapan saja.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7F6E61] hover:text-[#2E2016] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-[#EEF6E8] text-[#3E5C2C] border border-[#D5E8CB]'
                : 'bg-[#FDF0F0] text-[#913838] border border-[#F8D2D2]'
            }`}
          >
            {message.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export button */}
          <div className="bg-white p-4 rounded-xl border border-[#E8DFD4] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#302217]">Ekspor Koleksi JSON</p>
              <p className="text-xs text-[#7F6E61]">
                Unduh salinan lengkap semua novel Anda ({novels.length} buku).
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2E2016] bg-[#EFE8DE] hover:bg-[#E2D8CC] rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </button>
          </div>

          {/* Import button */}
          <div className="bg-white p-4 rounded-xl border border-[#E8DFD4] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#302217]">Impor Berkas JSON</p>
              <p className="text-xs text-[#7F6E61]">
                Pulihkan atau masukkan koleksi novel dari berkas JSON yang sudah ada.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2E2016] bg-[#EFE8DE] hover:bg-[#E2D8CC] rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih File</span>
            </button>
          </div>

          {/* Reset button */}
          <div className="bg-white p-4 rounded-xl border border-[#E8DFD4] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#8C3A3A]">Reset ke Data Contoh</p>
              <p className="text-xs text-[#7F6E61]">
                Kembalikan perpustakaan ke 6 novel contoh pilihan kurator.
              </p>
            </div>
            <button
              onClick={handleConfirmReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#8C3A3A] bg-[#FDEEEE] hover:bg-[#F9DADA] rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#2E2016] bg-[#E2D8CC] hover:bg-[#D5C9BC] rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
