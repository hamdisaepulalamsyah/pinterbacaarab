import { chromium } from 'playwright';
import { PdfDocumentData, generateKajianHtml } from './pdf-template';
import { SupabaseClient } from '@supabase/supabase-js';

export const PLAYWRIGHT_RESOURCE_FLAGS = [
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--disable-software-rasterizer',
  '--disable-extensions',
  '--disable-background-networking',
  '--mute-audio',
  '--js-flags=--max-old-space-size=256',
];

/**
 * Merender markup HTML menjadi dokumen PDF A4 Portrait berkualitas tinggi.
 */
export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
    args: PLAYWRIGHT_RESOURCE_FLAGS,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '14mm',
        left: '12mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/**
 * Mengambil data dokumen, merender PDF, mengunggah ke Supabase Storage,
 * dan memperbarui pdf_path pada dokumen.
 */
export async function generateAndUploadPdf(
  documentId: string,
  supabase: SupabaseClient,
  options: { showHarakat?: boolean } = {},
): Promise<{ path: string; buffer: Buffer }> {
  const showHarakat = options.showHarakat !== false;

  // 1. Ambil data dokumen beserta segmen & words
  const { data: doc, error: docErr } = await supabase
    .from('documents')
    .select('*, segments(*, words(*))')
    .eq('id', documentId)
    .single();

  if (docErr || !doc) {
    throw new Error(`Document not found: ${documentId}`);
  }

  // Susun data sesuai interface PdfDocumentData
  const sortedSegments = (doc.segments || [])
    .sort((a: any, b: any) => a.position - b.position)
    .map((seg: any) => ({
      position: seg.position,
      title: seg.title,
      arabic_vocalized: seg.arabic_vocalized,
      translation_id: seg.translation_id,
      words: (seg.words || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((w: any) => ({
          ar: w.ar,
          meaning_id: w.meaning_id,
          nahwu: w.nahwu,
          sharf_root: w.sharf_root,
          sharf_wazan: w.sharf_wazan,
          sharf_tashrif: w.sharf_tashrif,
          sharf_note: w.sharf_note,
        })),
    }));

  const docData: PdfDocumentData = {
    title: doc.title,
    source_name: doc.source_name,
    segments: sortedSegments,
    showHarakat,
  };

  // 2. Buat HTML dan Render ke PDF
  const html = generateKajianHtml(docData);
  const pdfBuffer = await renderHtmlToPdf(html);

  // 3. Simpan ke Supabase Storage bucket 'exports'
  const sanitizedTitle = doc.title.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  const storagePath = `${doc.user_id}/${doc.id}/${sanitizedTitle}${showHarakat ? '' : '_gundul'}.pdf`;

  const { error: uploadErr } = await supabase.storage
    .from('exports')
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadErr) {
    throw new Error(`Failed to upload PDF to storage: ${uploadErr.message}`);
  }

  // 4. Update dokumen di DB
  await supabase
    .from('documents')
    .update({
      pdf_path: storagePath,
      status: 'exported',
    })
    .eq('id', doc.id);

  return { path: storagePath, buffer: pdfBuffer };
}
