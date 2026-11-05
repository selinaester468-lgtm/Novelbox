import React from 'react';
import { Star, Edit3, Trash2, BookOpen, Clock, CheckCircle2, BookMarked } from 'lucide-react';
import { Novel, ReadingStatus } from '../types/novel';

interface NovelListViewProps {
  novels: Novel[];
  onSelect: (novel: Novel) => void;
  onRead: (novel: Novel) => void;
  onEdit: (novel: Novel) => void;
  onDelete: (novel: Novel) => void;
  onUpdateStatus: (novel: Novel, status: ReadingStatus) => void;
}

export const NovelListView: React.FC<NovelListViewProps> = ({
  novels,
  onSelect,
  onRead,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'Sedang Dibaca':
        return { bg: 'bg-[#F7EFE4]', text: 'text-[#845E3B]' };
      case 'Selesai':
        return { bg: 'bg-[#EFF4E8]', text: 'text-[#4F683D]' };
      case 'Ingin Dibaca':
        return { bg: 'bg-[#F5EDF0]', text: 'text-[#835667]' };
      default:
        return { bg: 'bg-[#EFECE8]', text: 'text-[#6F6860]' };
    }
  };

  if (novels.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-[#EBE4DA]">
        <p className="text-sm text-[#7D6D61]">Tidak ada novel yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFD4] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAF7F2] border-b border-[#EBE4DA] text-xs font-semibold text-[#786659]">
            <tr>
              <th className="py-3.5 pl-4 pr-3 sm:pl-6">Novel</th>
              <th className="py-3.5 px-3">Genre</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Progres</th>
              <th className="py-3.5 px-3">Rating</th>
              <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EDE5]">
            {novels.map((novel) => {
              const statusBadge = getStatusBadge(novel.status);
              const progressPercent =
                novel.totalChapters && novel.totalChapters > 0
                  ? Math.min(100, Math.round(((novel.currentChapter || 0) / novel.totalChapters) * 100))
                  : 0;

              return (
                <tr
                  key={novel.id}
                  onClick={() => onSelect(novel)}
                  className="hover:bg-[#FAF7F2]/70 transition-colors cursor-pointer"
                >
                  {/* Novel Thumbnail + Info */}
                  <td className="py-3 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-md bg-[#EDE4D8] overflow-hidden shrink-0 border border-[#DDD3C5]">
                        {novel.coverUrl ? (
                          <img
                            src={novel.coverUrl}
                            alt={novel.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8C7665]">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                        <p className="font-serif font-semibold text-[#2C2017] truncate hover:text-[#7A5B45]">
                          {novel.title}
                        </p>
                        <p className="text-xs text-[#7A6A5E] truncate">{novel.author}</p>
                      </div>
                    </div>
                  </td>

                  {/* Genre */}
                  <td className="py-3 px-3 text-xs text-[#6F5F53] whitespace-nowrap">
                    {novel.genre}
                  </td>

                  {/* Status with inline changer */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={novel.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(novel, e.target.value as ReadingStatus);
                      }}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border border-transparent outline-none cursor-pointer ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      <option value="Ingin Dibaca">Ingin Dibaca</option>
                      <option value="Sedang Dibaca">Sedang Dibaca</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Ditunda">Ditunda</option>
                    </select>
                  </td>

                  {/* Progres */}
                  <td className="py-3 px-3 text-xs text-[#6D5D51] whitespace-nowrap tabular-nums">
                    {novel.totalChapters ? (
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium text-[#2E2218]">
                            {novel.currentChapter || 0}
                          </span>
                          <span className="text-[#8E7E72]">/{novel.totalChapters} bab</span>
                        </div>
                        <div className="w-16 h-1 bg-[#EBE4DA] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#826652]"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3 whitespace-nowrap text-xs">
                    <div className="flex items-center gap-1 text-[#B58632]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-[#3A2C21] font-mono tabular-nums">
                        {novel.rating ? novel.rating.toFixed(1) : '-'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onRead(novel)}
                        title="Baca Novel Langsung"
                        className="px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#755946] text-[#654D3C] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#E7DEC8]"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Baca</span>
                      </button>
                      <button
                        onClick={() => onEdit(novel)}
                        title="Edit"
                        className="p-1.5 text-[#7F6E61] hover:text-[#2E2017] hover:bg-[#F0EAE1] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(novel)}
                        title="Hapus"
                        className="p-1.5 text-[#9E5D5D] hover:text-[#802D2D] hover:bg-[#FBEBEB] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
