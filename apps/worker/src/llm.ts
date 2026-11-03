import fs from 'fs';
import path from 'path';
import { jsonrepair } from 'jsonrepair';
import {
  SegmentOutput,
  SegmentOutputSchema,
  ReviewOutput,
  ReviewOutputSchema,
} from '@pinterbacaarab/shared';

export interface LlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  modelReview: string;
  timeoutMs?: number;
}

export function getLlmConfig(): LlmConfig {
  const isVps = process.env.IS_VPS === 'true' || process.platform === 'linux';
  const baseUrl =
    isVps && process.env.NINEROUTER_INTERNAL_URL
      ? process.env.NINEROUTER_INTERNAL_URL
      : process.env.NINEROUTER_BASE_URL || 'http://127.0.0.1:20128';
  const apiKey = process.env.NINEROUTER_API_KEY || '';
  const model = process.env.LLM_MODEL || 'ag/gemini-3.8-flash';
  const modelReview = process.env.LLM_MODEL_REVIEW || model;

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiKey,
    model,
    modelReview,
    timeoutMs: 120000,
  };
}

/**
 * Membersihkan respon mentah dari LLM dan mengekstrak objek JSON yang valid.
 */
export function extractJsonFromResponse(raw: string): string {
  let cleaned = raw.trim();
  // Tangani kemungkinan model membungkus dalam ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      try {
        return jsonrepair(candidate);
      } catch {
        return candidate;
      }
    }
  }
  if (firstBrace !== -1) {
    try {
      return jsonrepair(cleaned.slice(firstBrace));
    } catch {
      // Fallback
    }
  }
  try {
    return jsonrepair(cleaned);
  } catch {
    return cleaned;
  }
}

/**
 * Melakukan panggilan OpenAI-compatible ke 9router dengan exponential retry.
 */
export async function callLlmChat(
  prompt: string,
  options: {
    model?: string;
    mock?: boolean;
    mockResponse?: string;
    maxRetries?: number;
    config?: LlmConfig;
  } = {},
): Promise<string> {
  if (options.mock) {
    if (options.mockResponse) return options.mockResponse;
    throw new Error('Mock mode requested but mockResponse was not provided');
  }

  const config = options.config || getLlmConfig();
  const model = options.model || config.model;
  const maxRetries = options.maxRetries ?? 3;
  const endpoint = `${config.baseUrl}/v1/chat/completions`;

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs || 120000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          stream: false,
          response_format: { type: 'json_object' },
          reasoning_effort: 'low',
          max_tokens: 16384,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`9router HTTP ${res.status}: ${errorBody}`);
      }

      const rawText = await res.text();

      // Tangani jika respon berbentuk Server-Sent Events (SSE)
      if (rawText.includes('data:')) {
        let assembled = '';
        const lines = rawText.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            const jsonPart = trimmed.replace(/^data:\s*/, '').trim();
            if (jsonPart === '[DONE]') continue;
            try {
              const chunk = JSON.parse(jsonPart);
              const delta =
                chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || '';
              assembled += delta;
            } catch {
              // Abaikan line chunk yang bukan json valid
            }
          }
        }
        if (assembled) return assembled;
      }

      // Respon JSON standar
      try {
        const json = JSON.parse(rawText);
        const content = json.choices?.[0]?.message?.content;
        if (content) return content;
      } catch {
        // Fallback jika rawText langsung teks
      }

      return rawText;
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error('Failed to communicate with LLM provider');
}

/**
 * Membaca prompt template dari direktori prompts/
 */
export function loadPromptTemplate(filename: 'analyze.md' | 'review.md'): string {
  const possiblePaths = [
    path.resolve(__dirname, `../prompts/${filename}`),
    path.resolve(__dirname, `prompts/${filename}`),
    path.resolve(process.cwd(), `apps/worker/prompts/${filename}`),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }

  throw new Error(`Prompt template not found: ${filename}`);
}

/**
 * Pass A: Analisis Nahwu & Shorof per segmen.
 */
export async function analyzeSegment(
  segment: string,
  options: {
    detail?: 'brief' | 'full';
    prevContext?: string;
    nextContext?: string;
    mock?: boolean;
    mockResponse?: string;
    model?: string;
    config?: LlmConfig;
  } = {},
): Promise<SegmentOutput> {
  const template = loadPromptTemplate('analyze.md');
  const prompt = template
    .replace('{{detail}}', options.detail || 'full')
    .replace('{{prev_context}}', options.prevContext || '-')
    .replace('{{next_context}}', options.nextContext || '-')
    .replace('{{segment}}', segment);

  const raw = await callLlmChat(prompt, {
    mock: options.mock,
    mockResponse: options.mockResponse,
    model: options.model,
    config: options.config,
  });

  const jsonStr = extractJsonFromResponse(raw);
  const parsed = JSON.parse(jsonStr);
  return SegmentOutputSchema.parse(parsed);
}

/**
 * Pass B: Review muraji' terhadap hasil analisis Pass A.
 */
export async function reviewSegment(
  segmentSource: string,
  analysisJson: SegmentOutput,
  options: {
    mock?: boolean;
    mockResponse?: string;
    model?: string;
    config?: LlmConfig;
  } = {},
): Promise<ReviewOutput> {
  const template = loadPromptTemplate('review.md');
  const prompt = template
    .replace('{{segment_source}}', segmentSource)
    .replace('{{analysis_json}}', JSON.stringify(analysisJson, null, 2));

  const raw = await callLlmChat(prompt, {
    mock: options.mock,
    mockResponse: options.mockResponse,
    model: options.model || (options.config?.modelReview ?? options.config?.model),
    config: options.config,
  });

  const jsonStr = extractJsonFromResponse(raw);
  const parsed = JSON.parse(jsonStr);
  return ReviewOutputSchema.parse(parsed);
}
