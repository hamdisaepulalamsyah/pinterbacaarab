import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { processDocumentJob } from './pipeline';
import { getLlmConfig } from './llm';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export function createWorkerSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase URL or Service Role Key in environment');
  }
  return createClient(url, key);
}

/**
 * Mengklaim 1 job pending menggunakan PostgreSQL row-level lock (RPC claim_job).
 */
export async function claimNextJob(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('claim_job');
  if (error) {
    console.error('Error claiming job:', error);
    return null;
  }
  return data;
}

/**
 * Menjalankan satu putaran pengecekan dan eksekusi job.
 */
export async function runWorkerIteration(
  supabase: SupabaseClient,
  options: { mock?: boolean } = {},
): Promise<boolean> {
  const job = await claimNextJob(supabase);
  if (!job) return false;

  console.log(`[Worker] Mengambil job: ${job.id} (jenis: ${job.kind})`);
  try {
    if (job.kind === 'process') {
      await processDocumentJob(job.id, supabase, getLlmConfig(), { mock: options.mock });
      console.log(`[Worker] Job ${job.id} selesai diproses.`);
    }
  } catch (err: any) {
    console.error(`[Worker] Gagal memproses job ${job.id}:`, err);
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error: err.message || String(err),
        finished_at: new Date().toISOString(),
      })
      .eq('id', job.id);
  }

  return true;
}

/**
 * Loop worker utama (dapat dihentikan dengan flag shouldStop).
 */
export async function startWorkerLoop(options: { once?: boolean; pollIntervalMs?: number } = {}) {
  const supabase = createWorkerSupabaseClient();
  const pollInterval = options.pollIntervalMs || 3000;

  console.log('[Worker] Worker antrean job aktif...');

  let running = true;
  while (running) {
    const processed = await runWorkerIteration(supabase);
    if (options.once) break;

    if (!processed) {
      await new Promise((r) => setTimeout(r, pollInterval));
    }
  }
}
