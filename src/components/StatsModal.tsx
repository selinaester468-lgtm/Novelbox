import React from 'react';
import { X, BookOpen, CheckCircle2, Clock, BookMarked, Star, Award, TrendingUp } from 'lucide-react';
import { Novel } from '../types/novel';
import { calculateStats } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, novels }) => {
  if (!isOpen) return null;

  const stats = calculateStats(novels);

  // Genre distribution
  const genreCounts: { [genre: string]: number } = {};
  novels.forEach((n) => {
    genreCounts[n.genre] = (genreCounts[n.genre] || 0) + 1;
  });
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.finished / stats.total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-[#FAF8F5] border border-[#E6DDD1] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EBE3D7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ECE4D8] text-[#5C4737] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2E2016]">
                Statistik & Kebiasaan Membaca
              </h3>
              <p className="text-xs text-[#7A6A5E]">
                Ringkasan komprehensif perjalanan literasi digital Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7F6E61] hover:text-[#2E2016] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completion rate progress card */}
        <div className="bg-gradient-to-br from-[#735947] to-[#594233] text-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[#E1D3C5] uppercase tracking-wider font-medium">
                Tingkat Penyelesaian
              </p>
              <p className="font-serif text-3xl font-bold mt-0.5 tabular-nums">
                {completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-[#E8DDD2]">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-[#E4C89A] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-[#E4D7CA]">
            {stats.finished} dari {stats.total} novel telah selesai Anda baca sepenuhnya.
          </p>
        </div>

        {/* Breakdown counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD4] text-center">
            <p className="text-xs text-[#7A6A5E] font-medium">Sedang Dibaca</p>
            <p className="font-serif text-2xl font-bold text-[#845E3B] mt-1 tabular-nums">
              {stats.reading}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD4] text-center">
            <p className="text-xs text-[#7A6A5E] font-medium">Selesai</p>
            <p className="font-serif text-2xl font-bold text-[#4F683D] mt-1 tabular-nums">
              {stats.finished}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD4] text-center">
            <p className="text-xs text-[#7A6A5E] font-medium">Ingin Dibaca</p>
            <p className="font-serif text-2xl font-bold text-[#835667] mt-1 tabular-nums">
              {stats.wantToRead}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD4] text-center">
            <p className="text-xs text-[#7A6A5E] font-medium">Rata-rata Rating</p>
            <p className="font-serif text-2xl font-bold text-[#A07528] mt-1 tabular-nums">
              ★ {stats.avgRating}
            </p>
          </div>
        </div>

        {/* Genre distribution breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#736356]">
            Distribusi Genre Koleksi
          </h4>
          <div className="space-y-2">
            {sortedGenres.map(([genreName, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={genreName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#524135]">
                    <span className="font-medium">{genreName}</span>
                    <span className="text-[#847467] tabular-nums font-mono">
                      {count} novel ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EAE2D8] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#7B604D] h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#755946] hover:bg-[#634A39] rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
