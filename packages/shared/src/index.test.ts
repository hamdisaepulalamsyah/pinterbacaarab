import { describe, expect, it } from 'vitest';
import {
  chunkSegments,
  countWords,
  normalizeArabic,
  ReviewOutputSchema,
  SegmentOutputSchema,
  stripHarakat,
  validateConsonants,
} from './index';

describe('Shared Package: Arabic Processing Utilities', () => {
  const examplePlain = 'ذهب أهل الدثور بالأجور';
  const exampleVocalized = 'ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ';

  it('stripHarakat: correctly removes all vowels, shaddah, and tatweel', () => {
    expect(stripHarakat(exampleVocalized)).toBe(examplePlain);

    // Test with tatweel and various diacritics
    const textWithTatweel = 'كـَـتـَـابٌ';
    expect(stripHarakat(textWithTatweel)).toBe('كتاب');

    const empty = '';
    expect(stripHarakat(empty)).toBe('');
  });

  it('normalizeArabic: collapses multiple spaces, strips newlines and tatweel', () => {
    const raw = '  ذهب   أهل\n\nالدثور   بـالأجور  ';
    const normalized = normalizeArabic(raw);
    expect(normalized).toBe('ذهب أهل الدثور بالأجور');
  });

  it('validateConsonants: verifies consonant identity strictly', () => {
    // Valid match
    expect(validateConsonants(exampleVocalized, examplePlain)).toBe(true);

    // Invalid match: consonant changed
    const modifiedConsonant = 'ذَهَبَ أَهْلُ الْقُصُورِ بِالْأُجُورِ';
    expect(validateConsonants(modifiedConsonant, examplePlain)).toBe(false);

    // Invalid match: letter missing
    const missingLetter = 'ذَهَبَ أَهْلُ الدُّثُور';
    expect(validateConsonants(missingLetter, examplePlain)).toBe(false);
  });

  it('countWords: accurately counts words in Arabic sentence', () => {
    expect(countWords(examplePlain)).toBe(4);
    expect(countWords('')).toBe(0);
    expect(countWords('   كلمة   واحدة   ')).toBe(2);
  });

  it('chunkSegments: leaves short text as a single segment', () => {
    const chunks = chunkSegments(examplePlain, 10);
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toBe(examplePlain);
  });

  it('chunkSegments: splits long Arabic text respecting sentence boundaries and maxWords', () => {
    // Sample longer Hadith text
    const hadith =
      'ذهب أهل الدثور بالأجور، يصلون كما نصلي، ويصومون كما نصوم، ويتصدقون بفضول أموالهم. قال أوليس قد جعل الله لكم ما تصدقون؟ إن بكل تسبيحة صدقة، وكل تكبيرة صدقة، وكل تحميدة صدقة، وكل تهليلة صدقة.';

    const totalWords = countWords(hadith);
    expect(totalWords).toBeGreaterThan(25);

    // Split with maxWordsPerSegment = 10
    const chunks = chunkSegments(hadith, 10);
    expect(chunks.length).toBeGreaterThan(1);

    for (const chunk of chunks) {
      expect(countWords(chunk)).toBeLessThanOrEqual(15);
    }

    // When joined back without punctuation differences, word content should match
    const joined = chunks.join(' ');
    expect(countWords(joined)).toBe(totalWords);
  });
});

describe('Shared Package: Zod Schemas Validation', () => {
  it('validates a complete full-detail segment output', () => {
    const sample = {
      title: 'Kajian Hadis Abu Dzar',
      arabic_vocalized: 'ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ',
      translation_id: 'Orang-orang kaya telah memborong pahala.',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi / memborong',
          nahwu: "Fi'il madhi mabni atas fathah zhahirah.",
          sharf: {
            root: 'ذ-ه-ب',
            wazan: 'فَعَلَ',
            tashrif: 'ذَهَبَ - يَذْهَبُ - ذَهَابًا',
            note: "Fi'il tsulatsi mujarrad.",
          },
          confidence: 0.97,
        },
        {
          ar: 'أَهْلُ',
          meaning_id: 'pemilik',
          nahwu: "Fa'il marfu' dengan dhammah.",
          sharf: {
            root: 'أ-ه-ل',
            wazan: 'فَعْلٌ',
            tashrif: null,
            note: null,
          },
          confidence: 0.95,
        },
      ],
    };

    const result = SegmentOutputSchema.safeParse(sample);
    expect(result.success).toBe(true);
  });

  it('validates brief-detail segment output where nahwu and sharf fields are null', () => {
    const briefSample = {
      title: null,
      arabic_vocalized: 'ذَهَبَ أَهْلُ',
      translation_id: 'Telah pergi orang-orang',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi',
          nahwu: null,
          sharf: {
            root: null,
            wazan: null,
            tashrif: null,
            note: null,
          },
          confidence: 0.9,
        },
      ],
    };

    const result = SegmentOutputSchema.safeParse(briefSample);
    expect(result.success).toBe(true);
  });

  it('validates ReviewOutputSchema with review changes list', () => {
    const reviewSample = {
      title: null,
      arabic_vocalized: 'ذَهَبَ أَهْلُ',
      translation_id: 'Telah pergi orang-orang',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi',
          nahwu: "Fi'il madhi",
          sharf: { root: 'ذ-ه-ب', wazan: 'فَعَلَ', tashrif: null, note: null },
          confidence: 0.95,
        },
      ],
      changes: [
        {
          index: 0,
          field: 'nahwu',
          reason: 'Menambahkan keterangan tanda bina fathah zhahirah',
        },
      ],
    };

    const result = ReviewOutputSchema.safeParse(reviewSample);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.changes.length).toBe(1);
    }
  });

  it('fails validation when confidence is out of 0-1 range', () => {
    const invalidSample = {
      title: null,
      arabic_vocalized: 'ذَهَبَ',
      translation_id: 'Pergi',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi',
          nahwu: null,
          sharf: { root: null, wazan: null, tashrif: null, note: null },
          confidence: 1.5, // Invalid > 1
        },
      ],
    };

    const result = SegmentOutputSchema.safeParse(invalidSample);
    expect(result.success).toBe(false);
  });
});
