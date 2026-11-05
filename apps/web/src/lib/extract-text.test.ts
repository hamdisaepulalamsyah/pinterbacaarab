import { describe, expect, it } from 'vitest';
import { extractTextFromBuffer } from './extract-text';

describe('Document Text Extraction (PDF / TXT / DOCX)', () => {
  it('extracts plain text from TXT buffer and formats title', async () => {
    const arabicContent = 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى';
    const buffer = Buffer.from(arabicContent, 'utf-8');

    const result = await extractTextFromBuffer(buffer, 'hadis-arbain-1.txt', 'text/plain');

    expect(result.text).toBe(arabicContent);
    expect(result.wordCount).toBe(8);
    expect(result.suggestedTitle).toBe('Hadis arbain 1');
    expect(result.method).toBe('direct');
  });

  it('handles empty or clean whitespace gracefully', async () => {
    const buffer = Buffer.from('   \n\n\t  ', 'utf-8');
    const result = await extractTextFromBuffer(buffer, 'kosong.txt', 'text/plain');

    expect(result.text).toBe('');
    expect(result.wordCount).toBe(0);
  });
});
