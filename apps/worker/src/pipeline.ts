import { SupabaseClient } from '@supabase/supabase-js';
import {
  chunkSegments,
  normalizeArabic,
  validateConsonants,
  SegmentOutput,
  ReviewOutput,
} from '@pinterbacaarab/shared';
import { analyzeSegment, reviewSegment, LlmConfig, getLlmConfig } from './llm';

export interface ProcessSegmentResult {
  segmentOutput: SegmentOutput;
  reviewOutput: ReviewOutput | null;
  status: 'ok' | 'needs_review' | 'failed';
  error?: string;
}

/**
 * Menjalankan Pass A (Analisis) dengan validasi konsonan ketat (retry maks 2x),
 * lalu menjalankan Pass B (Review) untuk scoring confidence dan i'rab.
 */
export async function processSegmentWithValidation(
  segmentSource: string,
  options: {
    detail?: 'brief' | 'full';
    prevContext?: string;
    nextContext?: string;
    llmConfig?: LlmConfig;
    mock?: boolean;
    mockResponseA?: string;
    mockResponseB?: string;
  } = {},
): Promise<ProcessSegmentResult> {
  const maxAttempts = 3; // 1 attempt awal + 2 retries
  let lastOutput: SegmentOutput | null = null;
  let isValid = false;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const output = await analyzeSegment(segmentSource, {
        detail: options.detail || 'full',
        prevContext: options.prevContext,
        nextContext: options.nextContext,
        config: options.llmConfig,
        mock: options.mock,
        mockResponse: options.mockResponseA,
      });

      lastOutput = output;

      // Validasi konsonan 100% identik
      if (validateConsonants(output.arabic_vocalized, segmentSource)) {
        isValid = true;
        break;
      } else {
        lastError = `Konsonan teks bersyakal tidak identik dengan teks sumber (percobaan ${attempt}/${maxAttempts})`;
      }
    } catch (err: any) {
      lastError = err.message || 'Error saat menganalisis segmen';
    }
  }

  if (!lastOutput) {
    return {
      segmentOutput: {
        title: null,
        arabic_vocalized: segmentSource,
        translation_id: '',
        words: [],
      },
      reviewOutput: null,
      status: 'failed',
      error: lastError,
    };
  }

  // Pass B: Review muraji'
  let review: ReviewOutput | null = null;
  try {
    review = await reviewSegment(segmentSource, lastOutput, {
      config: options.llmConfig,
      mock: options.mock,
      mockResponse: options.mockResponseB,
    });
  } catch (err: any) {
    console.warn('Pass B review warning:', err.message);
  }

  const finalOutput = review || lastOutput;

  return {
    segmentOutput: finalOutput,
    reviewOutput: review,
    status: isValid ? 'ok' : 'needs_review',
    error: isValid ? undefined : lastError,
  };
}

/**
 * Memproses seluruh job dokumen end-to-end:
 * 1. Ambil dokumen
 * 2. Segmentasi teks
 * 3. Simpan segmen ke DB
 * 4. Analisis & Review per segmen
 * 5. Simpan tabel words ke DB
 * 6. Update status dokumen & job
 */
export async function processDocumentJob(
  jobId: string,
  supabase: SupabaseClient,
  llmConfig?: LlmConfig,
  options: { mock?: boolean } = {},
): Promise<void> {
  const config = llmConfig || getLlmConfig();

  // 1. Ambil job
  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .select('*, documents(*)')
    .eq('id', jobId)
    .single();

  if (jobErr || !job) {
    throw new Error(`Job not found: ${jobId}`);
  }

  const document = job.documents;
  if (!document) {
    throw new Error(`Document missing for job: ${jobId}`);
  }

  // 2. Normalisasi & segmentasi teks sumber (50 kata per segmen agar presisi & cepat)
  const sourceText = document.source_text;
  const segments = chunkSegments(sourceText, 50);

  await supabase
    .from('jobs')
    .update({
      status: 'running',
      progress_total: segments.length,
      progress_done: 0,
      started_at: new Date().toISOString(),
    })
    .eq('id', jobId);

  await supabase.from('documents').update({ status: 'processing' }).eq('id', document.id);

  let hasNeedsReview = false;

  for (let i = 0; i < segments.length; i++) {
    const segmentText = segments[i];
    const prevContext = i > 0 ? segments[i - 1] : undefined;
    const nextContext = i < segments.length - 1 ? segments[i + 1] : undefined;

    // Simpan placeholder segmen ke DB
    const { data: segmentRow, error: segInsertErr } = await supabase
      .from('segments')
      .upsert(
        {
          document_id: document.id,
          position: i + 1,
          source_text: segmentText,
          status: 'pending',
        },
        { onConflict: 'document_id,position' },
      )
      .select()
      .single();

    if (segInsertErr || !segmentRow) {
      console.error('Failed to create segment row:', segInsertErr);
      continue;
    }

    // Eksekusi Pass A & Pass B
    const result = await processSegmentWithValidation(segmentText, {
      detail: document.detail || 'full',
      prevContext,
      nextContext,
      llmConfig: config,
      mock: options.mock,
      mockResponseA: options.mock
        ? JSON.stringify({
            title: null,
            arabic_vocalized: segmentText,
            translation_id: `Terjemah untuk segmen: ${segmentText}`,
            words: segmentText
              .split(/\s+/)
              .filter((w) => w.length > 0)
              .map((w) => ({
                ar: w,
                meaning_id: `Arti ${w}`,
                nahwu: "I'rab kata",
                sharf: { root: null, wazan: null, tashrif: null, note: null },
                confidence: 0.95,
              })),
          })
        : undefined,
      mockResponseB: options.mock
        ? JSON.stringify({
            title: null,
            arabic_vocalized: segmentText,
            translation_id: `Terjemah untuk segmen: ${segmentText}`,
            words: segmentText
              .split(/\s+/)
              .filter((w) => w.length > 0)
              .map((w) => ({
                ar: w,
                meaning_id: `Arti ${w}`,
                nahwu: "I'rab kata",
                sharf: { root: null, wazan: null, tashrif: null, note: null },
                confidence: 0.95,
              })),
            changes: [],
          })
        : undefined,
    });

    if (result.status === 'needs_review') {
      hasNeedsReview = true;
    }

    // Update hasil segmen di DB
    await supabase
      .from('segments')
      .update({
        title: result.segmentOutput.title,
        arabic_vocalized: result.segmentOutput.arabic_vocalized,
        translation_id: result.segmentOutput.translation_id,
        status: result.status,
        error: result.error || null,
      })
      .eq('id', segmentRow.id);

    // Simpan kata-kata (words) ke DB
    if (result.segmentOutput.words.length > 0) {
      const wordsToInsert = result.segmentOutput.words.map((w, wIndex) => ({
        segment_id: segmentRow.id,
        position: wIndex + 1,
        ar: w.ar,
        meaning_id: w.meaning_id,
        nahwu: w.nahwu,
        sharf_root: w.sharf?.root || null,
        sharf_wazan: w.sharf?.wazan || null,
        sharf_tashrif: w.sharf?.tashrif || null,
        sharf_note: w.sharf?.note || null,
        confidence: w.confidence,
        checked: w.confidence >= 0.7,
        edited: false,
      }));

      // Hapus data words lama bila ada retry
      await supabase.from('words').delete().eq('segment_id', segmentRow.id);
      await supabase.from('words').insert(wordsToInsert);
    }

    // Update progres job
    await supabase
      .from('jobs')
      .update({ progress_done: i + 1 })
      .eq('id', jobId);
  }

  // 3. Selesaikan job
  const finalDocStatus = hasNeedsReview ? 'needs_review' : 'ready';
  await supabase.from('documents').update({ status: finalDocStatus }).eq('id', document.id);

  await supabase
    .from('jobs')
    .update({
      status: 'done',
      finished_at: new Date().toISOString(),
    })
    .eq('id', jobId);
}
