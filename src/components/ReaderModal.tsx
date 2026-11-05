import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Bookmark, Settings2, 
  BookOpen, Check, Type, Sun, Moon, Coffee, ArrowLeft
} from 'lucide-react';
import { Novel, Chapter, ReadingStatus } from '../types/novel';

interface ReaderModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateChapter: (novel: Novel, chapterNum: number) => void;
  onUpdateStatus: (novel: Novel, status: ReadingStatus) => void;
}

type ReaderTheme = 'cream' | 'sepia' | 'white' | 'dark';
type ReaderFont = 'serif' | 'sans';

export const ReaderModal: React.FC<ReaderModalProps> = ({
  novel,
  isOpen,
  onClose,
  onUpdateChapter,
  onUpdateStatus,
}) => {
  if (!isOpen || !novel) return null;

  // Reading state
  const chapters: Chapter[] = novel.chapters && novel.chapters.length > 0 
    ? novel.chapters 
    : [
        {
          id: 'ch-default',
          number: 1,
          title: `Pengantar & Sinopsis Lengkap: ${novel.title}`,
          content: `${novel.description}\n\n"${novel.favoriteQuote || 'Membaca adalah petualangan jiwa tanpa batas.'}"\n\n${novel.notes || 'Selamat menikmati bacaan Anda di NovelBox. Anda dapat menambahkan bab cerita lengkap melalui menu Edit Novel.'}`
        }
      ];

  const initialChapterIndex = Math.max(
    0,
    chapters.findIndex((c) => c.number === (novel.currentChapter || 1))
  );

  const [currentIdx, setCurrentIdx] = useState(initialChapterIndex >= 0 ? initialChapterIndex : 0);
  const [fontSize, setFontSize] = useState<number>(17); // 14 to 22
  const [theme, setTheme] = useState<ReaderTheme>('cream');
  const [fontFamily, setFontFamily] = useState<ReaderFont>('serif');
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentChapter = chapters[currentIdx] || chapters[0];

  useEffect(() => {
    // Scroll to top of reader container on chapter change
    const readerContainer = document.getElementById('reader-scroll-container');
    if (readerContainer) {
      readerContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIdx]);

  const handleNextChapter = () => {
    if (currentIdx < chapters.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextChapterNum = chapters[nextIdx].number;
      onUpdateChapter(novel, nextChapterNum);
      if (novel.status === 'Ingin Dibaca') {
        onUpdateStatus(novel, 'Sedang Dibaca');
      }
    } else {
      // Reached the end
      if (novel.status !== 'Selesai') {
        onUpdateStatus(novel, 'Selesai');
      }
    }
  };

  const handlePrevChapter = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      const prevChapterNum = chapters[prevIdx].number;
      onUpdateChapter(novel, prevChapterNum);
    }
  };

  const handleSelectChapter = (idx: number) => {
    setCurrentIdx(idx);
    setShowChapterMenu(false);
    const chapterNum = chapters[idx].number;
    onUpdateChapter(novel, chapterNum);
    if (novel.status === 'Ingin Dibaca') {
      onUpdateStatus(novel, 'Sedang Dibaca');
    }
  };

  // Theme styling helpers
  const getThemeStyles = () => {
    switch (theme) {
      case 'sepia':
        return {
          bg: 'bg-[#F5EEDC]',
          text: 'text-[#413323]',
          headerBg: 'bg-[#ECE3CF]/95 border-[#DFD3BB]',
          cardBg: 'bg-[#ECE3CF]',
          subtext: 'text-[#7D6B56]',
          accent: 'text-[#7D5B3A]',
        };
      case 'white':
        return {
          bg: 'bg-[#FFFFFF]',
          text: 'text-[#1E1E1E]',
          headerBg: 'bg-[#FFFFFF]/95 border-[#E5E5E5]',
          cardBg: 'bg-[#F7F7F7]',
          subtext: 'text-[#666666]',
          accent: 'text-[#333333]',
        };
      case 'dark':
        return {
          bg: 'bg-[#1C1814]',
          text: 'text-[#E8E1D7]',
          headerBg: 'bg-[#25201B]/95 border-[#38312B]',
          cardBg: 'bg-[#29241E]',
          subtext: 'text-[#A69B8F]',
          accent: 'text-[#D5B895]',
        };
      case 'cream':
      default:
        return {
          bg: 'bg-[#FAF8F5]',
          text: 'text-[#2D2117]',
          headerBg: 'bg-[#FAF8F5]/95 border-[#ECE4DA]',
          cardBg: 'bg-[#F2ECE3]',
          subtext: 'text-[#7A6A5D]',
          accent: 'text-[#6C503D]',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeStyles.bg} ${themeStyles.text} transition-colors duration-200`}>
      {/* Reader Top Bar (Sticky & Mobile Optimized) */}
      <header className={`sticky top-0 z-20 px-3 sm:px-6 py-3 border-b backdrop-blur-md flex items-center justify-between gap-3 ${themeStyles.headerBg}`}>
        {/* Back button */}
        <button
          onClick={onClose}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${themeStyles.cardBg} hover:opacity-80`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Kembali</span>
        </button>

        {/* Title & Chapter Indicator */}
        <div className="flex-1 min-w-0 text-center px-2">
          <h2 className="font-serif font-bold text-xs sm:text-base truncate">
            {novel.title}
          </h2>
          <button
            onClick={() => setShowChapterMenu(!showChapterMenu)}
            className={`text-[11px] sm:text-xs truncate transition-opacity hover:opacity-80 cursor-pointer underline decoration-dotted ${themeStyles.subtext}`}
          >
            {currentChapter.title} ({currentIdx + 1}/{chapters.length}) ▾
          </button>
        </div>

        {/* Reader Settings & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            title="Tandai Halaman Ini"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isBookmarked ? 'text-[#C58B35]' : themeStyles.subtext
            } hover:bg-black/5`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Pengaturan Tampilan Baca"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${themeStyles.subtext} hover:bg-black/5`}
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${themeStyles.subtext} hover:bg-black/5`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chapter Dropdown Menu */}
      {showChapterMenu && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full max-h-[75vh] overflow-y-auto rounded-2xl p-5 border shadow-2xl ${themeStyles.cardBg} ${themeStyles.text}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-3">
              <h3 className="font-serif font-bold text-sm sm:text-base">
                Daftar Bab: {novel.title}
              </h3>
              <button
                onClick={() => setShowChapterMenu(false)}
                className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    idx === currentIdx
                      ? 'bg-[#755946] text-white font-semibold'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <span className="truncate pr-2">{ch.title}</span>
                  {idx === currentIdx && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reader Settings Drawer/Bar */}
      {showSettings && (
        <div className={`p-4 border-b border-black/10 shadow-xs z-20 ${themeStyles.cardBg}`}>
          <div className="max-w-xl mx-auto space-y-4 text-xs sm:text-sm">
            {/* Font Size Selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-[11px] sm:text-xs">Ukuran Huruf:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                  className="px-2.5 py-1 bg-black/5 hover:bg-black/10 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  A-
                </button>
                <span className="font-mono tabular-nums px-2 text-xs">{fontSize}px</span>
                <button
                  onClick={() => setFontSize((s) => Math.min(23, s + 1))}
                  className="px-2.5 py-1 bg-black/5 hover:bg-black/10 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family Selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-[11px] sm:text-xs">Jenis Huruf:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontFamily('serif')}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors cursor-pointer ${
                    fontFamily === 'serif' ? 'bg-[#755946] text-white' : 'bg-black/5 hover:bg-black/10'
                  }`}
                >
                  Serif Klasik
                </button>
                <button
                  onClick={() => setFontFamily('sans')}
                  className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                    fontFamily === 'sans' ? 'bg-[#755946] text-white' : 'bg-black/5 hover:bg-black/10'
                  }`}
                >
                  Modern Sans
                </button>
              </div>
            </div>

            {/* Reading Theme Palette */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-[11px] sm:text-xs">Tema Membaca:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme('cream')}
                  title="Cream Alami"
                  className={`w-7 h-7 rounded-full bg-[#FAF8F5] border-2 flex items-center justify-center cursor-pointer ${
                    theme === 'cream' ? 'border-[#755946] scale-110' : 'border-[#DDD3C5]'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-[#5A4535]" />
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  title="Sepia Hangat"
                  className={`w-7 h-7 rounded-full bg-[#F5EEDC] border-2 flex items-center justify-center cursor-pointer ${
                    theme === 'sepia' ? 'border-[#755946] scale-110' : 'border-[#DDD3C5]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-[#6B5035]" />
                </button>
                <button
                  onClick={() => setTheme('white')}
                  title="Putih Bersih"
                  className={`w-7 h-7 rounded-full bg-[#FFFFFF] border-2 flex items-center justify-center cursor-pointer ${
                    theme === 'white' ? 'border-[#755946] scale-110' : 'border-[#CCCCCC]'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 text-[#333333]" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  title="Mode Malam"
                  className={`w-7 h-7 rounded-full bg-[#1C1814] border-2 flex items-center justify-center cursor-pointer ${
                    theme === 'dark' ? 'border-[#E8DFD5] scale-110' : 'border-[#443C34]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#E8DFD5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Flow Container (Scrollable) */}
      <div
        id="reader-scroll-container"
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12"
      >
        <article className="max-w-2xl mx-auto space-y-6">
          {/* Chapter Header */}
          <div className="text-center pb-6 border-b border-black/10 space-y-2">
            <span className={`text-xs uppercase tracking-widest font-semibold ${themeStyles.subtext}`}>
              {novel.genre} · {novel.author}
            </span>
            <h1 className={`font-serif font-bold text-2xl sm:text-3xl sm:leading-tight ${themeStyles.text}`}>
              {currentChapter.title}
            </h1>
          </div>

          {/* Chapter Content / Story Text */}
          <div
            className={`leading-relaxed whitespace-pre-line text-justify selection:bg-[#E8D4BE] selection:text-[#2C2118] ${
              fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
          >
            {currentChapter.content}
          </div>

          {/* Chapter Footer / Navigation */}
          <div className="pt-10 pb-16 border-t border-black/10 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevChapter}
                disabled={currentIdx === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentIdx === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : `${themeStyles.cardBg} hover:opacity-80 active:scale-95`
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bab Sebelumnya</span>
              </button>

              <span className={`text-xs font-mono tabular-nums ${themeStyles.subtext}`}>
                {currentIdx + 1} / {chapters.length}
              </span>

              <button
                onClick={handleNextChapter}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-[#755946] text-white hover:bg-[#624938] active:scale-95 shadow-xs`}
              >
                <span>{currentIdx < chapters.length - 1 ? 'Bab Selanjutnya' : 'Selesai Membaca ✓'}</span>
                {currentIdx < chapters.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick quote highlight */}
            {novel.favoriteQuote && (
              <div className={`p-4 rounded-2xl border text-center ${themeStyles.cardBg} border-black/10`}>
                <p className="text-xs italic opacity-85">{novel.favoriteQuote}</p>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Subtle Bottom Reading Progress Bar */}
      <div className="h-1 bg-black/10 w-full shrink-0">
        <div
          className="h-full bg-[#755946] transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / chapters.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
