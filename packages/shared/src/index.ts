import { z } from 'zod';

export const SharfSchema = z.object({
  root: z.string().nullable(),
  wazan: z.string().nullable(),
  tashrif: z.string().nullable(),
  note: z.string().nullable(),
});

export const WordAnalysisSchema = z.object({
  ar: z.string().min(1),
  meaning_id: z.string(),
  nahwu: z.string().nullable(),
  sharf: SharfSchema,
  confidence: z.number().min(0).max(1),
});

export const SegmentOutputSchema = z.object({
  title: z.string().nullable(),
  arabic_vocalized: z.string().min(1),
  translation_id: z.string().min(1),
  words: z.array(WordAnalysisSchema),
});

export type SharfAnalysis = z.infer<typeof SharfSchema>;
export type WordAnalysis = z.infer<typeof WordAnalysisSchema>;
export type SegmentOutput = z.infer<typeof SegmentOutputSchema>;
