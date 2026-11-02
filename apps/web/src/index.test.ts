import { describe, expect, it } from 'vitest';
import { countWords } from '@pinterbacaarab/shared';

describe('Web App Module Tests (Fase 6)', () => {
  it('validates client-side word count helper for input limit', () => {
    const text = 'ذهب أهل الدثور بالأجور';
    expect(countWords(text)).toBe(4);
    expect(countWords(text)).toBeLessThanOrEqual(3000);
  });
});
