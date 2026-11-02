import { describe, expect, it } from 'vitest';
import { generateKajianHtml, PdfDocumentData } from './pdf-template';
import { generateAndUploadPdf, renderHtmlToPdf } from './pdf';
import { createWorkerSupabaseClient } from './index';

describe('PDF Generation Module (Fase 5)', () => {
  const sampleDocData: PdfDocumentData = {
    title: 'Kajian Nahwu Hadis Abu Dzar',
    source_name: 'Shahih Muslim No. 1006',
    segments: [
      {
        position: 1,
        title: 'Keutamaan Orang Berharta yang Berinfak',
        arabic_vocalized: 'ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ',
        translation_id: 'Orang-orang yang memiliki banyak harta telah memborong pahala.',
        words: [
          {
            ar: 'ذَهَبَ',
            meaning_id: 'telah pergi / memborong',
            nahwu: "Fi'il madhi mabni atas fathah zhahirah.",
            sharf_root: 'ذ-ه-ب',
            sharf_wazan: 'فَعَلَ',
            sharf_tashrif: 'ذَهَبَ - يَذْهَبُ - ذَهَابًا',
            sharf_note: "Fi'il tsulatsi mujarrad shahih salim.",
          },
          {
            ar: 'أَهْلُ',
            meaning_id: 'pemilik / kaum',
            nahwu: "Fa'il marfu' dengan dhammah zhahirah, mudhaf.",
            sharf_root: 'أ-ه-ل',
            sharf_wazan: 'فَعْلٌ',
            sharf_tashrif: 'jamak: أَهْلُونَ / أَهَالٍ',
            sharf_note: null,
          },
          {
            ar: 'الدُّثُورِ',
            meaning_id: 'harta yang melimpah',
            nahwu: 'Mudhaf ilaih majrur dengan kasrah zhahirah.',
            sharf_root: 'د-ث-ر',
            sharf_wazan: 'فُعُولٌ',
            sharf_tashrif: 'jamak taksir dari دَثْرٌ',
            sharf_note: null,
          },
          {
            ar: 'بِالْأُجُورِ',
            meaning_id: 'dengan pahala yang besar',
            nahwu: "Huruf jar ba' dan isim majrur, muta'alliq dengan fi'il dzahaba.",
            sharf_root: 'أ-ج-ر',
            sharf_wazan: 'فُعُولٌ',
            sharf_tashrif: 'jamak taksir dari أَجْرٌ',
            sharf_note: null,
          },
        ],
      },
    ],
  };

  it('generateKajianHtml: creates semantic HTML with RTL Arabic and A4 landscape styles', () => {
    const html = generateKajianHtml(sampleDocData);
    expect(html).toContain('Kajian Nahwu Hadis Abu Dzar');
    expect(html).toContain('ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('lang="ar"');
    expect(html).toContain('size: A4 landscape');
    expect(html).toContain('words-table');
  });

  it('renderHtmlToPdf: renders PDF buffer with valid %PDF header', async () => {
    const html = generateKajianHtml(sampleDocData);
    const pdfBuffer = await renderHtmlToPdf(html);

    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer.length).toBeGreaterThan(1000);

    // Cek magic number signature PDF
    const pdfHeader = pdfBuffer.subarray(0, 5).toString('ascii');
    expect(pdfHeader).toBe('%PDF-');
  }, 60000);

  it('generateAndUploadPdf: end-to-end renders document from Supabase and uploads to storage bucket exports', async () => {
    const supabase = createWorkerSupabaseClient();
    const testEmail = `pdf_user_${Date.now()}@test.local`;
    const { data: user } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'Password123!',
      email_confirm: true,
    });
    const userId = user.user!.id;

    // Buat dokumen dengan 1 segmen dan kata di DB
    const { data: doc } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: 'Dokumen Uji PDF Storage',
        source_text: 'ذهب أهل الدثور بالأجور',
        status: 'ready',
      })
      .select()
      .single();

    const { data: seg } = await supabase
      .from('segments')
      .insert({
        document_id: doc!.id,
        position: 1,
        source_text: 'ذهب أهل الدثور بالأجور',
        arabic_vocalized: 'ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ',
        translation_id: 'Orang kaya memborong pahala',
        status: 'ok',
      })
      .select()
      .single();

    await supabase.from('words').insert([
      {
        segment_id: seg!.id,
        position: 1,
        ar: 'ذَهَبَ',
        meaning_id: 'pergi',
        nahwu: "Fi'il madhi",
        confidence: 0.98,
      },
    ]);

    // Eksekusi generate dan upload
    const result = await generateAndUploadPdf(doc!.id, supabase);
    expect(result.path).toContain(userId);
    expect(result.path.endsWith('.pdf')).toBe(true);
    expect(result.buffer.length).toBeGreaterThan(1000);

    // Verifikasi status dokumen di DB terupdate menjadi exported
    const { data: verifiedDoc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', doc!.id)
      .single();
    expect(verifiedDoc.status).toBe('exported');
    expect(verifiedDoc.pdf_path).toBe(result.path);

    // Clean up
    await supabase.storage.from('exports').remove([result.path]);
    await supabase.from('documents').delete().eq('id', doc!.id);
    await supabase.auth.admin.deleteUser(userId);
  }, 60000);
});
