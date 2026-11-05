import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Star, 
  BookOpen, 
  Sparkles, 
  Check, 
  FileText, 
  FileUp, 
  Layers, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { Novel, ReadingStatus, Chapter } from '../types/novel';
import { PRESET_COVERS, GENRE_LIST } from '../data/defaultNovels';
import { parseUploadedBookFile, formatFileSize } from '../utils/fileParser';

interface NovelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novelData: Omit<Novel, 'id' | 'dateAdded'>, editId?: string) => void;
  novelToEdit?: Novel | null;
  initialMode?: 'upload' | 'manual';
}

export const NovelFormModal: React.FC<NovelFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  novelToEdit,
  initialMode = 'upload',
}) => {
  const isEditing = Boolean(novelToEdit);

  // Tab mode: 'upload' (upload file from device) vs 'manual' (type manually)
  const [formMode, setFormMode] = useState<'upload' | 'manual'>(isEditing ? 'manual' : initialMode);

  // File parsing states
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [extractedChapters, setExtractedChapters] = useState<Chapter[]>([]);
  const [showChaptersPreview, setShowChaptersPreview] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Drama / Kehidupan');
  const [customGenre, setCustomGenre] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('Sedang Dibaca');
  const [rating, setRating] = useState(5.0);
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [totalChapters, setTotalChapters] = useState<number | ''>('');
  const [currentChapter, setCurrentChapter] = useState<number | ''>(1);
  const [totalPages, setTotalPages] = useState<number | ''>('');
  const [publishedYear, setPublishedYear] = useState<number | ''>('');
  const [favoriteQuote, setFavoriteQuote] = useState('');
  const [notes, setNotes] = useState('');

  // Cover selection mode: 'preset' | 'url' | 'upload'
  const [coverTab, setCoverTab] = useState<'preset' | 'url' | 'upload'>('preset');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (novelToEdit) {
      setFormMode('manual');
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
      setRating(novelToEdit.rating || 5.0);
      setDescription(novelToEdit.description);
      setCoverUrl(novelToEdit.coverUrl || '');
      setTotalChapters(novelToEdit.totalChapters ?? '');
      setCurrentChapter(novelToEdit.currentChapter ?? 1);
      setTotalPages(novelToEdit.totalPages ?? '');
      setPublishedYear(novelToEdit.publishedYear ?? '');
      setFavoriteQuote(novelToEdit.favoriteQuote || '');
      setNotes(novelToEdit.notes || '');
      setExtractedChapters(novelToEdit.chapters || []);
      if (novelToEdit.fileName) {
        setUploadedFile({
          name: novelToEdit.fileName,
          size: novelToEdit.fileSize || '',
          type: novelToEdit.fileType || ''
        });
      } else {
        setUploadedFile(null);
      }
      setCoverTab(novelToEdit.coverUrl?.startsWith('data:') ? 'upload' : novelToEdit.coverUrl?.includes('/src/assets/images/') ? 'preset' : 'url');
    } else {
      // Reset form for new novel
      setFormMode(initialMode);
      setTitle('');
      setAuthor('');
      setGenre('Drama / Kehidupan');
      setCustomGenre('');
      setStatus('Sedang Dibaca');
      setRating(5.0);
      setDescription('');
      setCoverUrl(PRESET_COVERS[0].url);
      setTotalChapters(1);
      setCurrentChapter(1);
      setTotalPages(120);
      setPublishedYear(new Date().getFullYear());
      setFavoriteQuote('');
      setNotes('');
      setUploadedFile(null);
      setExtractedChapters([]);
      setCoverTab('preset');
    }
    setErrors({});
    setParseError(null);
    setIsParsing(false);
    setShowChaptersPreview(false);
  }, [novelToEdit, isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle Document Upload (PDF, DOCX, TXT, EPUB)
  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const parsed = await parseUploadedBookFile(file);
      
      setTitle(parsed.title);
      setDescription(parsed.description);
      setTotalChapters(parsed.chapters.length);
      setTotalPages(parsed.totalPagesEstimated);
      setExtractedChapters(parsed.chapters);
      setUploadedFile({
        name: parsed.fileName,
        size: parsed.fileSize,
        type: parsed.fileType
      });

      // Suggest preset cover based on genre or default
      if (!coverUrl || coverUrl === PRESET_COVERS[0].url) {
        setCoverUrl(PRESET_COVERS[0].url);
      }

      setNotes(`Berkas asli: ${parsed.fileName} (${parsed.fileSize}) — ${parsed.chapters.length} bab diekstrak.`);

    } catch (err: any) {
      console.error('Error parsing book file:', err);
      setParseError(err.message || 'Gagal mengekstrak isi dokumen. Pastikan berkas tidak rusak.');
    } finally {
      setIsParsing(false);
      // reset input value so re-uploading same file triggers change
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  // Handle Cover Photo Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, cover: 'Ukuran gambar sampul maksimal 5MB' }));
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

    // Use extracted chapters if available, otherwise build chapter structure
    const chaptersToSave: Chapter[] = extractedChapters.length > 0
      ? extractedChapters
      : novelToEdit?.chapters && novelToEdit.chapters.length > 0
      ? novelToEdit.chapters
      : [
          {
            id: `chap-${Date.now()}-1`,
            number: 1,
            title: `Bab 1: Pengantar ${title.trim()}`,
            content: `${description.trim()}\n\n"${favoriteQuote?.trim() || 'Membaca adalah petualangan jiwa tanpa batas.'}"\n\n${notes?.trim() || 'Selamat membaca novel ini di NovelBox.'}`
          }
        ];

    onSave(
      {
        title: title.trim(),
        author: author.trim(),
        genre: finalGenre,
        status,
        rating: Number(rating) || 5.0,
        description: description.trim(),
        coverUrl: coverUrl.trim() || PRESET_COVERS[0].url,
        totalChapters: totalChapters !== '' ? Number(totalChapters) : chaptersToSave.length,
        currentChapter: currentChapter !== '' ? Number(currentChapter) : 1,
        totalPages: totalPages !== '' ? Number(totalPages) : undefined,
        publishedYear: publishedYear !== '' ? Number(publishedYear) : undefined,
        favoriteQuote: favoriteQuote.trim() || undefined,
        notes: notes.trim() || undefined,
        fileName: uploadedFile?.name,
        fileSize: uploadedFile?.size,
        fileType: uploadedFile?.type,
        chapters: chaptersToSave,
        dateCompleted: status === 'Selesai' ? (novelToEdit?.dateCompleted || new Date().toISOString().split('T')[0]) : undefined,
      },
      novelToEdit ? novelToEdit.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-[#FAF8F5] border border-[#E6DDD1] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md px-6 py-4 border-b border-[#EBE3D7] flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ECE4D8] text-[#5C4737] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2E2016]">
                {isEditing ? 'Edit Informasi Novel' : 'Tambah Novel Baru'}
              </h3>
              <p className="text-[11px] text-[#806E61]">
                {isEditing ? 'Perbarui data atau bab novel' : 'Unggah dokumen buku atau masukkan secara manual'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7F6E61] hover:text-[#2E2016] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector (Upload vs Manual) - only for new novels */}
        {!isEditing && (
          <div className="px-6 pt-4">
            <div className="p-1 bg-[#EFE8DD] rounded-2xl flex items-center gap-1 border border-[#E2D7C8]">
              <button
                type="button"
                onClick={() => setFormMode('upload')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formMode === 'upload'
                    ? 'bg-white text-[#4A3222] shadow-xs'
                    : 'text-[#7D6B5D] hover:text-[#4A3222]'
                }`}
              >
                <FileUp className="w-4 h-4 text-[#BA997D]" />
                <span>Unggah Berkas Dokumen (PDF, Word, TXT)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormMode('manual')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formMode === 'manual'
                    ? 'bg-white text-[#4A3222] shadow-xs'
                    : 'text-[#7D6B5D] hover:text-[#4A3222]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Input Manual</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Hidden File Input for Documents */}
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.text,.md,.epub,.json"
            onChange={handleDocumentSelect}
            className="hidden"
          />

          {/* UPLOAD DOCUMENT ZONE (when in upload mode) */}
          {formMode === 'upload' && (
            <div className="space-y-3">
              <div 
                onClick={() => documentInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  uploadedFile 
                    ? 'bg-[#F2F7EC] border-[#A8CCA0]' 
                    : 'bg-[#FDFBF7] hover:bg-[#F7F2E9] border-[#D8C7B4]'
                }`}
              >
                {isParsing ? (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 text-[#6D533E]">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#A8886D]" />
                    <p className="font-semibold text-sm">Sedang Membaca & Mengekstrak Dokumen...</p>
                    <p className="text-xs text-[#8B7767]">Mengekstrak teks, bab cerita, dan struktur buku untuk database</p>
                  </div>
                ) : uploadedFile ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#E0EED4] text-[#36681E] flex items-center justify-center shadow-xs">
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-[#2F531B]">{uploadedFile.name}</p>
                      <p className="text-xs text-[#4F7335]">
                        Ukuran: {uploadedFile.size} • Format: {uploadedFile.type}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#C2DDB4] text-xs font-medium text-[#30591B] mt-1 shadow-2xs">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{extractedChapters.length} Bab Berhasil Diekstrak</span>
                    </div>
                    <p className="text-[11px] text-[#69584B] mt-1 underline underline-offset-2">
                      Klik di sini untuk mengganti berkas dengan dokumen lain
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-13 h-13 rounded-2xl bg-[#EFE8DC] text-[#785C45] flex items-center justify-center shadow-xs">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <p className="font-bold text-sm text-[#382618]">
                      Pilih Berkas Novel dari HP atau Laptop Anda
                    </p>
                    <p className="text-xs text-[#7A6A5E] max-w-sm">
                      Mendukung berkas <strong>.PDF, .DOCX (Word), .TXT, .MD, .EPUB</strong>. Seluruh isi teks dan bab cerita akan otomatis tersimpan ke database.
                    </p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-1.5 rounded-xl bg-[#6E4E37] text-white text-xs font-semibold shadow-xs hover:bg-[#5C3F2B] transition-colors"
                    >
                      Pilih Dokumen
                    </button>
                  </div>
                )}
              </div>

              {parseError && (
                <div className="p-3 bg-[#FDF0ED] border border-[#F5C7BC] rounded-xl text-xs text-[#9E3324] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Extracted Chapters Preview Collapsible */}
              {extractedChapters.length > 0 && (
                <div className="border border-[#E2D7C8] rounded-2xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setShowChaptersPreview(!showChaptersPreview)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-[#544031] hover:bg-[#F9F5EE] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#A8886D]" />
                      <span>Lihat Rincian {extractedChapters.length} Bab Yang Akan Disimpan</span>
                    </div>
                    {showChaptersPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showChaptersPreview && (
                    <div className="p-3 max-h-48 overflow-y-auto space-y-2 border-t border-[#EAE0D3] bg-[#FCFAF7] text-xs">
                      {extractedChapters.map((chap, i) => (
                        <div key={chap.id || i} className="p-2 bg-white rounded-xl border border-[#ECE3D7] space-y-0.5">
                          <p className="font-semibold text-[#3C2B1F]">{chap.title}</p>
                          <p className="text-[11px] text-[#7C6C60] line-clamp-1 italic">
                            {chap.content.slice(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MAIN NOVEL DETAILS SECTION */}
          <div className="space-y-4">
            {/* Title & Author */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#4A3B30] block mb-1">
                  Judul Novel <span className="text-[#A23838]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Bumi, Dilan 1990, Laskar Pelangi..."
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#2E2016] placeholder-[#A49486] focus:outline-none focus:ring-2 focus:ring-[#BA997D] ${
                    errors.title ? 'border-[#C24848]' : 'border-[#DDD2C4]'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-[#C24848] mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A3B30] block mb-1">
                  Nama Penulis <span className="text-[#A23838]">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Tere Liye, Pidi Baiq, Andrea Hirata..."
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#2E2016] placeholder-[#A49486] focus:outline-none focus:ring-2 focus:ring-[#BA997D] ${
                    errors.author ? 'border-[#C24848]' : 'border-[#DDD2C4]'
                  }`}
                />
                {errors.author && <p className="text-[11px] text-[#C24848] mt-1">{errors.author}</p>}
              </div>
            </div>

            {/* Genre & Reading Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#4A3B30] block mb-1">
                  Genre <span className="text-[#A23838]">*</span>
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs sm:text-sm text-[#2E2016] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                >
                  {GENRE_LIST.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                  <option value="Lainnya">+ Genre Baru / Lainnya</option>
                </select>

                {genre === 'Lainnya' && (
                  <input
                    type="text"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    placeholder="Nama genre baru..."
                    className="w-full mt-2 px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs text-[#2E2016] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                  />
                )}
                {errors.genre && <p className="text-[11px] text-[#C24848] mt-1">{errors.genre}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A3B30] block mb-1">
                  Status Bacaan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs sm:text-sm text-[#2E2016] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                >
                  <option value="Ingin Dibaca">Ingin Dibaca (Belum Mulai)</option>
                  <option value="Sedang Dibaca">Sedang Dibaca</option>
                  <option value="Selesai">Selesai Dibaca</option>
                  <option value="Ditunda">Ditunda</option>
                </select>
              </div>
            </div>

            {/* Description / Synopsis */}
            <div>
              <label className="text-xs font-semibold text-[#4A3B30] block mb-1">
                Deskripsi / Sinopsis Singkat <span className="text-[#A23838]">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan ringkasan cerita atau sinopsis..."
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#2E2016] placeholder-[#A49486] focus:outline-none focus:ring-2 focus:ring-[#BA997D] ${
                  errors.description ? 'border-[#C24848]' : 'border-[#DDD2C4]'
                }`}
              />
              {errors.description && <p className="text-[11px] text-[#C24848] mt-1">{errors.description}</p>}
            </div>

            {/* Book Cover Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#4A3B30] block">
                Sampul Novel
              </label>

              {/* Cover tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#EFE8DE] rounded-xl text-xs border border-[#E3D8CB]">
                <button
                  type="button"
                  onClick={() => setCoverTab('preset')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    coverTab === 'preset' ? 'bg-white text-[#453123] shadow-xs' : 'text-[#7D6B5D]'
                  }`}
                >
                  Pilihan Estetik
                </button>
                <button
                  type="button"
                  onClick={() => setCoverTab('upload')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    coverTab === 'upload' ? 'bg-white text-[#453123] shadow-xs' : 'text-[#7D6B5D]'
                  }`}
                >
                  Unggah Gambar
                </button>
                <button
                  type="button"
                  onClick={() => setCoverTab('url')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    coverTab === 'url' ? 'bg-white text-[#453123] shadow-xs' : 'text-[#7D6B5D]'
                  }`}
                >
                  Tautan URL
                </button>
              </div>

              {coverTab === 'preset' && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
                  {PRESET_COVERS.map((preset, index) => {
                    const isSelected = coverUrl === preset.url;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCoverUrl(preset.url)}
                        title={preset.name}
                        className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-[#654734] ring-2 ring-[#BA997D]' : 'border-[#E4D9CC] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#654734]/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-sm" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {coverTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-[#D5C6B5] hover:border-[#654734] rounded-xl p-4 text-center cursor-pointer bg-white transition-colors flex items-center justify-center gap-3"
                  >
                    <Upload className="w-5 h-5 text-[#887465]" />
                    <span className="text-xs text-[#5D4B3E] font-medium">
                      {coverUrl.startsWith('data:') ? 'Ganti Foto Sampul' : 'Pilih Gambar dari Perangkat'}
                    </span>
                  </div>
                  {coverUrl.startsWith('data:') && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={coverUrl} alt="Preview" className="w-12 h-16 object-cover rounded-md border border-[#E0D4C5]" />
                      <span className="text-xs text-[#4F7335] font-medium">Gambar sampul terpasang</span>
                    </div>
                  )}
                </div>
              )}

              {coverTab === 'url' && (
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs text-[#2E2016] placeholder-[#A49486] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                />
              )}
            </div>

            {/* Chapters & Pages Info */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-[#5C4B3E] block mb-1">
                  Jumlah Bab
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalChapters}
                  onChange={(e) => setTotalChapters(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs text-[#2E2016] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#5C4B3E] block mb-1">
                  Total Halaman
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs text-[#2E2016] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#5C4B3E] block mb-1">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#DDD2C4] rounded-xl text-xs text-[#2E2016] focus:outline-none focus:ring-2 focus:ring-[#BA997D]"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#665446] hover:bg-[#EFE7DC] rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#6E4E37] hover:bg-[#5C3F2B] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Novel ke Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
