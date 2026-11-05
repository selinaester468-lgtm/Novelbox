import { Novel } from '../types/novel';
import { INITIAL_NOVELS } from '../data/defaultNovels';

const STORAGE_KEY = 'novelbox_library_v5';

export const loadNovels = (): Novel[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check if v1 existed, otherwise load full new trending library
      saveNovels(INITIAL_NOVELS);
      return INITIAL_NOVELS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with INITIAL_NOVELS if chapters are missing
      const hasChapters = parsed.some((n: Novel) => n.chapters && n.chapters.length > 0);
      if (!hasChapters) {
        saveNovels(INITIAL_NOVELS);
        return INITIAL_NOVELS;
      }
      return parsed;
    }
    return INITIAL_NOVELS;
  } catch (error) {
    console.error('Error loading novels from localStorage:', error);
    return INITIAL_NOVELS;
  }
};

export const saveNovels = (novels: Novel[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novels));
  } catch (error) {
    console.error('Error saving novels to localStorage:', error);
  }
};

export const resetNovels = (): Novel[] => {
  saveNovels(INITIAL_NOVELS);
  return INITIAL_NOVELS;
};

export const calculateStats = (novels: Novel[]) => {
  const total = novels.length;
  const reading = novels.filter((n) => n.status === 'Sedang Dibaca').length;
  const finished = novels.filter((n) => n.status === 'Selesai').length;
  const wantToRead = novels.filter((n) => n.status === 'Ingin Dibaca').length;
  const onHold = novels.filter((n) => n.status === 'Ditunda').length;
  
  const ratedNovels = novels.filter((n) => n.rating && n.rating > 0);
  const avgRating = ratedNovels.length > 0
    ? (ratedNovels.reduce((acc, curr) => acc + curr.rating, 0) / ratedNovels.length).toFixed(1)
    : '0.0';

  const totalChaptersRead = novels.reduce((acc, curr) => acc + (curr.currentChapter || 0), 0);

  return {
    total,
    reading,
    finished,
    wantToRead,
    onHold,
    avgRating,
    totalChaptersRead
  };
};
