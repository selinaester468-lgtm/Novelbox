import React, { useState } from 'react';
import { BookOpen, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { Novel, ReadingStatus } from '../types/novel';

interface NovelCardProps {
  novel: Novel;
  onSelect: (novel: Novel) => void;
  onRead: (novel: Novel) => void;
  onEdit: (novel: Novel) => void;
  onDelete: (novel: Novel) => void;
  onUpdateStatus: (novel: Novel, status: ReadingStatus) => void;
}

export const NovelCard: React.FC<NovelCardProps> = ({
  novel,
  onSelect,
  onRead,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Badge styling matching reference image
  const getBadgeStyle = (status: ReadingStatus) => {
    switch (status) {
      case 'Sedang Dibaca':
        return {
          label: 'Sedang Dibaca',
          bg: 'bg-[#BE9479]',
          text: 'text-white',
        };
      case 'Selesai':
        return {
          label: 'Selesai Dibaca',
          bg: 'bg-[#9EA587]',
          text: 'text-white',
        };
      case 'Ingin Dibaca':
      case 'Ditunda':
      default:
        return {
          label: 'Belum Dibaca',
          bg: 'bg-[#8C7767]',
          text: 'text-white',
        };
    }
  };

  const badge = getBadgeStyle(novel.status);

  return (
    <div
      onClick={() => onRead(novel)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-[#EDE5DA] p-3 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Book Cover Container */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFE8DF] shadow-2xs flex items-center justify-center">
          {!imageError && novel.coverUrl ? (
            <img
              src={novel.coverUrl}
              alt={novel.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            />
          ) : (
            <div className="w-full h-full p-4 bg-gradient-to-br from-[#F5EFE7] to-[#E3D6C5] flex flex-col justify-between items-center text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#846F5F] font-semibold">
                {novel.genre}
              </span>
              <BookOpen className="w-8 h-8 text-[#7C624E] opacity-70" />
              <p className="font-serif font-bold text-xs text-[#35271E] line-clamp-2">
                {novel.title}
              </p>
            </div>
          )}

          {/* Floating Status Badge (Top Left of Cover - Exactly like Reference Image) */}
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide shadow-2xs ${badge.bg} ${badge.text}`}
            >
              {badge.label}
            </span>
          </div>

          {/* Quick Menu Button on Cover (Top Right) */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              title="Menu Novel"
              className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100 cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#E4DBD0] rounded-xl shadow-lg z-50 py-1 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onSelect(novel);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[#554234] hover:bg-[#F7F2EC] cursor-pointer"
                  >
                    Detail Lengkap
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit(novel);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[#554234] hover:bg-[#F7F2EC] cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Novel</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(novel);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[#A04242] hover:bg-[#FDEEEE] cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-sm sm:text-base text-[#2A1C12] mt-2.5 line-clamp-1 leading-snug group-hover:text-[#6E4E37] transition-colors">
          {novel.title}
        </h3>

        {/* Author */}
        <p className="text-[11px] sm:text-xs text-[#827162] mt-0.5 truncate font-normal">
          oleh {novel.author}
        </p>

        {/* Description snippet */}
        <p className="text-[10px] sm:text-[11px] text-[#69584B] leading-relaxed line-clamp-2 mt-1.5 font-normal">
          {novel.description}
        </p>
      </div>

      {/* Subtle indicator bar */}
      <div className="mt-2.5 pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-[10px] text-[#8C7B6E]">
        <span className="font-medium text-[#7E6958]">{novel.genre}</span>
        <span className="group-hover:text-[#6E4E37] font-medium flex items-center gap-1">
          <span>Baca</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
};
