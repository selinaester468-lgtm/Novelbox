import * as mammoth from 'mammoth';
import { Chapter } from '../types/novel';

// Type for parsed file result
export interface ParsedBookDocument {
  title: string;
  author: string;
  description: string;
  fullText: string;
  chapters: Chapter[];
  fileName: string;
  fileSize: string;
  fileType: string;
  totalPagesEstimated: number;
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Clean filename to book title
 */
export const cleanFileNameToTitle = (fileName: string): string => {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  return withoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Split raw document text into readable chapters
 */
export const splitTextIntoChapters = (rawText: string, bookTitle: string): Chapter[] => {
  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  if (!normalizedText) {
    return [
      {
        id: `chap-1-${Date.now()}`,
        number: 1,
        title: 'Bab 1: Awal Cerita',
        content: 'Dokumen ini tidak memiliki teks yang terbaca.'
      }
    ];
  }

  // Regex to detect chapter headers like:
  // "BAB 1", "Bab 1: ...", "CHAPTER 1", "Chapter I", "Bagian 1", "Bagian Pertama", "BAGIAN 1"
  const chapterPattern = /(?:^|\n\n+)(?=(?:BAB|Bab|CHAPTER|Chapter|BAGIAN|Bagian|Part|PART)\s+(?:[0-9IVXLCDMivxlcdm]+|[A-Za-z]+)(?:\s*[:.\-–—]|\s*\n))/g;
  
  const rawSections = normalizedText.split(chapterPattern).map(s => s.trim()).filter(Boolean);

  if (rawSections.length > 1) {
    return rawSections.map((section, idx) => {
      const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
      const firstLine = lines[0] || `Bab ${idx + 1}`;
      const title = firstLine.length > 60 ? firstLine.slice(0, 57) + '...' : firstLine;
      const content = lines.slice(1).join('\n\n') || section;

      return {
        id: `chap-${idx + 1}-${Date.now()}`,
        number: idx + 1,
        title: title.startsWith('Bab') || title.startsWith('BAB') || title.startsWith('Chapter') ? title : `Bab ${idx + 1}: ${title}`,
        content: content.trim()
      };
    });
  }

  // If no chapter headers were detected, split by chunk if long (> 4000 characters)
  const CHUNK_SIZE = 4000;
  if (normalizedText.length > CHUNK_SIZE) {
    const chapters: Chapter[] = [];
    const paragraphs = normalizedText.split(/\n\s*\n/);
    let currentChunk = '';
    let chapterIndex = 1;

    for (const paragraph of paragraphs) {
      if ((currentChunk.length + paragraph.length) > CHUNK_SIZE && currentChunk.length > 1500) {
        chapters.push({
          id: `chap-${chapterIndex}-${Date.now()}`,
          number: chapterIndex,
          title: `Bagian ${chapterIndex}`,
          content: currentChunk.trim()
        });
        currentChunk = paragraph + '\n\n';
        chapterIndex++;
      } else {
        currentChunk += paragraph + '\n\n';
      }
    }

    if (currentChunk.trim().length > 0) {
      chapters.push({
        id: `chap-${chapterIndex}-${Date.now()}`,
        number: chapterIndex,
        title: `Bagian ${chapterIndex}`,
        content: currentChunk.trim()
      });
    }

    return chapters;
  }

  // Single chapter
  return [
    {
      id: `chap-1-${Date.now()}`,
      number: 1,
      title: `Isi Dokumen ${bookTitle}`,
      content: normalizedText
    }
  ];
};

/**
 * Extract text from PDF file using pdfjs-dist
 */
const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    const pdfjs = await import('pdfjs-dist');
    // Set worker from unpkg or cdn if not in local
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n\n--- Halaman ${pageNum} ---\n\n` + pageText;
    }

    return fullText.trim();
  } catch (err: any) {
    console.error('Error extracting text from PDF:', err);
    throw new Error('Gagal mengekstrak teks dari berkas PDF: ' + (err?.message || 'Format tidak didukung'));
  }
};

/**
 * Extract text from DOCX file using Mammoth
 */
const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (err: any) {
    console.error('Error extracting text from DOCX:', err);
    throw new Error('Gagal mengekstrak teks dari berkas Word (.docx): ' + (err?.message || 'Format rusak'));
  }
};

/**
 * Extract text from EPUB file (HTML chapters)
 */
const extractTextFromEpub = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Basic EPUB unzipping using browser streams or text extraction
    const textDecoder = new TextDecoder('utf-8');
    const raw = textDecoder.decode(new Uint8Array(arrayBuffer));
    // Strip XML/HTML tags
    const cleanText = raw
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ');

    return cleanText.trim();
  } catch {
    return 'Gagal memproses berkas EPUB.';
  }
};

/**
 * Main parser entry point for uploaded documents
 */
export const parseUploadedBookFile = async (file: File): Promise<ParsedBookDocument> => {
  const fileName = file.name;
  const fileSize = formatFileSize(file.size);
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const title = cleanFileNameToTitle(fileName);

  let fullText = '';

  if (ext === 'txt' || ext === 'text' || ext === 'md' || ext === 'markdown') {
    fullText = await file.text();
  } else if (ext === 'pdf') {
    const buffer = await file.arrayBuffer();
    fullText = await extractTextFromPdf(buffer);
  } else if (ext === 'docx') {
    const buffer = await file.arrayBuffer();
    fullText = await extractTextFromDocx(buffer);
  } else if (ext === 'epub') {
    const buffer = await file.arrayBuffer();
    fullText = await extractTextFromEpub(buffer);
  } else if (ext === 'json') {
    const content = await file.text();
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed[0]?.title) {
        throw new Error('Berkas ini adalah berkas backup seluruh perpustakaan. Silakan gunakan menu Impor Cadangan.');
      }
      if (parsed.title && parsed.chapters) {
        return {
          title: parsed.title,
          author: parsed.author || 'Penulis Tidak Diketahui',
          description: parsed.description || 'Diimpor dari berkas dokumen',
          fullText: parsed.chapters.map((c: any) => c.content).join('\n\n'),
          chapters: parsed.chapters,
          fileName,
          fileSize,
          fileType: ext.toUpperCase(),
          totalPagesEstimated: Math.max(1, Math.ceil(fullText.length / 1500))
        };
      }
      fullText = content;
    } catch (e: any) {
      if (e.message?.includes('backup')) throw e;
      fullText = content;
    }
  } else {
    // Attempt text decode
    try {
      fullText = await file.text();
    } catch {
      throw new Error(`Format berkas .${ext} belum didukung. Harap unggah berkas .PDF, .DOCX, .TXT, atau .EPUB.`);
    }
  }

  // Generate description / synopsis from first ~250 characters
  const cleanSnippet = fullText
    .replace(/^--- Halaman \d+ ---\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const description = cleanSnippet.length > 250
    ? cleanSnippet.slice(0, 247) + '...'
    : cleanSnippet || `Dokumen novel ${title} yang diunggah dari berkas ${fileName}.`;

  // Divide into chapters
  const chapters = splitTextIntoChapters(fullText, title);

  // Estimate pages (approx 1,500 characters per novel page)
  const totalPagesEstimated = Math.max(1, Math.ceil(fullText.length / 1500));

  return {
    title,
    author: 'Penulis Tidak Diketahui',
    description,
    fullText,
    chapters,
    fileName,
    fileSize,
    fileType: ext.toUpperCase(),
    totalPagesEstimated
  };
};
