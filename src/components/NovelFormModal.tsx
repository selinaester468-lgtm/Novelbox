import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Star, BookOpen, Sparkles, Check } from 'lucide-react';
import { Novel, ReadingStatus } from '../types/novel';
import { PRESET_COVERS, GENRE_LIST } from '../data/defaultNovels';

interface NovelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novelData: Omit<Novel, 'id' | 'dateAdded'>, editId?: string) => void;
  novelToEdit?: Novel | null;
}

export const NovelFormModal: React.FC<NovelFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  novelToEdit,
}) => {
  const isEditing = Boolean(novelToEdit);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Romance');
  const [customGenre, setCustomGenre] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('Ingin Dibaca');
  const [rating, setRating] = useState(4.5);
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [totalChapters, setTotalChapters] = useState<number | ''>('');
  const [currentChapter, setCurrentChapter] = useState<number | ''>('');
  const [totalPages, setTotalPages] = useState<number | ''>('');
  const [publishedYear, setPublishedYear] = useState<number | ''>('');
  const [favoriteQuote, setFavoriteQuote] = useState('');
  const [notes, setNotes] = useState('');

  // Cover selection mode: 'preset' | 'url' | 'upload'
  const [coverTab, setCoverTab] = useState<'preset' | 'url' | 'upload'>('preset');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (novelToEdit) {
      setTitle(novelToEdit.title);
      setAuthor(novelToEdit.author);
      if (GENRE_LIST.includes(novelToEdit.genre)) {
        setGenre(novelToEdit.genre);
        setCustomGenre('');
      } else {
        setGenre('Lainnya');
        setCustomGenre(novelToEdit.genre);
      }
      setStatus(novelToEdit.status);
      setRating(novelToEdit.rating || 0);
      setDescription(novelToEdit.description);
      setCoverUrl(novelToEdit.coverUrl || '');
      setTotalChapters(novelToEdit.totalChapters ?? '');
      setCurrentChapter(novelToEdit.currentChapter ?? '');
      setTotalPages(novelToEdit.totalPages ?? '');
      setPublishedYear(novelToEdit.publishedYear ?? '');
      setFavoriteQuote(novelToEdit.favoriteQuote || '');
      setNotes(novelToEdit.notes || '');
      setCoverTab(novelToEdit.coverUrl?.startsWith('data:') ? 'upload' : novelToEdit.coverUrl?.includes('/src/assets/images/') ? 'preset' : 'url');
    } else {
      // Reset form
      setTitle('');
      setAuthor('');
      setGenre('Romance');
      setCustomGenre('');
      setStatus('Ingin Dibaca');
      setRating(4.5);
      setDescription('');
      setCoverUrl(PRESET_COVERS[0].url);
      setTotalChapters(30);
      setCurrentChapter(0);
      setTotalPages('');
      setPublishedYear(new Date().getFullYear());
      setFavoriteQuote('');
      setNotes('');
      setCoverTab('preset');
    }
    setErrors({});
  }, [novelToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, cover: 'Ukuran foto maksimal 4MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result as string);
        setErrors((prev) => ({ ...prev, cover: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Judul novel wajib diisi';
    if (!author.trim()) newErrors.author = 'Nama penulis wajib diisi';
    if (!description.trim()) newErrors.description = 'Deskripsi atau sinopsis singkat wajib diisi';
    if (genre === 'Lainnya' && !customGenre.trim()) newErrors.genre = 'Tuliskan nama genre';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalGenre = genre === 'Lainnya' ? customGenre.trim() : genre;

    onSave(
      {
        title: title.trim(),
        author: author.trim(),
        genre: finalGenre,
        status,
        rating: Number(rating) || 0,
        description: description.trim(),
        coverUrl: coverUrl.trim() || PRESET_COVERS[0].url,
        totalChapters: totalChapters !== '' ? Number(totalChapters) : undefined,
        currentChapter: currentChapter !== '' ? Number(currentChapter) : 0,
        totalPages: totalPages !== '' ? Number(totalPages) : undefined,
        publishedYear: publishedYear !== '' ? Number(publishedYear) : undefined,
        favoriteQuote: favoriteQuote.trim() || undefined,
        chapters: novelToEdit?.chapters && novelToEdit.chapters.length > 0 
          ? novelToEdit.chapters 
          : [
              {
                id: `ch-${Date.now()}-1`,
                number: 1,
                title: `Bab 1: Awal Mula ${title.trim()}`,
                content: `${description.trim()}\n\n"${favoriteQuote?.trim() || 'Membaca adalah petualangan jiwa tanpa batas.'}"\n\n${notes?.trim() || 'Selamat membaca novel ini di NovelBox.'}`
              }
            ],
        dateCompleted: status === 'Selesai' ? (novelToEdit?.dateCompleted || new Date().toISOString().split('T')[0]) : undefined,
      },
      novelToEdit ? novelToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-[#FAF8F5] border border-[#E6DDD1] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md px-6 py-4 border-b border-[#EBE3D7] flex items-center justify-between z-10">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2E2016]">
              {isEditing ? 'Edit Koleksi Novel' : 'Tambah Novel Baru'}
            </h2>
            <p className="text-xs text-[#7F6E60]">
              {isEditing
                ? 'Perbarui data dan catatan progres novel ini'
                : 'Lengkapi rincian novel untuk menambahkan ke koleksi'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7F6E61] hover:text-[#2E2016] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1.5">
                Judul Novel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="misal: Cantik Itu Luka"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-[#2E2016] outline-none transition-all ${
                  errors.title ? 'border-red-400 ring-1 ring-red-400' : 'border-[#E4DBD0] focus:border-[#7A5F4B]'
                }`}
              />
              {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1.5">
                Nama Penulis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="misal: Eka Kurniawan"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-[#2E2016] outline-none transition-all ${
                  errors.author ? 'border-red-400 ring-1 ring-red-400' : 'border-[#E4DBD0] focus:border-[#7A5F4B]'
                }`}
              />
              {errors.author && <p className="text-[11px] text-red-500 mt-1">{errors.author}</p>}
            </div>
          </div>

          {/* Genre and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1.5">
                Kategori Genre <span className="text-red-500">*</span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E4DBD0] focus:border-[#7A5F4B] rounded-xl text-sm text-[#2E2016] outline-none cursor-pointer"
              >
                {GENRE_LIST.filter((g) => g !== 'Semua').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="Lainnya">+ Genre Kustom Lainnya...</option>
              </select>
              {genre === 'Lainnya' && (
                <input
                  type="text"
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  placeholder="Ketik nama genre..."
                  className="mt-2 w-full px-3.5 py-2 bg-white border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1.5">
                Status Bacaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E4DBD0] focus:border-[#7A5F4B] rounded-xl text-sm text-[#2E2016] outline-none cursor-pointer"
              >
                <option value="Ingin Dibaca">Ingin Dibaca</option>
                <option value="Sedang Dibaca">Sedang Dibaca</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditunda">Ditunda</option>
              </select>
            </div>
          </div>

          {/* Cover Selector Section */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#EAE1D6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#574639]">
                Sampul Novel (Cover)
              </label>
              {/* Cover source tabs */}
              <div className="flex items-center gap-1 bg-[#F4EFEA] p-0.5 rounded-lg border border-[#E8DFD5] text-xs">
                <button
                  type="button"
                  onClick={() => setCoverTab('preset')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    coverTab === 'preset' ? 'bg-white text-[#2C2017] shadow-xs font-medium' : 'text-[#7D6D61]'
                  }`}
                >
                  Pilihan Estetis
                </button>
                <button
                  type="button"
                  onClick={() => setCoverTab('url')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    coverTab === 'url' ? 'bg-white text-[#2C2017] shadow-xs font-medium' : 'text-[#7D6D61]'
                  }`}
                >
                  Link URL
                </button>
                <button
                  type="button"
                  onClick={() => setCoverTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    coverTab === 'upload' ? 'bg-white text-[#2C2017] shadow-xs font-medium' : 'text-[#7D6D61]'
                  }`}
                >
                  Unggah Foto
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            {coverTab === 'preset' && (
              <div>
                <p className="text-[11px] text-[#867568] mb-2">
                  Pilih salah satu sampul estetis bernuansa cream & pastel brown:
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                  {PRESET_COVERS.map((preset) => {
                    const isSelected = coverUrl === preset.url;
                    return (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => setCoverUrl(preset.url)}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-[#7E5E49] ring-2 ring-[#7E5E49]/30 scale-102'
                            : 'border-[#E4DBD0] hover:border-[#BAA899] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#7E5E49]/20 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-[#7E5E49] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* URL Input */}
            {coverTab === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none focus:border-[#7A5F4B]"
                />
                <p className="text-[11px] text-[#88786B]">
                  Masukkan tautan gambar sampul novel dari internet.
                </p>
              </div>
            )}

            {/* File Upload */}
            {coverTab === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-[#DDCFC0] hover:border-[#A68F7B] rounded-xl flex flex-col items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#F5EFE8] transition-colors cursor-pointer text-[#6D5A4D]"
                >
                  <Upload className="w-5 h-5 text-[#887160]" />
                  <span className="text-xs font-medium">Klik untuk memilih gambar dari HP/Laptop</span>
                  <span className="text-[10px] text-[#9A897C]">JPG, PNG, atau WEBP (Maksimal 4MB)</span>
                </button>
              </div>
            )}

            {/* Current Cover Preview */}
            {coverUrl && (
              <div className="flex items-center gap-3 pt-2 border-t border-[#F1EBE3]">
                <div className="w-10 h-14 rounded-md overflow-hidden bg-[#EAE2D7] shrink-0 border border-[#D5C7B7]">
                  <img
                    src={coverUrl}
                    alt="Preview sampul"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-[#7A6A5E]">
                  <span className="font-semibold text-[#3F3025]">Sampul terpilih</span>
                  <p className="text-[11px] text-[#928275] truncate max-w-xs">{coverUrl}</p>
                </div>
              </div>
            )}
          </div>

          {/* Reading Tracker / Chapters / Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1">
                Bab Terakhir
              </label>
              <input
                type="number"
                min="0"
                value={currentChapter}
                onChange={(e) => setCurrentChapter(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-white border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1">
                Total Bab
              </label>
              <input
                type="number"
                min="1"
                value={totalChapters}
                onChange={(e) => setTotalChapters(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="misal: 35"
                className="w-full px-3 py-2 bg-white border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1">
                Total Halaman
              </label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="misal: 380"
                className="w-full px-3 py-2 bg-white border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#574639] mb-1">
                Tahun Terbit
              </label>
              <input
                type="number"
                min="1800"
                max="2099"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2024"
                className="w-full px-3 py-2 bg-white border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none"
              />
            </div>
          </div>

          {/* Rating Stars Input */}
          <div>
            <label className="block text-xs font-semibold text-[#574639] mb-1.5">
              Rating Novel ({rating ? rating.toFixed(1) : '0'} / 5.0)
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-115 transition-transform text-[#B58632] cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      rating >= star
                        ? 'fill-current'
                        : rating >= star - 0.5
                        ? 'fill-current opacity-60'
                        : 'stroke-current fill-none opacity-30'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-[#827163] ml-2">
                {rating === 5
                  ? 'Istimewa / Masterpiece'
                  : rating >= 4
                  ? 'Sangat Direkomendasikan'
                  : rating >= 3
                  ? 'Bagus'
                  : 'Cukup'}
              </span>
            </div>
          </div>

          {/* Description / Synopsis */}
          <div>
            <label className="block text-xs font-semibold text-[#574639] mb-1.5">
              Sinopsis / Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan gambaran cerita novel, tema, atau pesan utama..."
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#2E2016] outline-none leading-relaxed ${
                errors.description ? 'border-red-400 ring-1 ring-red-400' : 'border-[#E4DBD0] focus:border-[#7A5F4B]'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Favorite Quote (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#574639] mb-1">
              Kutipan Favorit (Opsional)
            </label>
            <input
              type="text"
              value={favoriteQuote}
              onChange={(e) => setFavoriteQuote(e.target.value)}
              placeholder='"Kutipan berkesan dari novel ini..."'
              className="w-full px-3.5 py-2.5 bg-white border border-[#E4DBD0] rounded-xl text-xs sm:text-sm text-[#2E2016] italic outline-none focus:border-[#7A5F4B]"
            />
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#574639] mb-1">
              Catatan Pribadi / Ulasan (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kesan pertama, bab favorit, atau rekomendasi..."
              className="w-full px-3.5 py-2 bg-white border border-[#E4DBD0] rounded-xl text-xs text-[#2E2016] outline-none focus:border-[#7A5F4B]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6B5A4D] hover:bg-[#EFE8DE] rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#755946] hover:bg-[#634A39] active:bg-[#523C2D] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah ke Koleksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
