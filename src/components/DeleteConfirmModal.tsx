import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Novel } from '../types/novel';

interface DeleteConfirmModalProps {
  novel: Novel | null;
  onClose: () => void;
  onConfirm: (novel: Novel) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  novel,
  onClose,
  onConfirm,
}) => {
  if (!novel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-[#FAF8F5] border border-[#E6DDD1] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FDEEEE] text-[#A63A3A] flex items-center justify-center shrink-0 border border-[#F6D5D5]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#2E2016]">
              Hapus Novel dari Koleksi?
            </h3>
            <p className="text-xs sm:text-sm text-[#736356] leading-relaxed">
              Apakah Anda yakin ingin menghapus novel{' '}
              <strong className="text-[#2E2016]">"{novel.title}"</strong> karya{' '}
              <span className="text-[#5A483B]">{novel.author}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE1D6]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#68574B] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(novel)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#A04242] hover:bg-[#8B3535] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Koleksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
