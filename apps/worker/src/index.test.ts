import { describe, expect, it } from 'vitest';
import { claimNextJob } from './index';

describe('Worker antrean module', () => {
  it('handles claimNextJob gracefully with mock supabase client', async () => {
    const mockSupabase = {
      rpc: async (fn: string) => {
        expect(fn).toBe('claim_job');
        return { data: null, error: null };
      },
    } as any;

    const job = await claimNextJob(mockSupabase);
    expect(job).toBeNull();
  });
});
