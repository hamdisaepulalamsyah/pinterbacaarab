import { describe, expect, it } from 'vitest';
import { getWorkerStatus } from './index';

describe('Worker module', () => {
  it('returns valid initial status', () => {
    const status = getWorkerStatus();
    expect(status.status).toBe('idle');
    expect(status.schemaLoaded).toBe(true);
  });
});
