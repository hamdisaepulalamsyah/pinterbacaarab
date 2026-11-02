import { SegmentOutputSchema } from '@pinterbacaarab/shared';

export function getWorkerStatus(): { status: string; schemaLoaded: boolean } {
  return {
    status: 'idle',
    schemaLoaded: typeof SegmentOutputSchema.parse === 'function',
  };
}
