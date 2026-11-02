import { describe, expect, it } from 'vitest';
import { analyzeSegment, extractJsonFromResponse, loadPromptTemplate, reviewSegment } from './llm';

describe('Worker LLM Client: Module & Formatting Utilities', () => {
  it('extractJsonFromResponse: handles clean JSON, code blocks, and surrounding text', () => {
    const rawClean = '{"title": null, "words": []}';
    expect(extractJsonFromResponse(rawClean)).toBe(rawClean);

    const rawBlock = '```json\n{"title": "test", "words": []}\n```';
    expect(extractJsonFromResponse(rawBlock)).toBe('{"title": "test", "words": []}');

    const messyText = 'Berikut hasilnya:\n```\n{"ok": true}\n```\nSemoga membantu!';
    expect(extractJsonFromResponse(messyText)).toBe('{"ok": true}');
  });

  it('loadPromptTemplate: loads analyze.md and review.md templates', () => {
    const analyzePrompt = loadPromptTemplate('analyze.md');
    expect(analyzePrompt).toContain('{{segment}}');
    expect(analyzePrompt).toContain('{{detail}}');

    const reviewPrompt = loadPromptTemplate('review.md');
    expect(reviewPrompt).toContain('{{segment_source}}');
    expect(reviewPrompt).toContain('{{analysis_json}}');
  });

  it('analyzeSegment: parses valid mock LLM response adhering to SegmentOutputSchema', async () => {
    const mockOutput = JSON.stringify({
      title: null,
      arabic_vocalized: 'ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ',
      translation_id: 'Orang-orang kaya memborong pahala.',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi / memborong',
          nahwu: "Fi'il madhi mabni atas fathah.",
          sharf: {
            root: 'ذ-ه-ب',
            wazan: 'فَعَلَ',
            tashrif: 'ذَهَبَ - يَذْهَبُ',
            note: null,
          },
          confidence: 0.98,
        },
      ],
    });

    const result = await analyzeSegment('ذهب أهل الدثور بالأجور', {
      mock: true,
      mockResponse: `\`\`\`json\n${mockOutput}\n\`\`\``,
    });

    expect(result.arabic_vocalized).toBe('ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ');
    expect(result.words.length).toBe(1);
    expect(result.words[0].ar).toBe('ذَهَبَ');
  });

  it('reviewSegment: parses valid mock Review output with changes', async () => {
    const analysisData = {
      title: null,
      arabic_vocalized: 'ذَهَبَ أَهْلُ',
      translation_id: 'Pergi orang-orang',
      words: [
        {
          ar: 'ذَهَبَ',
          meaning_id: 'pergi',
          nahwu: "Fi'il madhi",
          sharf: { root: 'ذ-ه-ب', wazan: 'فَعَلَ', tashrif: null, note: null },
          confidence: 0.95,
        },
      ],
    };

    const mockReviewOutput = JSON.stringify({
      ...analysisData,
      changes: [
        {
          index: 0,
          field: 'nahwu',
          reason: 'Ditinjau ulang tanda bina',
        },
      ],
    });

    const review = await reviewSegment('ذهب أهل', analysisData, {
      mock: true,
      mockResponse: mockReviewOutput,
    });

    expect(review.changes.length).toBe(1);
    expect(review.changes[0].field).toBe('nahwu');
  });
});
