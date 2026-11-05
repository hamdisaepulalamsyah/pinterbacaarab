import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractionResult {
  text: string;
  wordCount: number;
  fileName: string;
  suggestedTitle: string;
  method: 'direct' | 'ocr';
}

/**
 * Fallback OCR untuk PDF berbasis gambar/scan menggunakan model vision multimodal
 */
async function performOcrFallback(buffer: Buffer, mimeType: string): Promise<string | null> {
  const isVps = process.env.IS_VPS === 'true' || process.platform === 'linux';
  const baseUrl =
    (isVps && process.env.NINEROUTER_INTERNAL_URL)
      ? process.env.NINEROUTER_INTERNAL_URL
      : process.env.NINEROUTER_BASE_URL || 'http://127.0.0.1:20128';
  const apiKey = process.env.NINEROUTER_API_KEY;
  const model = process.env.LLM_MODEL || 'ag/gemini-3.8-flash';

  if (!apiKey || !baseUrl) return null;

  try {
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${mimeType || 'application/pdf'};base64,${base64Data}`;

    const prompt = 'Ekstrak dan salin seluruh teks Arab dari dokumen ini secara persis dan lengkap. Keluarkan HANYA teks Arab tanpa terjemahan, tanpa penjelasan, dan tanpa komentar.';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: dataUri },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 8192,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn('OCR request HTTP status not ok:', res.status);
      return null;
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || null;
  } catch (err: any) {
    console.warn('OCR fallback warning:', err.message);
    return null;
  }
}

/**
 * Ekstraksi teks dari Buffer file (PDF, TXT, DOCX)
 */
export async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType: string = 'application/pdf',
): Promise<ExtractionResult> {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  let rawText = '';
  let method: 'direct' | 'ocr' = 'direct';

  if (ext === 'txt') {
    rawText = buffer.toString('utf-8');
  } else if (ext === 'docx') {
    const res = await mammoth.extractRawText({ buffer });
    rawText = res.value || '';
  } else if (ext === 'pdf') {
    try {
      const parser = new PDFParse({ data: buffer });
      const res = await parser.getText();
      rawText = res.text || '';
      await parser.destroy();
    } catch (err: any) {
      console.warn('PDFParse extraction error:', err.message);
    }

    // Periksa apakah hasil ekstraksi teks langsung memuat huruf Arab
    const hasArabic = /[\u0600-\u06FF]/.test(rawText);

    // Bila tidak memuat huruf Arab yang cukup (kemungkinan PDF scan/gambar), gunakan OCR fallback
    if (!hasArabic || rawText.trim().length < 15) {
      const ocrText = await performOcrFallback(buffer, mimeType);
      if (ocrText && ocrText.trim().length > 0) {
        rawText = ocrText;
        method = 'ocr';
      }
    }
  } else {
    // Format teks umum
    rawText = buffer.toString('utf-8');
  }

  // Bersihkan teks: rapikan newline dan whitespace
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Buat rekomendasi judul dari nama file
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const suggestedTitle = baseName ? baseName.charAt(0).toUpperCase() + baseName.slice(1) : '';

  return {
    text: cleaned,
    wordCount,
    fileName,
    suggestedTitle,
    method,
  };
}
