import { describe, expect, it } from 'vitest';
import { SegmentOutputSchema } from './index';

describe('Shared package schema', () => {
  it('validates a correct segment output', () => {
    const validSample = {
      title: null,
      arabic_vocalized: 'ذَهَبَ أَهْلُ الدُّثُورِ',
      translation_id: 'Orang-orang kaya telah pergi',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi',
          nahwu: "Fi'il madhi",
          sharf: {
            root: 'ذ-ه-ب',
            wazan: 'فَعَلَ',
            tashrif: 'ذَهَبَ - يَذْهَبُ',
            note: null,
          },
          confidence: 0.98,
        },
      ],
    };

    const parsed = SegmentOutputSchema.safeParse(validSample);
    expect(parsed.success).toBe(true);
  });
});
