import React, { useState, useEffect, useMemo } from 'react';
import { StatsBanner } from './components/StatsBanner';
import { SearchInput, FilterChips } from './components/FilterBar';
import { NovelCard } from './components/NovelCard';
import { NovelDetailModal } from './components/NovelDetailModal';
import { NovelFormModal } from './components/NovelFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { BackupModal } from './components/BackupModal';
import { StatsModal } from './components/StatsModal';
import { ReaderModal } from './components/ReaderModal';
import { Novel, ReadingStatus, ViewMode, SortField, SortOrder } from './types/novel';
import { loadNovels, saveNovels, resetNovels } from './utils/storage';
import { GENRE_LIST } from './data/defaultNovels';
import { Plus, User, BookOpen, Check } from 'lucide-react';

export default function App() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Modals & Reader
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [readingNovel, setReadingNovel] = useState<Novel | null>(null);
  const [novelToEdit, setNovelToEdit] = useState<Novel | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [novelToDelete, setNovelToDelete] = useState<Novel | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Initialize from storage
  useEffect(() => {
    const loaded = loadNovels();
    setNovels(loaded);
    setIsLoaded(true);
  }, []);

  // Sync to storage
  useEffect(() => {
    if (isLoaded) {
      saveNovels(novels);
    }
  }, [novels, isLoaded]);

  // Dynamic Genres list
  const availableGenres = useMemo(() => {
    const customGenres = novels.map((n) => n.genre);
    return Array.from(new Set([...GENRE_LIST, ...customGenres]));
  }, [novels]);

  // Filter and Sort Novels
  const filteredNovels = useMemo(() => {
    let result = [...novels];

    // Search query filter (title, author, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q) ||
          n.genre.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
      );
    }

    // Genre filter
    if (selectedGenre !== 'Semua') {
      result = result.filter((n) => n.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Status filter
    if (selectedStatus !== 'Semua') {
      result = result.filter((n) => n.status === selectedStatus);
    }

    return result;
  }, [novels, searchQuery, selectedGenre, selectedStatus]);

  // Handlers
  const handleOpenAdd = () => {
    setNovelToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (novel: Novel) => {
    setNovelToEdit(novel);
    setIsAddEditOpen(true);
  };

  const handleSaveNovel = (
    novelData: Omit<Novel, 'id' | 'dateAdded'>,
    editId?: string
  ) => {
    if (editId) {
      setNovels((prev) =>
        prev.map((item) => {
          if (item.id === editId) {
            const updated = {
              ...item,
              ...novelData,
            };
            if (selectedNovel && selectedNovel.id === editId) {
              setSelectedNovel(updated);
            }
            if (readingNovel && readingNovel.id === editId) {
              setReadingNovel(updated);
            }
            return updated;
          }
          return item;
        })
      );
      showToast(`Novel "${novelData.title}" diperbarui.`);
    } else {
      const newNovel: Novel = {
        ...novelData,
        id: `novel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setNovels((prev) => [newNovel, ...prev]);
      showToast(`Novel "${newNovel.title}" ditambahkan.`);
    }
  };

  const handleDeleteConfirm = (novel: Novel) => {
    setNovels((prev) => prev.filter((n) => n.id !== novel.id));
    if (selectedNovel && selectedNovel.id === novel.id) {
      setSelectedNovel(null);
    }
    if (readingNovel && readingNovel.id === novel.id) {
      setReadingNovel(null);
    }
    setNovelToDelete(null);
    showToast(`Novel "${novel.title}" telah dihapus.`);
  };

  const handleUpdateStatus = (novel: Novel, newStatus: ReadingStatus) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === novel.id) {
          const updated: Novel = {
            ...n,
            status: newStatus,
            dateCompleted:
              newStatus === 'Selesai'
                ? n.dateCompleted || new Date().toISOString().split('T')[0]
                : n.dateCompleted,
          };
          if (selectedNovel && selectedNovel.id === novel.id) {
            setSelectedNovel(updated);
          }
          if (readingNovel && readingNovel.id === novel.id) {
            setReadingNovel(updated);
          }
          return updated;
        }
        return n;
      })
    );
    showToast(`Status: ${newStatus}`);
  };

  const handleUpdateProgress = (novel: Novel, newChapter: number) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === novel.id) {
          const updated: Novel = {
            ...n,
            currentChapter: newChapter,
          };
          if (selectedNovel && selectedNovel.id === novel.id) {
            setSelectedNovel(updated);
          }
          if (readingNovel && readingNovel.id === novel.id) {
            setReadingNovel(updated);
          }
          return updated;
        }
        return n;
      })
    );
  };

  const handleImportNovels = (imported: Novel[]) => {
    setNovels(imported);
    setIsBackupOpen(false);
    showToast(`Berhasil mengimpor ${imported.length} novel!`);
  };

  const handleResetNovels = () => {
    const res = resetNovels();
    setNovels(res);
    setIsBackupOpen(false);
    showToast('Perpustakaan diatur ulang ke data awal.');
  };

  return (
    <div className="min-h-screen bg-[#F0EAE1] sm:py-6 flex justify-center items-start text-[#2C1D13] selection:bg-[#E5D2BF]">
      {/* Mobile App Canvas Container (Matches Reference Screenshot) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[920px] bg-[#F7F2EB] sm:rounded-[40px] shadow-2xl border border-[#E9DFD3] relative flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="px-5 pt-8 pb-28 flex-1 overflow-y-auto">
          {/* Top Header Bar: NovelBox + User Avatar (Exact Reference Match) */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-[40px] font-bold text-[#4B2F1D] tracking-tight leading-none">
              NovelBox
            </h1>
            <button
              onClick={() => setIsStatsOpen(true)}
              title="Profil & Statistik Koleksi"
              className="w-12 h-12 rounded-full bg-[#CEB8A2] hover:bg-[#C0A892] text-[#553723] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs"
            >
              <User className="w-6 h-6 stroke-[1.9]" />
            </button>
          </div>

          {/* Search Bar Input (Exact Reference Match) */}
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* 3-Column Stats Card: Koleksi 24 | Selesai / Sedang Dibaca 12 | Belum 7 */}
          <StatsBanner
            novels={novels}
            activeStatus={selectedStatus}
            onFilterStatus={(st) => setSelectedStatus(st)}
          />

          {/* Filter Chips Bar (Exact Reference Match) */}
          <FilterChips
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Novel Grid (2 Columns Exact Match) */}
          {filteredNovels.length === 0 ? (
            <div className="text-center py-12 bg-white/70 rounded-2xl border border-[#EBE3D7] my-4 p-5">
              <BookOpen className="w-10 h-10 text-[#8C7665] mx-auto mb-2 opacity-60" />
              <p className="font-serif font-bold text-[#35251A] text-base">
                Tidak Ada Novel Ditemukan
              </p>
              <p className="text-xs text-[#7F6E61] mt-1">
                Coba sesuaikan kata kunci pencarian atau filter genre Anda.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('Semua');
                  setSelectedStatus('Semua');
                }}
                className="mt-3 px-3.5 py-1.5 text-xs font-medium text-[#655243] bg-white border border-[#DDD2C4] rounded-xl hover:bg-[#F5EFE7] cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mt-2">
              {filteredNovels.map((novel) => (
                <NovelCard
                  key={novel.id}
                  novel={novel}
                  onSelect={(n) => setSelectedNovel(n)}
                  onRead={(n) => setReadingNovel(n)}
                  onEdit={handleOpenEdit}
                  onDelete={(n) => setNovelToDelete(n)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) '+' in Bottom Right (Exact Reference Match) */}
        <button
          onClick={handleOpenAdd}
          title="Tambah Novel Baru"
          className="absolute bottom-6 right-6 z-30 w-13 h-13 rounded-2xl bg-[#BA997D] hover:bg-[#A88569] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-7 h-7 stroke-[2.4]" />
        </button>

        {/* Subtle Bottom Bar with Data Tools */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#F7F2EB] to-transparent pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 bg-[#35251A] text-[#FAF8F5] px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm flex items-center gap-2 border border-[#4D3929] animate-fade-in">
          <Check className="w-4 h-4 text-[#CBB296] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & In-App Reader */}
      <NovelDetailModal
        novel={selectedNovel}
        onClose={() => setSelectedNovel(null)}
        onRead={(n) => setReadingNovel(n)}
        onEdit={handleOpenEdit}
        onDelete={(n) => setNovelToDelete(n)}
        onUpdateProgress={handleUpdateProgress}
        onUpdateStatus={handleUpdateStatus}
      />

      <ReaderModal
        novel={readingNovel}
        isOpen={Boolean(readingNovel)}
        onClose={() => setReadingNovel(null)}
        onUpdateChapter={handleUpdateProgress}
        onUpdateStatus={handleUpdateStatus}
      />

      <NovelFormModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveNovel}
        novelToEdit={novelToEdit}
      />

      <DeleteConfirmModal
        novel={novelToDelete}
        onClose={() => setNovelToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        novels={novels}
        onImport={handleImportNovels}
        onReset={handleResetNovels}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        novels={novels}
      />
    </div>
  );
}
