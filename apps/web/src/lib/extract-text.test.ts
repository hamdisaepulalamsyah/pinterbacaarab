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

  it('filters out Indonesian/Latin explanations and keeps only pure Arabic text', async () => {
    const mixedContent = `Kajian Hadis Shahih Bukhari No. 1
Disusun oleh Ustadz Fulan
Halaman 1 dari 5

Bab Niat:
عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ سَمِعْتُ رَسُولَ اللَّهِ يَقُولُ
إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
رَوَاهُ الْبُخَارِيُّ وَمُسْلِمٌ

Terjemahan:
Sesungguhnya seluruh amalan tergantung pada niatnya.
Hadis ini sangat agung kedudukannya dalam Islam.`;

    const buffer = Buffer.from(mixedContent, 'utf-8');
    const result = await extractTextFromBuffer(buffer, 'modul-hadis-niat.txt', 'text/plain');

    expect(result.text).toContain('عَنْ عُمَرَ بْنِ الْخَطَّابِ');
    expect(result.text).toContain('إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ');
    expect(result.text).toContain('رَوَاهُ الْبُخَارِيُّ وَمُسْلِمٌ');
    expect(result.text).not.toContain('Kajian Hadis');
    expect(result.text).not.toContain('Ustadz Fulan');
    expect(result.text).not.toContain('Terjemahan');
    expect(result.text).not.toContain('Sesungguhnya');
    expect(result.wordCount).toBe(23);
  });
});
