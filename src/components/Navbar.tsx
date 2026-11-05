import React from 'react';
import { BookOpen, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ViewMode } from '../types/novel';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenStatsModal: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  totalNovels: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenBackupModal,
  onOpenStatsModal,
  viewMode,
  setViewMode,
  totalNovels,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EBE4DA] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#EBE3D7] border border-[#DDD3C5] flex items-center justify-center text-[#5A4535] shadow-xs">
              <BookOpen className="w-5 h-5 stroke-[1.8]" />
            </div>
            <a href="#" className="font-serif text-2xl font-bold tracking-tight text-[#33261C] whitespace-nowrap">
              NovelBox
            </a>
          </div>

          {/* Zone 2: 4-5 single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6C5B4F]">
            <button
              onClick={() => setViewMode('grid')}
              className={`hover:text-[#2E2218] transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'grid' ? 'text-[#2E2218] font-semibold' : ''
              }`}
            >
              Katalog Novel
            </button>
            <button
              onClick={() => setViewMode('shelf')}
              className={`hover:text-[#2E2218] transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'shelf' ? 'text-[#2E2218] font-semibold' : ''
              }`}
            >
              Rak Buku Digital
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`hover:text-[#2E2218] transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'list' ? 'text-[#2E2218] font-semibold' : ''
              }`}
            >
              Daftar Ringkas
            </button>
            <button
              onClick={onOpenStatsModal}
              className="hover:text-[#2E2218] transition-colors whitespace-nowrap cursor-pointer"
            >
              Statistik Bacaan
            </button>
            <button
              onClick={onOpenBackupModal}
              className="hover:text-[#2E2218] transition-colors whitespace-nowrap cursor-pointer"
            >
              Cadangan Data
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FAF8F5] bg-[#755946] hover:bg-[#634A39] active:bg-[#523C2D] rounded-xl shadow-xs transition-all duration-150 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>Tambah Novel</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
