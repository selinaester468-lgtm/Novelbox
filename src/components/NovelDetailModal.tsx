import React from 'react';
import { X, Star, Edit3, Trash2, CheckCircle2, Clock, BookMarked, Quote, Plus, Minus, BookOpen, Calendar, FileText, Layers } from 'lucide-react';
import { Novel, ReadingStatus } from '../types/novel';

interface NovelDetailModalProps {
  novel: Novel | null;
  onClose: () => void;
  onRead: (novel: Novel) => void;
  onEdit: (novel: Novel) => void;
  onDelete: (novel: Novel) => void;
  onUpdateProgress: (novel: Novel, newChapter: number) => void;
  onUpdateStatus: (novel: Novel, status: ReadingStatus) => void;
}

export const NovelDetailModal: React.FC<NovelDetailModalProps> = ({
  novel,
  onClose,
  onRead,
  onEdit,
  onDelete,
  onUpdateProgress,
  onUpdateStatus,
}) => {
  if (!novel) return null;

  const currentChapter = novel.currentChapter || 0;
  const totalChapters = novel.totalChapters || 0;
  const progressPercent = totalChapters > 0 ? Math.min(100, Math.round((currentChapter / totalChapters) * 100)) : 0;

  const handleStepChapter = (delta: number) => {
    const nextChapter = Math.max(0, currentChapter + delta);
    const cappedChapter = totalChapters > 0 ? Math.min(totalChapters, nextChapter) : nextChapter;
    onUpdateProgress(novel, cappedChapter);

    // If reached end, suggest finishing
    if (totalChapters > 0 && cappedChapter === totalChapters && novel.status !== 'Selesai') {
      onUpdateStatus(novel, 'Selesai');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-[#FAF8F5] border border-[#E6DDD1] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close & Actions */}
        <div className="sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md px-6 py-4 border-b border-[#EBE3D7] flex items-center justify-between z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A796B]">
            Detail Koleksi Novel
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(novel);
              }}
              className="p-2 text-[#6B5A4E] hover:text-[#2E2016] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
              title="Edit Novel"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(novel);
              }}
              className="p-2 text-[#A05252] hover:text-[#802D2D] hover:bg-[#FBE8E8] rounded-xl transition-colors cursor-pointer"
              title="Hapus Novel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7F6E61] hover:text-[#2E2016] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Top section: Cover + Title & Author */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Book Cover */}
            <div className="w-full sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden bg-[#EFE8DF] border border-[#DFCFC0] shadow-md shrink-0 flex items-center justify-center mx-auto sm:mx-0">
              {novel.coverUrl ? (
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center text-[#826F60]">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-70" />
                  <p className="font-serif font-bold text-sm text-[#382B21]">{novel.title}</p>
                </div>
              )}
            </div>

            {/* Info and quick stats */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#806F62]">
                <span className="font-semibold text-[#665040] bg-[#EFE8DE] px-2.5 py-1 rounded-md">
                  {novel.genre}
                </span>
                {novel.publishedYear && <span>Tahun: {novel.publishedYear}</span>}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] leading-tight">
                {novel.title}
              </h2>

              <p className="text-sm sm:text-base font-medium text-[#6B5748]">
                Penulis: <span className="text-[#2C1E14]">{novel.author}</span>
              </p>

              {/* Rating stars */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-[#B58632]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        novel.rating >= star
                          ? 'fill-current'
                          : novel.rating >= star - 0.5
                          ? 'fill-current opacity-60'
                          : 'stroke-current fill-none opacity-40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#3C2D22] font-mono tabular-nums">
                  {novel.rating ? `${novel.rating.toFixed(1)} / 5.0` : 'Belum dinilai'}
                </span>
              </div>

              {/* Primary CTA Read Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onRead(novel);
                  }}
                  className="w-full py-2.5 px-4 bg-[#755946] hover:bg-[#634938] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-xs active:scale-98"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mulai Baca Novel Ini di HP/Laptop</span>
                </button>
              </div>

              {/* Status selection buttons */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#7E6E60] block mb-1.5">
                  Status Bacaan Saat Ini:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['Ingin Dibaca', 'Sedang Dibaca', 'Selesai', 'Ditunda'] as ReadingStatus[]).map((status) => {
                    const isSelected = novel.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => onUpdateStatus(novel, status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border text-center ${
                          isSelected
                            ? 'bg-[#735743] text-white border-[#735743] shadow-xs'
                            : 'bg-white hover:bg-[#F5EFE7] text-[#5F4E40] border-[#E5DCD0]'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Reading Tracker Bar (if chapters exist) */}
          {totalChapters > 0 && (
            <div className="bg-white border border-[#E8DFD3] rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#756455] uppercase tracking-wider">
                    Progres Membaca
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif text-2xl font-bold text-[#2A1E15] tabular-nums">
                      Bab {currentChapter}
                    </span>
                    <span className="text-xs text-[#8A7A6D]">dari {totalChapters} bab</span>
                  </div>
                </div>

                {/* Chapter stepper buttons */}
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E9DFD3]">
                  <button
                    onClick={() => handleStepChapter(-1)}
                    disabled={currentChapter <= 0}
                    title="Kurangi 1 bab"
                    className="p-1.5 rounded-lg text-[#6B5A4D] hover:text-[#2B1F16] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-medium text-[#7D6B5D] tabular-nums">
                    {progressPercent}%
                  </span>
                  <button
                    onClick={() => handleStepChapter(1)}
                    disabled={currentChapter >= totalChapters}
                    title="Tambah 1 bab"
                    className="p-1.5 rounded-lg text-[#6B5A4D] hover:text-[#2B1F16] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-[#EFE9DF] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#785C47] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded Document Info Card (if novel was imported from file) */}
          {novel.fileName && (
            <div className="bg-[#F2F7EC] border border-[#C5DDB8] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DFEED3] text-[#33631A] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#2A4B1A] text-xs sm:text-sm">{novel.fileName}</p>
                  <p className="text-[11px] text-[#4F6E3B]">
                    {novel.fileSize ? `Ukuran: ${novel.fileSize} • ` : ''}Isi teks & bab tersimpan di Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onRead(novel);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#4A6F32] hover:bg-[#3D5C28] text-white font-medium text-xs cursor-pointer shadow-2xs transition-colors self-start sm:self-center"
              >
                Baca Dokumen
              </button>
            </div>
          )}

          {/* Chapters List */}
          {novel.chapters && novel.chapters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A695A] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Daftar Bab ({novel.chapters.length} Bab)</span>
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    onRead(novel);
                  }}
                  className="text-xs text-[#7A5B45] hover:text-[#523A2A] font-medium underline underline-offset-2 cursor-pointer"
                >
                  Buka Pembaca
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 bg-white/80 p-2.5 rounded-2xl border border-[#EAE1D6]">
                {novel.chapters.map((ch, idx) => (
                  <div
                    key={ch.id || idx}
                    onClick={() => {
                      onUpdateProgress(novel, ch.number);
                      onClose();
                      onRead(novel);
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#F5EFE7] transition-colors cursor-pointer flex items-center justify-between group border border-transparent hover:border-[#E4D7C8]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-6 h-6 rounded-lg bg-[#EFE8DD] text-[#634E3E] text-xs font-semibold flex items-center justify-center shrink-0">
                        {ch.number}
                      </span>
                      <span className="text-xs font-medium text-[#382B21] group-hover:text-[#634E3E] truncate">
                        {ch.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8C7A6D] group-hover:text-[#634E3E] font-medium shrink-0">
                      Baca Bab →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis / Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A695A]">
              Sinopsis Novel
            </h3>
            <p className="text-sm sm:text-base text-[#46382D] leading-relaxed whitespace-pre-line bg-white/70 p-4 rounded-2xl border border-[#EAE1D6]">
              {novel.description}
            </p>
          </div>

          {/* Favorite Quote (if provided) */}
          {novel.favoriteQuote && (
            <div className="bg-[#F5EFE6] border border-[#DFD1C1] rounded-2xl p-4 sm:p-5 relative">
              <Quote className="w-8 h-8 text-[#A89381] absolute top-3 right-3 opacity-30" />
              <h4 className="text-xs font-semibold text-[#7D6857] uppercase tracking-wider mb-1.5">
                Kutipan Favorit
              </h4>
              <p className="font-serif italic text-sm sm:text-base text-[#38291F] leading-relaxed">
                {novel.favoriteQuote}
              </p>
            </div>
          )}

          {/* Personal Notes (if provided) */}
          {novel.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-[#7D6857] uppercase tracking-wider">
                Catatan Pribadi
              </h4>
              <p className="text-xs sm:text-sm text-[#544437] bg-white p-3.5 rounded-xl border border-[#EBE4DA] leading-relaxed">
                {novel.notes}
              </p>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="pt-3 border-t border-[#EBE3D7] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8E7E71]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ditambahkan pada: {novel.dateAdded}</span>
            </div>
            {novel.dateCompleted && (
              <span className="text-[#4E673B] font-medium">
                Diselesaikan pada: {novel.dateCompleted}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
