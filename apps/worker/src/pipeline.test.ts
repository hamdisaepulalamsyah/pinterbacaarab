import { describe, expect, it } from 'vitest';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createWorkerSupabaseClient, runWorkerIteration } from './index';
import { chunkSegments } from '@pinterbacaarab/shared';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

describe('Worker Pipeline Integration (Fase 4)', () => {
  it('chunks sample text into at least 5 segments', () => {
    const longHadith =
      'عن أبي ذر رضي الله عنه أن ناسا من أصحاب رسول الله صلى الله عليه وسلم قالوا للنبي صلى الله عليه وسلم: يا رسول الله ذهب أهل الدثور بالأجور، يصلون كما نصلي، ويصومون كما نصوم، ويتصدقون بفضول أموالهم. قال: أوليس قد جعل الله لكم ما تصدقون؟ إن بكل تسبيحة صدقة، وكل تكبيرة صدقة، وكل تحميدة صدقة، وكل تهليلة صدقة. وأمر بالمعروف صدقة، ونهي عن منكر صدقة، وفي بضع أحدكم صدقة. قالوا: يا رسول الله، أيأتي أحدنا شهوته ويكون له فيها أجر؟ قال: أرأيتم لو وضعها في حرام أكان عليه فيها وزر؟ فكذلك إذا وضعها في الحلال كان له أجر.';

    // Chunking dengan max 18 kata per segmen untuk membentuk 5-7 segmen terstruktur
    const segments = chunkSegments(longHadith, 18);
    expect(segments.length).toBeGreaterThanOrEqual(5);
  });

  it('runs end-to-end document processing via mock LLM mode and records segments + words to Supabase', async () => {
    const supabase = createWorkerSupabaseClient();

    // 1. Setup temporary test user
    const testEmail = `pipeline_user_${Date.now()}@test.local`;
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
    });
    expect(userError).toBeNull();
    const userId = userData.user!.id;

    // 2. Insert test document
    const sampleText =
      'ذهب أهل الدثور بالأجور. يصلون كما نصلي. ويصومون كما نصوم. ويتصدقون بفضول أموالهم. إن بكل تسبيحة صدقة.';

    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: 'Uji End-to-End Pipeline Hadis',
        source_text: sampleText,
        detail: 'full',
        status: 'queued',
      })
      .select()
      .single();

    expect(docError).toBeNull();
    expect(doc?.id).toBeDefined();

    // 3. Insert process job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        document_id: doc.id,
        user_id: userId,
        kind: 'process',
        status: 'pending',
      })
      .select()
      .single();

    expect(jobError).toBeNull();
    expect(job?.id).toBeDefined();

    // 4. Worker claims and processes the job
    const processed = await runWorkerIteration(supabase, { mock: true });
    expect(processed).toBe(true);

    // 5. Verify document and job status
    const { data: updatedDoc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', doc.id)
      .single();
    expect(['ready', 'needs_review']).toContain(updatedDoc.status);

    const { data: updatedJob } = await supabase.from('jobs').select('*').eq('id', job.id).single();
    expect(updatedJob.status).toBe('done');
    expect(updatedJob.progress_done).toBeGreaterThanOrEqual(1);

    // 6. Verify segments recorded in DB
    const { data: segments } = await supabase
      .from('segments')
      .select('*')
      .eq('document_id', doc.id)
      .order('position');
    expect(segments?.length).toBeGreaterThanOrEqual(1);

    // 7. Verify words recorded in DB
    const firstSegment = segments![0];
    const { data: words } = await supabase
      .from('words')
      .select('*')
      .eq('segment_id', firstSegment.id);
    expect(words?.length).toBeGreaterThan(0);
    expect(words?.[0].ar).toBeDefined();

    // Clean up
    await supabase.from('documents').delete().eq('id', doc.id);
    await supabase.auth.admin.deleteUser(userId);
  }, 180000);
});
