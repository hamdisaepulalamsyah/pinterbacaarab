import { z } from 'zod';

// ==========================================
// 1. Zod Schemas (TRD §5)
// ==========================================

export const SharfSchema = z.object({
  root: z.string().nullable(),
  wazan: z.string().nullable(),
  tashrif: z.string().nullable(),
  note: z.string().nullable(),
});

export const WordAnalysisSchema = z.object({
  ar: z.string().min(1),
  meaning_id: z.string(),
  nahwu: z.string().nullable(),
  sharf: SharfSchema,
  confidence: z.number().min(0).max(1),
  checked: z.boolean().optional(),
  edited: z.boolean().optional(),
});

export const SegmentOutputSchema = z.object({
  title: z.string().nullable(),
  arabic_vocalized: z.string().min(1),
  translation_id: z.string().min(1),
  words: z.array(WordAnalysisSchema),
});

export const ReviewChangeSchema = z.object({
  index: z.number().int().min(0),
  field: z.string(),
  reason: z.string(),
});

export const ReviewOutputSchema = SegmentOutputSchema.extend({
  changes: z.array(ReviewChangeSchema).optional().default([]),
});

export type SharfAnalysis = z.infer<typeof SharfSchema>;
export type WordAnalysis = z.infer<typeof WordAnalysisSchema>;
export type SegmentOutput = z.infer<typeof SegmentOutputSchema>;
export type ReviewChange = z.infer<typeof ReviewChangeSchema>;
export type ReviewOutput = z.infer<typeof ReviewOutputSchema>;

// ==========================================
// 2. Arabic Text Processing Utilities
// ==========================================

/**
 * Regex mencakup harakat standar dan tanda baca diakritik bahasa Arab:
 * - \u064B-\u0652: Fathatan, Dammatan, Kasratan, Fathah, Dammah, Kasrah, Shaddah, Sukun
 * - \u0653-\u065F: Maddah, Hamza above/below diacritics, dsb
 * - \u0670: Superscript/Dagger Alif (Alif Khanjariyyah)
 * - \u0640: Tatweel / Kashida
 * - \u0618-\u061A: Quranic small marks
 * - \u06D6-\u06ED: Quranic pause and annotation signs
 */
export const ARABIC_DIACRITICS_REGEX =
  /[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

/**
 * Menghapus seluruh harakat, tanda tasydid, dan tatweel dari teks Arab.
 */
export function stripHarakat(text: string): string {
  if (!text) return '';
  return text.replace(ARABIC_DIACRITICS_REGEX, '').trim();
}

/**
 * Menormalisasi spasi berlebih, menghapus tatweel, dan merapikan teks.
 * Catatan: Huruf dasar (konsonan) TIDAK dimodifikasi agar integritas teks terjaga.
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u0640]/g, '') // buang tatweel
    .replace(/[\r\n\t]+/g, ' ') // satukan baris dan tab jadi spasi tunggal
    .replace(/\s+/g, ' ') // rapikan spasi beruntun
    .trim();
}

/**
 * Normalisasi variasi huruf Arab (Alif dengan hamzah, Alif maqsura, Ta marbutha, dll)
 * untuk validasi konsonan yang toleran terhadap ejaan imla' standar.
 */
export function normalizeArabicLetters(text: string): string {
  if (!text) return '';
  return text
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}

/**
 * Memvalidasi apakah teks bersyakal memiliki konsonan yang identik
 * dengan teks sumber (mengabaikan spasi berlebih, tanda baca, tatweel, dan variasi imla' alif/hamzah).
 */
export function validateConsonants(vocalized: string, source: string): boolean {
  const cleanVocalized = normalizeArabicLetters(stripHarakat(vocalized)).replace(/[^\p{L}\p{N}]/gu, '');
  const cleanSource = normalizeArabicLetters(stripHarakat(source)).replace(/[^\p{L}\p{N}]/gu, '');
  return cleanVocalized === cleanSource;
}

/**
 * Menghitung jumlah kata berdasarkan pemisah spasi.
 */
export function countWords(text: string): number {
  const normalized = normalizeArabic(text);
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Memecah teks Arab menjadi beberapa segmen dengan batas maksimal kata per segmen (~100-120 kata).
 * Mengutamakan pemisahan di tanda baca alami (titik, koma Arab, tanda seru/tanya, titik dua).
 */
export function chunkSegments(text: string, maxWordsPerSegment: number = 100): string[] {
  const normalized = normalizeArabic(text);
  if (!normalized) return [];

  // Jika teks pendek langsung kembalikan satu segmen
  if (countWords(normalized) <= maxWordsPerSegment) {
    return [normalized];
  }

  // Pecah berdasarkan batas kalimat / tanda baca Arab & Latin
  // Simbol: . ، ؟ ! : ؛ \n
  const sentencePattern = /([^.،؟!؛:\n]+[.،؟!؛:\n]*)/g;
  const rawSentences = normalized.match(sentencePattern) || [normalized];

  const segments: string[] = [];
  let currentWords: string[] = [];

  for (const rawSentence of rawSentences) {
    const trimmed = rawSentence.trim();
    if (!trimmed) continue;

    const sentenceWords = trimmed.split(/\s+/).filter((w) => w.length > 0);

    // Bila satu kalimat itu sendiri melebihi batas, pecah paksa per maxWordsPerSegment kata
    if (sentenceWords.length > maxWordsPerSegment) {
      if (currentWords.length > 0) {
        segments.push(currentWords.join(' '));
        currentWords = [];
      }

      for (let i = 0; i < sentenceWords.length; i += maxWordsPerSegment) {
        const slice = sentenceWords.slice(i, i + maxWordsPerSegment);
        if (slice.length > 0) {
          segments.push(slice.join(' '));
        }
      }
      continue;
    }

    if (currentWords.length + sentenceWords.length <= maxWordsPerSegment) {
      currentWords.push(...sentenceWords);
    } else {
      segments.push(currentWords.join(' '));
      currentWords = [...sentenceWords];
    }
  }

  if (currentWords.length > 0) {
    segments.push(currentWords.join(' '));
  }

  return segments;
}
