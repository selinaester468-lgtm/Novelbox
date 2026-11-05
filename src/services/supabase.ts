import { createClient } from '@supabase/supabase-js';
import { Novel } from '../types/novel';
import { INITIAL_NOVELS } from '../data/defaultNovels';

// Safe env lookup supporting Vite client, SSR, and Node scripts
const metaEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {};

const SUPABASE_URL = 
  metaEnv.VITE_SUPABASE_URL || nodeEnv.VITE_SUPABASE_URL || 'https://vwrymizddjhjvhujxner.supabase.co';
const SUPABASE_ANON_KEY = 
  metaEnv.VITE_SUPABASE_ANON_KEY || nodeEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3cnltaXpkZGpoanZodWp4bmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NzIzNzMsImV4cCI6MjEwOTQ0ODM3M30.PwSZwgwzs-_m4UszUJLHrGHVxtOyr5gSrMXPlG3N6ko';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SQL_SETUP = `-- ==========================================
-- SKRIP SETUP TABEL NOVELBOX DI SUPABASE
-- Buka Dashboard Supabase -> SQL Editor -> New Query
-- Tempel (Paste) skrip ini dan klik "Run"
-- ==========================================

-- 1. Buat tabel 'novels' jika belum ada
create table if not exists public.novels (
  id text primary key,
  title text not null,
  author text not null,
  genre text default 'Drama / Kehidupan',
  status text default 'Sedang Dibaca',
  description text default '',
  cover_url text default '',
  rating numeric default 5.0,
  total_chapters integer default 1,
  current_chapter integer default 1,
  total_pages integer default 100,
  current_page integer default 1,
  favorite_quote text default '',
  notes text default '',
  published_year integer,
  date_added text,
  date_completed text,
  chapters jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.novels enable row level security;

-- 3. Kebijakan akses penuh untuk anonim (Baca, Tambah, Edit, Hapus)
drop policy if exists "Allow all actions for anon" on public.novels;
create policy "Allow all actions for anon" on public.novels
  for all
  using (true)
  with check (true);

-- 4. Aktifkan Realtime Replication untuk tabel novels (aman jika sudah terdaftar)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'novels'
  ) then
    alter publication supabase_realtime add table public.novels;
  end if;
end $$;
`;

export type SupabaseStatus = 'connected' | 'table_missing' | 'error' | 'checking';

// Map database row to client Novel interface (supports both snake_case and camelCase)
export const mapRowToNovel = (row: any): Novel => {
  return {
    id: String(row.id),
    title: row.title || 'Tanpa Judul',
    author: row.author || 'Anonim',
    genre: row.genre || 'Drama / Kehidupan',
    status: row.status || 'Sedang Dibaca',
    description: row.description || '',
    coverUrl: row.cover_url ?? row.coverUrl ?? '',
    rating: Number(row.rating ?? 5.0),
    totalChapters: row.total_chapters ?? row.totalChapters ?? 1,
    currentChapter: row.current_chapter ?? row.currentChapter ?? 1,
    totalPages: row.total_pages ?? row.totalPages ?? 100,
    currentPage: row.current_page ?? row.currentPage ?? 1,
    favoriteQuote: row.favorite_quote ?? row.favoriteQuote ?? '',
    notes: row.notes || '',
    publishedYear: row.published_year ?? row.publishedYear ?? undefined,
    dateAdded: row.date_added ?? row.dateAdded ?? new Date().toISOString().split('T')[0],
    dateCompleted: row.date_completed ?? row.dateCompleted ?? undefined,
    chapters: Array.isArray(row.chapters) ? row.chapters : []
  };
};

// Map client Novel to database row for insert/update
export const mapNovelToRow = (novel: Novel) => {
  return {
    id: novel.id,
    title: novel.title,
    author: novel.author,
    genre: novel.genre,
    status: novel.status,
    description: novel.description || '',
    cover_url: novel.coverUrl || '',
    rating: novel.rating ?? 5.0,
    total_chapters: novel.totalChapters ?? 1,
    current_chapter: novel.currentChapter ?? 1,
    total_pages: novel.totalPages ?? 100,
    current_page: novel.currentPage ?? 1,
    favorite_quote: novel.favoriteQuote || '',
    notes: novel.notes || '',
    published_year: novel.publishedYear || null,
    date_added: novel.dateAdded || new Date().toISOString().split('T')[0],
    date_completed: novel.dateCompleted || null,
    chapters: novel.chapters || []
  };
};

/**
 * Checks whether the Supabase database and the 'novels' table are ready.
 */
export const checkSupabaseConnection = async (): Promise<{
  status: SupabaseStatus;
  message: string;
}> => {
  try {
    const { data, error } = await supabase.from('novels').select('id').limit(1);
    
    if (error) {
      // Check if table missing (PGRST205 / 42P01)
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('relation "public.novels" does not exist')
      ) {
        return {
          status: 'table_missing',
          message: 'Tersambung ke Supabase! Tabel "novels" belum dibuat di SQL Editor.'
        };
      }
      return {
        status: 'error',
        message: `Koneksi Supabase bermasalah: ${error.message}`
      };
    }

    return {
      status: 'connected',
      message: 'Terhubung ke database Supabase secara real-time.'
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: err?.message || 'Gagal menghubungi server Supabase.'
    };
  }
};

/**
 * Fetch all novels from Supabase.
 * If the table exists but is empty, it automatically seeds INITIAL_NOVELS so the user doesn't start with a blank screen.
 */
export const fetchNovels = async (): Promise<{
  novels: Novel[];
  source: 'supabase' | 'fallback';
  status: SupabaseStatus;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('novels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const isTableMissing =
        error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table');
      
      return {
        novels: INITIAL_NOVELS,
        source: 'fallback',
        status: isTableMissing ? 'table_missing' : 'error',
        error: error.message
      };
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapRowToNovel);
      return {
        novels: mapped,
        source: 'supabase',
        status: 'connected'
      };
    }

    // Table is created but empty -> Auto-seed with default library including Laut Bercerita!
    console.log('Tabel novels di Supabase masih kosong. Melakukan auto-seeding koleksi...');
    const rowsToInsert = INITIAL_NOVELS.map(mapNovelToRow);
    const insertRes = await supabase.from('novels').insert(rowsToInsert);
    
    if (!insertRes.error) {
      console.log('Berhasil auto-seed koleksi novel ke Supabase!');
      return {
        novels: INITIAL_NOVELS,
        source: 'supabase',
        status: 'connected'
      };
    } else {
      console.warn('Gagal melakukan auto-seed:', insertRes.error);
      return {
        novels: INITIAL_NOVELS,
        source: 'supabase',
        status: 'connected'
      };
    }
  } catch (err: any) {
    console.error('Exception fetching from Supabase:', err);
    return {
      novels: INITIAL_NOVELS,
      source: 'fallback',
      status: 'error',
      error: err?.message
    };
  }
};

/**
 * Insert a novel into Supabase
 */
export const insertNovel = async (novel: Novel): Promise<{ success: boolean; error?: string }> => {
  try {
    const row = mapNovelToRow(novel);
    const { error } = await supabase.from('novels').insert([row]);
    if (error) {
      console.error('Error inserting novel to Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
};

/**
 * Update a novel in Supabase
 */
export const updateNovel = async (novel: Novel): Promise<{ success: boolean; error?: string }> => {
  try {
    const row = mapNovelToRow(novel);
    const { error } = await supabase
      .from('novels')
      .update(row)
      .eq('id', novel.id);

    if (error) {
      console.error('Error updating novel in Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
};

/**
 * Delete a novel from Supabase
 */
export const deleteNovel = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('novels').delete().eq('id', id);
    if (error) {
      console.error('Error deleting novel from Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
};

/**
 * Bulk seed novels to Supabase (e.g. from local or backup)
 */
export const seedAllNovelsToSupabase = async (novels: Novel[]): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const rows = novels.map(mapNovelToRow);
    const { error } = await supabase.from('novels').upsert(rows, { onConflict: 'id' });
    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    return { success: true, count: rows.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message };
  }
};
