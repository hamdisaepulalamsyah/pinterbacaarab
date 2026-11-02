import { describe, expect, it } from 'vitest';
import { APP_NAME } from './index';

describe('Web App entry', () => {
  it('has expected app name', () => {
    expect(APP_NAME).toBe('Nahwu Studio');
  });
});
