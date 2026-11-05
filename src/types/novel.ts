export type ReadingStatus = 'Ingin Dibaca' | 'Sedang Dibaca' | 'Selesai' | 'Ditunda';

export type Genre = 
  | 'Semua'
  | 'Romance'
  | 'Fantasy'
  | 'Horor / Thriller'
  | 'Drama / Kehidupan'
  | 'Komedi / Ringan';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  description: string;
  coverUrl: string;
  rating: number; // 1 to 5
  totalChapters?: number;
  currentChapter?: number;
  totalPages?: number;
  currentPage?: number;
  favoriteQuote?: string;
  notes?: string;
  publishedYear?: number;
  dateAdded: string; // ISO date string
  dateCompleted?: string;
  chapters?: Chapter[];
}

export type ViewMode = 'grid' | 'shelf' | 'list';

export type SortField = 'dateAdded' | 'title' | 'author' | 'rating' | 'progress';
export type SortOrder = 'asc' | 'desc';
