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
import { SupabaseModal } from './components/SupabaseModal';
import { Novel, ReadingStatus, SortField, SortOrder } from './types/novel';
import { loadNovels, saveNovels, resetNovels } from './utils/storage';
import { GENRE_LIST } from './data/defaultNovels';
import { 
  supabase, 
  checkSupabaseConnection, 
  fetchNovels, 
  insertNovel, 
  updateNovel, 
  deleteNovel, 
  mapRowToNovel, 
  SupabaseStatus 
} from './services/supabase';
import { Plus, User, BookOpen, Check, Database, RefreshCw, FileUp } from 'lucide-react';

export default function App() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Supabase Database Status
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>('checking');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Menghubungkan ke Supabase...');
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  // Form Mode for New Novel
  const [formInitialMode, setFormInitialMode] = useState<'upload' | 'manual'>('upload');

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

  // Initialize from Supabase (with automatic fallback to local cache)
  const loadLibrary = async () => {
    setSupabaseStatus('checking');
    try {
      const conn = await checkSupabaseConnection();
      setSupabaseStatus(conn.status);
      setSupabaseMessage(conn.message);

      if (conn.status === 'connected') {
        const result = await fetchNovels();
        if (result.source === 'supabase') {
          setNovels(result.novels);
          saveNovels(result.novels);
        } else {
          const fallback = loadNovels();
          setNovels(fallback);
        }
      } else {
        const fallback = loadNovels();
        setNovels(fallback);
      }
    } catch (err: any) {
      console.error('Error during library init:', err);
      setSupabaseStatus('error');
      setSupabaseMessage('Gagal terhubung ke database cloud Supabase.');
      const fallback = loadNovels();
      setNovels(fallback);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  // Supabase Real-time updates subscription
  useEffect(() => {
    const channel = supabase
      .channel('novels-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'novels' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNovel = mapRowToNovel(payload.new);
            setNovels((prev) => {
              if (prev.some((n) => n.id === newNovel.id)) return prev;
              return [newNovel, ...prev];
            });
            showToast(`Novel baru disinkronkan: "${payload.new.title || ''}"`);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapRowToNovel(payload.new);
            setNovels((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n))
            );
            if (selectedNovel && selectedNovel.id === updated.id) {
              setSelectedNovel(updated);
            }
            if (readingNovel && readingNovel.id === updated.id) {
              setReadingNovel(updated);
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = String(payload.old.id);
            setNovels((prev) => prev.filter((n) => n.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedNovel, readingNovel]);

  // Keep local storage synchronized as offline cache
  useEffect(() => {
    if (isLoaded && novels.length > 0) {
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

  const handleSaveNovel = async (
    novelData: Omit<Novel, 'id' | 'dateAdded'>,
    editId?: string
  ) => {
    if (editId) {
      const existing = novels.find((n) => n.id === editId);
      const updated: Novel = {
        ...(existing || { id: editId, dateAdded: new Date().toISOString().split('T')[0] }),
        ...novelData,
      };

      setNovels((prev) =>
        prev.map((item) => (item.id === editId ? updated : item))
      );
      if (selectedNovel && selectedNovel.id === editId) {
        setSelectedNovel(updated);
      }
      if (readingNovel && readingNovel.id === editId) {
        setReadingNovel(updated);
      }

      // Persist to Supabase if connected
      if (supabaseStatus === 'connected') {
        const res = await updateNovel(updated);
        if (res.success) {
          showToast(`Novel "${novelData.title}" diperbarui di Supabase.`);
        } else {
          showToast(`Novel diperbarui lokal (Supabase: ${res.error || 'belum siap'}).`);
        }
      } else {
        showToast(`Novel "${novelData.title}" diperbarui.`);
      }
    } else {
      const newNovel: Novel = {
        ...novelData,
        id: `novel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        dateAdded: new Date().toISOString().split('T')[0],
      };

      setNovels((prev) => [newNovel, ...prev]);

      // Persist to Supabase if connected
      if (supabaseStatus === 'connected') {
        const res = await insertNovel(newNovel);
        const docInfo = newNovel.fileName ? ' beserta seluruh isi dokumen' : '';
        if (res.success) {
          showToast(`Novel "${newNovel.title}"${docInfo} berhasil disimpan di Supabase!`);
        } else {
          showToast(`Novel disimpan lokal (Supabase: ${res.error || 'belum siap'}).`);
        }
      } else {
        const docInfo = newNovel.fileName ? ' beserta dokumen' : '';
        showToast(`Novel "${newNovel.title}"${docInfo} ditambahkan.`);
      }
    }
  };

  const handleDeleteConfirm = async (novel: Novel) => {
    setNovels((prev) => prev.filter((n) => n.id !== novel.id));
    if (selectedNovel && selectedNovel.id === novel.id) {
      setSelectedNovel(null);
    }
    if (readingNovel && readingNovel.id === novel.id) {
      setReadingNovel(null);
    }
    setNovelToDelete(null);

    // Delete in Supabase if connected
    if (supabaseStatus === 'connected') {
      const res = await deleteNovel(novel.id);
      if (res.success) {
        showToast(`Novel "${novel.title}" dihapus dari Supabase.`);
      } else {
        showToast(`Novel dihapus lokal.`);
      }
    } else {
      showToast(`Novel "${novel.title}" telah dihapus.`);
    }
  };

  const handleUpdateStatus = async (novel: Novel, newStatus: ReadingStatus) => {
    const updated: Novel = {
      ...novel,
      status: newStatus,
      dateCompleted:
        newStatus === 'Selesai'
          ? novel.dateCompleted || new Date().toISOString().split('T')[0]
          : novel.dateCompleted,
    };

    setNovels((prev) =>
      prev.map((n) => (n.id === novel.id ? updated : n))
    );
    if (selectedNovel && selectedNovel.id === novel.id) {
      setSelectedNovel(updated);
    }
    if (readingNovel && readingNovel.id === novel.id) {
      setReadingNovel(updated);
    }

    if (supabaseStatus === 'connected') {
      await updateNovel(updated);
    }
    showToast(`Status: ${newStatus}`);
  };

  const handleUpdateProgress = async (novel: Novel, newChapter: number) => {
    const updated: Novel = {
      ...novel,
      currentChapter: newChapter,
    };

    setNovels((prev) =>
      prev.map((n) => (n.id === novel.id ? updated : n))
    );
    if (selectedNovel && selectedNovel.id === novel.id) {
      setSelectedNovel(updated);
    }
    if (readingNovel && readingNovel.id === novel.id) {
      setReadingNovel(updated);
    }

    if (supabaseStatus === 'connected') {
      await updateNovel(updated);
    }
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
          {/* Top Header Bar: NovelBox + Supabase status pill + Actions */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-serif text-[38px] font-bold text-[#4B2F1D] tracking-tight leading-none">
                NovelBox
              </h1>
              {/* Supabase Connection Status Pill */}
              <div className="mt-1 flex items-center gap-1.5">
                <button
                  onClick={() => setIsSupabaseOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    supabaseStatus === 'connected'
                      ? 'bg-[#E3EED5] text-[#335C1D] border border-[#C6DCB3] hover:bg-[#D7E7C5]'
                      : supabaseStatus === 'table_missing'
                      ? 'bg-[#FFF2DE] text-[#8C5D19] border border-[#F2DEBF] hover:bg-[#FFE7C4]'
                      : supabaseStatus === 'checking'
                      ? 'bg-[#F2ECE3] text-[#715F52] border border-[#E4DBD0]'
                      : 'bg-[#FDE8E8] text-[#9A2D2D] border border-[#F5CACA]'
                  }`}
                  title="Klik untuk konfigurasi dan status database Supabase"
                >
                  <Database className="w-3 h-3 shrink-0" />
                  <span>
                    {supabaseStatus === 'connected'
                      ? 'Supabase Cloud (Sinkron)'
                      : supabaseStatus === 'table_missing'
                      ? 'Setup Supabase SQL'
                      : supabaseStatus === 'checking'
                      ? 'Menghubungkan...'
                      : 'Supabase Offline'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSupabaseOpen(true)}
                title="Status Database Cloud Supabase"
                className="w-11 h-11 rounded-full bg-[#EFE6DB] hover:bg-[#E5D9CC] text-[#634935] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs border border-[#E2D5C6]"
              >
                <Database className="w-5 h-5 stroke-[1.9]" />
              </button>
              <button
                onClick={() => setIsStatsOpen(true)}
                title="Profil & Statistik Koleksi"
                className="w-12 h-12 rounded-full bg-[#CEB8A2] hover:bg-[#C0A892] text-[#553723] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs"
              >
                <User className="w-6 h-6 stroke-[1.9]" />
              </button>
            </div>
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

        {/* Floating Action Buttons in Bottom Right */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
          <button
            onClick={() => {
              setNovelToEdit(null);
              setFormInitialMode('upload');
              setIsAddEditOpen(true);
            }}
            title="Unggah Berkas Novel (.pdf, .docx, .txt, .epub)"
            className="h-13 px-4 rounded-2xl bg-white/95 hover:bg-white active:scale-95 text-[#523A28] flex items-center gap-2 shadow-lg border border-[#E2D4C3] transition-all cursor-pointer text-xs font-semibold backdrop-blur-xs"
          >
            <FileUp className="w-4 h-4 text-[#BA997D]" />
            <span>Unggah File</span>
          </button>

          <button
            onClick={handleOpenAdd}
            title="Tambah Novel Baru"
            className="w-13 h-13 rounded-2xl bg-[#BA997D] hover:bg-[#A88569] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-7 h-7 stroke-[2.4]" />
          </button>
        </div>

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

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        status={supabaseStatus}
        statusMessage={supabaseMessage}
        novels={novels}
        onRefreshConnection={loadLibrary}
        onSeedSuccess={(count) => showToast(`${count} novel berhasil diunggah ke Supabase!`)}
      />

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
        initialMode={formInitialMode}
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
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />
    </div>
  );
}
