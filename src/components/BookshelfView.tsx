import React, { useState } from 'react';
import { BookOpen, Star, Clock, CheckCircle2, BookMarked, Edit3, Trash2 } from 'lucide-react';
import { Novel, ReadingStatus } from '../types/novel';

interface BookshelfViewProps {
  novels: Novel[];
  onSelect: (novel: Novel) => void;
  onRead: (novel: Novel) => void;
  onEdit: (novel: Novel) => void;
  onDelete: (novel: Novel) => void;
  onUpdateStatus: (novel: Novel, status: ReadingStatus) => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  novels,
  onSelect,
  onRead,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  // Group novels in rows of 4 for desktop shelves
  const chunkSize = 4;
  const shelves: Novel[][] = [];
  for (let i = 0; i < novels.length; i += chunkSize) {
    shelves.push(novels.slice(i, i + chunkSize));
  }

  if (novels.length === 0) {
    return (
      <div className="text-center py-16 bg-[#FAF7F2] rounded-2xl border border-[#EBE4DA] my-4">
        <BookOpen className="w-12 h-12 text-[#9A887A] mx-auto mb-3 opacity-60" />
        <h3 className="font-serif text-lg font-semibold text-[#3C2D22]">
          Rak Buku Masih Kosong
        </h3>
        <p className="text-sm text-[#7F6F62] max-w-sm mx-auto mt-1">
          Tidak ada novel yang cocok dengan kriteria pencarian atau filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-16 py-4">
      {shelves.map((shelfNovels, shelfIndex) => (
        <div key={shelfIndex} className="relative">
          {/* Books on the shelf */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 items-end px-3 sm:px-6">
            {shelfNovels.map((novel) => {
              const progressPercent =
                novel.totalChapters && novel.totalChapters > 0
                  ? Math.min(100, Math.round(((novel.currentChapter || 0) / novel.totalChapters) * 100))
                  : novel.totalPages && novel.totalPages > 0
                  ? Math.min(100, Math.round(((novel.currentPage || 0) / novel.totalPages) * 100))
                  : 0;

              return (
                <div
                  key={novel.id}
                  className="group relative flex flex-col items-center cursor-pointer"
                  onClick={() => onSelect(novel)}
                >
                  {/* Book 3D spine and cover effect */}
                  <div className="relative w-full max-w-[170px] sm:max-w-[190px] aspect-[3/4.2] rounded-r-md rounded-l-xs overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2.5 origin-bottom bg-[#F1ECE4]">
                    {/* Spine shading line on left */}
                    <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/25 via-white/10 to-transparent z-10 pointer-events-none" />

                    {novel.coverUrl ? (
                      <img
                        src={novel.coverUrl}
                        alt={`Sampul ${novel.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image and fall back to stylized text cover
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* Book spine text & fallback */}
                    <div className="w-full h-full p-3.5 bg-gradient-to-b from-[#F3EFE9] via-[#E8DFD3] to-[#DECFC0] flex flex-col justify-between absolute inset-0 -z-1">
                      <div className="text-[10px] text-[#867465] uppercase font-bold tracking-wider truncate">
                        {novel.genre}
                      </div>
                      <div className="space-y-1 my-auto">
                        <p className="font-serif font-bold text-sm text-[#2E2015] leading-tight line-clamp-3">
                          {novel.title}
                        </p>
                        <p className="text-[11px] text-[#695648] italic line-clamp-1">{novel.author}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#7A695B]">
                        <span>★ {novel.rating ? novel.rating.toFixed(1) : '-'}</span>
                        <span>{novel.status}</span>
                      </div>
                    </div>

                    {/* Status ribbon badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#2C2118]/80 text-[#FAF6F0] backdrop-blur-xs">
                        {novel.status === 'Sedang Dibaca' ? 'Dibaca' : novel.status}
                      </span>
                    </div>

                    {/* Hover Quick Read Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRead(novel);
                        }}
                        className="px-3 py-1.5 bg-[#FAF8F5] text-[#2F2117] hover:bg-[#755946] hover:text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Baca</span>
                      </button>
                    </div>

                    {/* Progress overlay at bottom */}
                    {novel.status === 'Sedang Dibaca' && progressPercent > 0 && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-black/30 z-10">
                        <div
                          className="h-full bg-[#E5B564] transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Book title and author label under book on shelf */}
                  <div className="text-center mt-2.5 max-w-[180px] w-full px-1">
                    <p className="font-serif font-semibold text-xs sm:text-sm text-[#2F2218] truncate group-hover:text-[#7C5D46] transition-colors">
                      {novel.title}
                    </p>
                    <p className="text-[11px] text-[#7C6C60] truncate">{novel.author}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wooden Shelf Ledge */}
          <div className="mt-2 relative">
            {/* Shelf top surface */}
            <div className="h-4 bg-gradient-to-r from-[#D6C5B2] via-[#E2D4C3] to-[#D6C5B2] rounded-t-sm border-t border-[#BAA692] shadow-xs" />
            {/* Shelf front edge with wood tone */}
            <div className="h-4 bg-gradient-to-b from-[#B8A38E] to-[#98826D] rounded-b-md shadow-md flex items-center justify-between px-6">
              <div className="h-[1px] w-full bg-white/20" />
            </div>
            {/* Soft shelf drop shadow */}
            <div className="h-3 bg-gradient-to-b from-black/15 to-transparent blur-xs pointer-events-none" />
          </div>
        </div>
      ))}
    </div>
  );
};
